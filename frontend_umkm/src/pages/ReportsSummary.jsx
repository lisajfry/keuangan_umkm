import React, { useState, useEffect } from "react";
import umkmApi from "../api/umkmApi";

const fmt = (value) => {
  if (value === null || value === undefined || value === "" || isNaN(value))
    return "-";
  return `Rp ${Number(value).toLocaleString("id-ID")}`;
};

const Section = ({ title, subtitle, color, children }) => (
  <div className="mb-10">
    <div className={`border-l-4 pl-3 mb-3 ${color} bg-gray-50 py-2 rounded`}>
      <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
      {subtitle && <p className="text-gray-500 text-xs sm:text-sm">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const Table = ({ headers, rows, footer }) => (
  <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
    <table className="w-full border-collapse text-xs sm:text-sm">
      <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
        <tr>
          {headers.map((h, i) => (
            <th
              key={i}
              className="border border-gray-300 px-2 sm:px-3 py-2 text-left font-semibold text-gray-800"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows?.length > 0 ? (
          rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border border-gray-300 px-2 sm:px-3 py-1 text-gray-700"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={headers.length}
              className="text-center py-3 text-gray-500"
            >
              Tidak ada data
            </td>
          </tr>
        )}
      </tbody>
      {footer && (
        <tfoot className="bg-gray-100 font-semibold">
          {footer.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="border border-gray-300 px-3 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tfoot>
      )}
    </table>
  </div>
);

export default function ReportSummary() {
  const [report, setReport] = useState(null);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReport = async (selectedMonth = "") => {
    setLoading(true);
    try {
      const data = await umkmApi.getSummary({ month: selectedMonth });
      console.log("HASIL DARI BACKEND:", data);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    try {
      const res = await umkmApi.downloadReportExcel(month);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Laporan_Keuangan_${month || "semua"}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert("Gagal mengunduh file Excel.");
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading)
    return <p className="text-gray-600 text-center mt-4">Memuat laporan...</p>;
  if (!report)
    return <p className="text-gray-600 text-center mt-4">Tidak ada data laporan.</p>;

  const income = report.income_statement || {};
  const retained = report.retained_earnings || {};
  const balance = report.balance_sheet || {};
  const cash = report.cash_flow || {};

  

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md max-w-6xl mx-auto">
      {/* === HEADER FILTER === */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">
          📊 Ringkasan Laporan Keuangan
        </h1>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border px-2 py-1 text-xs sm:text-sm rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => fetchReport(month)}
            className="bg-blue-600 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
          >
            🔍 Filter
          </button>
          <button
            onClick={downloadExcel}
            className="bg-green-600 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-md hover:bg-green-700 transition"
          >
            📥 Download
          </button>
        </div>
      </div>

      {/* === LABA RUGI === */}
      <Section
        title="Laporan Laba Rugi"
        subtitle="Menunjukkan total pendapatan, beban, dan laba bersih"
        color="border-blue-500"
      >
        <Table
          headers={["Keterangan", "Nilai"]}
          rows={income.details?.map((d) => {
            const value =
              d.type === "revenue"
                ? d.total_credit - d.total_debit
                : d.total_debit - d.total_credit;
            return [d.name, fmt(value)];
          })}
          footer={[
            ["Total Pendapatan", fmt(income.revenue)],
            ["Total Beban", fmt(income.expense)],
            ["Laba Bersih", fmt(income.netIncome)],

          ]}
        />
      </Section>

      {/* === LABA DITAHAN === */}
      <Section
        title="Laporan Laba Ditahan"
        subtitle="Menampilkan perubahan saldo laba perusahaan"
        color="border-green-500"
      >
        <Table
          headers={["Keterangan", "Nilai"]}
          rows={[
            ["Saldo Awal", fmt(retained.beginning)],
            ["Laba Bersih", fmt(retained.income)],
            ["Dividen", fmt(retained.dividends)],
          ]}
          footer={[["Saldo Akhir", fmt(retained.ending)]]}
        />
      </Section>

      {/* === NERACA === */}
      <Section
        title="Neraca (Balance Sheet)"
        subtitle="Perbandingan total aset dengan kewajiban dan ekuitas"
        color="border-purple-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2 text-gray-700 text-sm sm:text-base">
              💰 Aset
            </h3>
            <Table
              headers={["Nama Akun", "Saldo"]}
              rows={balance.assets?.map((a) => [a.name, fmt(a.balance)]) || []}
              footer={[["Total Aset", fmt(balance.total_assets)]]}
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-700 text-sm sm:text-base">
              🏦 Kewajiban & Ekuitas
            </h3>
            <Table
              headers={["Nama Akun", "Saldo"]}
              rows={[
                ...(balance.liability?.map((l) => [l.name, fmt(l.balance)]) || []),
                ...(balance.equity?.map((e) => [e.name, fmt(e.balance)]) || []),
              ]}
              footer={[
                [
                  "Total Kewajiban + Ekuitas",
                  fmt(
                    (balance.total_liabilities || 0) +
                      (balance.total_equity || 0)
                  ),
                ],
              ]}
            />
          </div>
        </div>

        <div className="mt-4 text-right font-semibold text-sm sm:text-base">
          Status Neraca:{" "}
          <span
            className={`${
              balance.balanced ? "text-green-600" : "text-red-600"
            }`}
          >
            {balance.balanced ? "BALANCE ✅" : "TIDAK BALANCE ❌"}
          </span>
        </div>
      </Section>

      {/* === ARUS KAS === */}
      <Section
        title="Laporan Arus Kas"
        subtitle="Menunjukkan aliran kas dari aktivitas operasi, investasi, dan pendanaan"
        color="border-orange-500"
      >
        <Table
          headers={["Aktivitas", "Nilai"]}
          rows={[
            ["Kas dari Aktivitas Operasi", fmt(cash.operating)],
            ["Kas dari Aktivitas Investasi", fmt(cash.investing)],
            ["Kas dari Aktivitas Pendanaan", fmt(cash.financing)],
          ]}
          footer={[
            ["Kenaikan (Penurunan) Bersih Kas", fmt(cash.net_change_in_cash)],
            ["Saldo Awal Kas", fmt(cash.cash_start)],
            ["Saldo Akhir Kas", fmt(cash.cash_end)],
          ]}
        />

        {cash.details && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
              Rincian Aktivitas Operasi:
            </h4>
            <ul className="text-gray-700 text-xs sm:text-sm space-y-1">
              <li>
                • Laba Bersih:{" "}
                <span className="font-medium">{fmt(cash.details.net_income)}</span>
              </li>
              <li>
                • Penyesuaian (Non Kas):{" "}
                <span className="font-medium">
                  {fmt(cash.details.operating_adjustments)}
                </span>
              </li>
              <li>
                • Penyusutan:{" "}
                <span className="font-medium">
                  {fmt(cash.details.depreciation)}
                </span>
              </li>
            </ul>
          </div>
        )}
      </Section>
    </div>
  );
}
