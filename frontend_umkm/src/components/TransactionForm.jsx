import React, { useEffect, useState } from "react";
import umkmApi from '../api/umkmApi'

export default function TransactionForm() {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState([{ account_id: "", debit: "", credit: "" }]);

  const [accounts, setAccounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ambil daftar akun dari API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await umkmApi.getAccounts();
        console.log("Accounts loaded:", data);

        // kelompokkan by type biar rapi
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
  const totalDebit = details.reduce((sum, d) => sum + Number(d.debit || 0), 0);
  const totalCredit = details.reduce((sum, d) => sum + Number(d.credit || 0), 0);
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
      await umkmApi.createTransaction({
        date,
        description,
        details,
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
      {/* Info Umum */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700">Info Transaksi</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded-lg"
          required
        />
      </div>

      {/* Detail Jurnal */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700">Detail Jurnal</h3>
        {details.map((detail, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <select
              className="w-1/2 border p-2 rounded-lg"
              value={detail.account_id}
              onChange={(e) => {
                const accountId = e.target.value;
                const selectedAccount = Object.values(accounts)
                  .flat()
                  .find(a => a.id == accountId);

                const newDetails = [...details];
                newDetails[i] = {
                  ...newDetails[i],
                  account_id: accountId,
                  normal_balance: selectedAccount ? selectedAccount.normal_balance : null,
                  debit: "",
                  credit: ""
                };
                setDetails(newDetails);
              }}
              required
            >
              <option value="">-- Pilih Akun --</option>
              {Object.values(accounts).flat().map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Debit"
              className={`w-1/4 border p-2 rounded-lg ${detail.normal_balance === "credit" ? "bg-gray-200 cursor-not-allowed" : ""
                }`}
              value={detail.debit}
              onChange={(e) => {
                const newDetails = [...details];
                newDetails[i] = { ...newDetails[i], debit: e.target.value, credit: "" };
                setDetails(newDetails);
              }}
              disabled={detail.normal_balance === "credit"}
            />

            <input
              type="number"
              placeholder="Kredit"
              className={`w-1/4 border p-2 rounded-lg ${detail.normal_balance === "debit" ? "bg-gray-200 cursor-not-allowed" : ""
                }`}
              value={detail.credit}
              onChange={(e) => {
                const newDetails = [...details];
                newDetails[i] = { ...newDetails[i], credit: e.target.value, debit: "" };
                setDetails(newDetails);
              }}
              disabled={detail.normal_balance === "debit"}
            />

            <button
              type="button"
              onClick={() => {
                const newDetails = details.filter((_, index) => index !== i);
                setDetails(newDetails);
              }}
              className="px-3 py-2 bg-red-500 text-white rounded-lg"
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
        <div className="text-sm mt-2">
          <p>Total Debit: <b>{totalDebit}</b></p>
          <p>Total Kredit: <b>{totalCredit}</b></p>
          {!isBalanced && (
            <p className="text-red-600">⚠ Debit dan Kredit belum balance</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isBalanced || loading}
          className={`px-4 py-2 rounded-lg text-white ${isBalanced
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
