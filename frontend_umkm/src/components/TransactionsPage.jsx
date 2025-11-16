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

  // 🔹 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    setCurrentPage(1); // reset ke halaman 1 kalau filter berubah
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
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          📊 Transaksi
        </h2>
        <button
          onClick={() => navigate("/transactions/new")}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-150 text-sm sm:text-base"
        >
          + Tambah Transaksi
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-slate-200">
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-slate-300 rounded-md px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 transition"
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
          className="border border-slate-300 rounded-md px-2 py-1.5 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 transition"
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
          className="text-xs sm:text-sm text-slate-600 hover:text-blue-600 transition"
        >
          🔄 Reset Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-4 md:p-6 overflow-x-auto">
        {loading ? (
          <div className="text-center py-10 text-slate-500 animate-pulse">
            Memuat data transaksi...
          </div>
        ) : (
          <>
            <TransactionTable data={paginatedData} onDeleted={load} />

            {/* 🔹 Pagination Controls (selalu tampil) */}
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  currentPage === 1
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                Sebelumnya
              </button>

              <span className="text-gray-700 font-medium">
                Halaman {currentPage} dari {totalPages || 1}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  currentPage === totalPages || totalPages === 0
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                Berikutnya
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
