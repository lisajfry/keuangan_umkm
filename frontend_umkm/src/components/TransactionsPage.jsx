import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import umkmApi from "../api/umkmApi";
import TransactionTable from "../components/TransactionTable";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await umkmApi.getTransactions();
      setTransactions(data);
      setFilteredData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    // filter transaksi berdasarkan bulan dan tahun
    if (!month && !year) {
      setFilteredData(transactions);
      return;
    }

    const filtered = transactions.filter((t) => {
      const d = new Date(t.date);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      return (
        (!month || m === Number(month)) &&
        (!year || y === Number(year))
      );
    });

    setFilteredData(filtered);
  }, [month, year, transactions]);

  const months = [
    { value: "", label: "Semua Bulan" },
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const years = Array.from(
    new Set(transactions.map((t) => new Date(t.date).getFullYear()))
  )
    .sort((a, b) => b - a)
    .map((y) => ({ value: y, label: y }));

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="text-2xl font-bold text-slate-800">📊 Transaksi</h2>
        <button
          onClick={() => navigate("/transactions/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-150"
        >
          + Tambah Transaksi
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Tahun</option>
          {years.map((y) => (
            <option key={y.value} value={y.value}>
              {y.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setMonth("");
            setYear("");
          }}
          className="text-sm text-slate-600 hover:text-blue-600 transition"
        >
          🔄 Reset Filter
        </button>
      </div>

      {/* Table */}
      <div className="card bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {loading ? (
          <div className="text-center py-10 text-slate-500 animate-pulse">
            Memuat data transaksi...
          </div>
        ) : (
          <TransactionTable data={filteredData} onDeleted={load} />
        )}
      </div>
    </div>
  );
}
