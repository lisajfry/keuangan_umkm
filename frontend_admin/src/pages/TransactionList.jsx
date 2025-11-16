// src/pages/TransactionList.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [umkms, setUmkms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ umkm_id: "", month: "", year: "" });

  // 🔹 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const paginatedData = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transactions", { params: filters });
      setTransactions(res.data);
      setCurrentPage(1); // reset ke halaman pertama setiap filter baru
    } catch (err) {
      console.error("Gagal memuat transaksi:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUmkms = async () => {
    try {
      const res = await api.get("/umkms");
      setUmkms(res.data);
    } catch (err) {
      console.error("Gagal memuat UMKM:", err);
    }
  };

  useEffect(() => {
    fetchUmkms();
    fetchTransactions();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchTransactions();
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-indigo-700 mb-6 text-center md:text-left">
          📋 Daftar Transaksi Semua UMKM
        </h2>

        {/* 🔹 Filter Form */}
        <form
          onSubmit={handleFilterSubmit}
          className="flex flex-col md:flex-row flex-wrap gap-4 items-stretch md:items-end mb-8 bg-white shadow-md p-5 rounded-xl border border-indigo-100"
        >
          {/* UMKM */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Pilih UMKM:
            </label>
            <select
              name="umkm_id"
              value={filters.umkm_id}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            >
              <option value="">Semua UMKM</option>
              {umkms.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama_umkm}
                </option>
              ))}
            </select>
          </div>

          {/* Bulan */}
          <div className="flex-1 min-w-[140px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Bulan:
            </label>
            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            >
              <option value="">Semua</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          {/* Tahun */}
          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tahun:
            </label>
            <input
              type="number"
              name="year"
              placeholder="2025"
              value={filters.year}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>

          {/* Tombol Filter */}
          <div className="flex justify-end md:justify-start">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition-all duration-200 w-full md:w-auto"
            >
              Terapkan Filter
            </button>
          </div>
        </form>

        {/* 🔹 Tabel Transaksi */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-indigo-100">
          <table className="min-w-full text-sm md:text-base text-gray-700">
            <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
              <tr>
                <th className="p-3 text-left whitespace-nowrap">Tanggal</th>
                <th className="p-3 text-left whitespace-nowrap hidden sm:table-cell">
                  Deskripsi
                </th>
                <th className="p-3 text-left whitespace-nowrap hidden md:table-cell">
                  Kategori
                </th>
                <th className="p-3 text-left whitespace-nowrap">UMKM</th>
                <th className="p-3 text-right whitespace-nowrap">Total Debit</th>
                <th className="p-3 text-right whitespace-nowrap">Total Kredit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    Tidak ada transaksi ditemukan
                  </td>
                </tr>
              ) : (
                paginatedData.map((trx) => {
                  const totalDebit = trx.details?.reduce(
                    (sum, d) => sum + (parseFloat(d.debit) || 0),
                    0
                  );
                  const totalCredit = trx.details?.reduce(
                    (sum, d) => sum + (parseFloat(d.credit) || 0),
                    0
                  );

                  return (
                    <tr
                      key={trx.id}
                      className="border-b hover:bg-indigo-50 transition-colors"
                    >
                      <td className="p-3 whitespace-nowrap">{trx.date}</td>
                      <td className="p-3 hidden sm:table-cell">
                        {trx.description}
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        {trx.category}
                      </td>
                      <td className="p-3 whitespace-nowrap">{trx.nama_umkm}</td>
                      <td className="p-3 text-right text-green-600 font-semibold whitespace-nowrap">
                        Rp {totalDebit.toLocaleString("id-ID")}
                      </td>
                      <td className="p-3 text-right text-red-600 font-semibold whitespace-nowrap">
                        Rp {totalCredit.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 🔹 Pagination Controls (selalu tampil, sama gaya dengan TransactionList.jsx) */}
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

      </div>
    </DashboardLayout>
  );
}
