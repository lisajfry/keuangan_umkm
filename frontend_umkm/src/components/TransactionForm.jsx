import React, { useEffect, useState } from "react";
import umkmApi from '../api/umkmApi';

export default function TransactionForm() {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState([{ account_id: "", debit: "", credit: "" }]);
  const [accounts, setAccounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ fungsi format rupiah dengan titik ribuan
  const formatRupiah = (value) => {
    if (!value) return "";
    const numberString = value.replace(/[^\d]/g, ""); // hanya angka
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // fungsi ubah ke angka biasa untuk hitung total
  const parseNumber = (value) => {
    if (!value) return 0;
    return Number(value.replace(/\./g, "")); // hapus titik lalu ubah ke number
  };

  // ambil daftar akun dari API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await umkmApi.getAccounts();
        const grouped = data.reduce((acc, item) => {
          if (!acc[item.type]) acc[item.type] = [];
          acc[item.type].push(item);
          return acc;
        }, {});
        setAccounts(grouped);
      } catch (err) {
        console.error("Gagal load accounts", err);
      }
    };
    fetchAccounts();
  }, []);

  // hitung total debit & kredit
  const totalDebit = details.reduce((sum, d) => sum + parseNumber(d.debit || 0), 0);
  const totalCredit = details.reduce((sum, d) => sum + parseNumber(d.credit || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const addDetail = () => {
    setDetails([...details, { account_id: "", debit: "", credit: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isBalanced) {
      setMessage("⚠ Transaksi tidak seimbang (Debit ≠ Kredit)");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // kirim ke API dengan nilai tanpa titik
      await umkmApi.createTransaction({
        date,
        description,
        details: details.map((d) => ({
          ...d,
          debit: parseNumber(d.debit),
          credit: parseNumber(d.credit),
        })),
      });

      setMessage("✅ Transaksi berhasil disimpan!");
      setDate("");
      setDescription("");
      setDetails([{ account_id: "", debit: "", credit: "" }]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Gagal menyimpan transaksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg space-y-6"
    >
      {/* Info Transaksi */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700 text-sm">Info Transaksi</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border px-2 py-1.5 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Detail Jurnal */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700 text-sm">Detail Jurnal</h3>
        {details.map((detail, i) => (
          <div key={i} className="flex items-center gap-1.5 mb-2">
            <select
              className="w-1/2 border px-2 py-1.5 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
              value={detail.account_id}
              onChange={(e) => {
                const accountId = e.target.value;
                const selectedAccount = Object.values(accounts)
                  .flat()
                  .find((a) => a.id == accountId);
                const newDetails = [...details];
                newDetails[i] = {
                  ...newDetails[i],
                  account_id: accountId,
                  normal_balance: selectedAccount
                    ? selectedAccount.normal_balance
                    : null,
                  debit: "",
                  credit: "",
                };
                setDetails(newDetails);
              }}
              required
            >
              <option value="">-- Pilih Akun --</option>
              {Object.values(accounts)
                .flat()
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
            </select>

            {/* Input Debit */}
            <input
              type="text"
              placeholder="Debit"
              className={`w-1/4 border px-2 py-1.5 rounded-md text-sm ${
                detail.normal_balance === "credit"
                  ? "bg-gray-100 cursor-not-allowed"
                  : "focus:ring-2 focus:ring-blue-500"
              }`}
              value={detail.debit}
              onChange={(e) => {
                const value = formatRupiah(e.target.value);
                const newDetails = [...details];
                newDetails[i] = { ...newDetails[i], debit: value, credit: "" };
                setDetails(newDetails);
              }}
              disabled={detail.normal_balance === "credit"}
            />

            {/* Input Kredit */}
            <input
              type="text"
              placeholder="Kredit"
              className={`w-1/4 border px-2 py-1.5 rounded-md text-sm ${
                detail.normal_balance === "debit"
                  ? "bg-gray-100 cursor-not-allowed"
                  : "focus:ring-2 focus:ring-blue-500"
              }`}
              value={detail.credit}
              onChange={(e) => {
                const value = formatRupiah(e.target.value);
                const newDetails = [...details];
                newDetails[i] = { ...newDetails[i], credit: value, debit: "" };
                setDetails(newDetails);
              }}
              disabled={detail.normal_balance === "debit"}
            />

            {/* Tombol Hapus */}
            <button
              type="button"
              onClick={() => {
                const newDetails = details.filter((_, index) => index !== i);
                setDetails(newDetails);
              }}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Hapus
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addDetail}
          className="text-sm text-blue-600 hover:underline"
        >
          + Tambah Akun
        </button>

        <textarea
          placeholder="Deskripsi transaksi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded-lg"
        />

        {/* Total */}
        <div className="text-sm mt-2">
          <p>
            Total Debit: <b>Rp {formatRupiah(totalDebit.toString())}</b>
          </p>
          <p>
            Total Kredit: <b>Rp {formatRupiah(totalCredit.toString())}</b>
          </p>
          {!isBalanced && (
            <p className="text-red-600">⚠ Debit dan Kredit belum balance</p>
          )}
        </div>
      </div>

      {/* Tombol Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isBalanced || loading}
          className={`px-4 py-2 rounded-lg text-white ${
            isBalanced
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Menyimpan..." : "Simpan Transaksi"}
        </button>
      </div>

      {message && <p className="text-center mt-4">{message}</p>}
    </form>
  );
}
