import React, { useState } from "react";
import umkmApi from "../api/umkmApi";

export default function TransactionTable({ data = [], onDeleted }) {
  const [expanded, setExpanded] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;
    try {
      await umkmApi.deleteTransaction(id);
      if (onDeleted) onDeleted();
    } catch (e) {
      console.error("Gagal menghapus transaksi:", e);
      alert("Gagal menghapus transaksi");
    }
  };

  if (!data || data.length === 0)
    return (
      <div className="text-slate-500 text-center py-10 italic">
        Tidak ada transaksi untuk periode ini.
      </div>
    );

  return (
    <div className="space-y-4">
      {data.map((t) => (
        <div
          key={t.id}
          className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-base font-semibold text-slate-800">
                {t.description || "Tanpa Deskripsi"}
              </h3>
              <p className="text-sm text-slate-500">
                {new Date(t.date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                className={`text-sm px-3 py-1.5 rounded-md font-medium border ${
                  expanded === t.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
                onClick={() => setExpanded(expanded === t.id ? null : t.id)}
              >
                {expanded === t.id ? "Tutup Detail" : "Lihat Detail"}
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-sm px-3 py-1.5 rounded-md font-medium border bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
              >
                Hapus
              </button>
            </div>
          </div>

          {/* Detail */}
          {expanded === t.id && (
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-700">
                  <tr>
                    <th className="text-left py-2 px-3 font-medium">Akun</th>
                    <th className="text-right py-2 px-3 font-medium">Debit (Rp)</th>
                    <th className="text-right py-2 px-3 font-medium">Kredit (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {t.details?.map((d, i) => (
                    <tr
                      key={i}
                      className="border-t border-slate-200 hover:bg-white transition"
                    >
                      <td className="py-2 px-3 text-slate-700">
                        {d.account?.name ?? "Akun Tidak Diketahui"}
                      </td>
                      <td className="py-2 px-3 text-right text-green-700">
                        {d.debit > 0
                          ? Number(d.debit).toLocaleString("id-ID")
                          : "-"}
                      </td>
                      <td className="py-2 px-3 text-right text-red-700">
                        {d.credit > 0
                          ? Number(d.credit).toLocaleString("id-ID")
                          : "-"}
                      </td>
                    </tr>
                  ))}

                  <tr className="border-t bg-slate-100 font-semibold text-slate-800">
                    <td className="py-2 px-3 text-right">Total</td>
                    <td className="py-2 px-3 text-right">
                      Rp{" "}
                      {t.details
                        ?.reduce((a, b) => a + Number(b.debit || 0), 0)
                        .toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 px-3 text-right">
                      Rp{" "}
                      {t.details
                        ?.reduce((a, b) => a + Number(b.credit || 0), 0)
                        .toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
