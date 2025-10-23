import React, { useEffect, useState } from "react";
import umkmApi from '../api/umkmApi'

export default function TransactionForm() {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [cashFlowCategory, setCashFlowCategory] = useState("operating");
  const [isDividend, setIsDividend] = useState(false);
  const [details, setDetails] = useState([{ account_id: "", debit: "", credit: "" }]);

  const [accounts, setAccounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ambil daftar akun dari API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await umkmApi.getAccounts();
        // kelompokkan by type biar rapih
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
        cash_flow_category: cashFlowCategory,
        is_dividend: isDividend ? 1 : 0,
        category: "general",
        details,
      });

      setMessage("✅ Transaksi berhasil disimpan!");
      setDate("");
      setDescription("");
      setCashFlowCategory("operating");
      setIsDividend(false);
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
      {/* Blok 1: Info Umum */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700">Info Transaksi</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-2 rounded-lg"
          required
        />
        <textarea
          placeholder="Deskripsi transaksi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded-lg"
        />
        <select
          value={cashFlowCategory}
          onChange={(e) => setCashFlowCategory(e.target.value)}
          className="w-full border p-2 rounded-lg"
        >
          <option value="operating">Operating</option>
          <option value="investing">Investing</option>
          <option value="financing">Financing</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isDividend}
            onChange={(e) => setIsDividend(e.target.checked)}
          />
          <span>Apakah ini dividen?</span>
        </label>
      </div>

      {/* Blok 2: Detail Jurnal */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700">Detail Jurnal</h3>
        {details.map((detail, i) => (
          <div key={i} className="flex gap-2">
            <select
              className="w-1/2 border p-2 rounded-lg"
              value={detail.account_id}
              onChange={(e) => {
                const newDetails = [...details];
                newDetails[i].account_id = e.target.value;
                setDetails(newDetails);
              }}
              required
            >
              <option value="">-- Pilih Akun --</option>
              {Object.entries(accounts).map(([type, list]) => (
                <optgroup key={type} label={type.toUpperCase()}>
                  {list.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <input
              type="number"
              placeholder="Debit"
              className="w-1/4 border p-2 rounded-lg"
              value={detail.debit}
              onChange={(e) => {
                const newDetails = [...details];
                newDetails[i].debit = e.target.value;
                setDetails(newDetails);
              }}
            />
            <input
              type="number"
              placeholder="Kredit"
              className="w-1/4 border p-2 rounded-lg"
              value={detail.credit}
              onChange={(e) => {
                const newDetails = [...details];
                newDetails[i].credit = e.target.value;
                setDetails(newDetails);
              }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addDetail}
          className="text-sm text-blue-600 hover:underline"
        >
          + Tambah Akun
        </button>
        <div className="text-sm mt-2">
          <p>Total Debit: <b>{totalDebit}</b></p>
          <p>Total Kredit: <b>{totalCredit}</b></p>
          {!isBalanced && (
            <p className="text-red-600">⚠ Debit dan Kredit belum balance</p>
          )}
        </div>
      </div>

      {/* Blok 3: Submit */}
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