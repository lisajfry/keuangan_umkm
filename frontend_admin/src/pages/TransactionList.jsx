// src/pages/TransactionList.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [umkms, setUmkms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    umkm_id: "",
    month: "",
    year: "",
  });

  // 🔹 Ambil semua transaksi
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transactions", { params: filters });
      setTransactions(res.data);
    } catch (err) {
      console.error("Gagal memuat transaksi:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Ambil daftar UMKM
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
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">
          📋 Daftar Transaksi Semua UMKM
        </h2>

        {/* 🔹 Filter Form */}
        <form
          onSubmit={handleFilterSubmit}
          className="flex flex-wrap gap-4 items-end mb-8 bg-white shadow-md p-5 rounded-xl border border-indigo-100"
        >
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Pilih UMKM:
            </label>
            <select
              name="umkm_id"
              value={filters.umkm_id}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-48 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            >
              <option value="">Semua UMKM</option>
              {umkms.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nama_umkm}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Bulan:
            </label>
            <select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-36 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            >
              <option value="">Semua</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tahun:
            </label>
            <input
              type="number"
              name="year"
              placeholder="2025"
              value={filters.year}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-lg px-3 py-2 w-28 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition-all duration-200"
          >
            Terapkan Filter
          </button>
        </form>

        {/* 🔹 Tabel Transaksi */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-indigo-100">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-3 text-left">Tanggal</th>
                <th className="p-3 text-left">Deskripsi</th>
                <th className="p-3 text-left">Kategori</th>
                <th className="p-3 text-left">UMKM</th>
                <th className="p-3 text-right">Total Debit</th>
                <th className="p-3 text-right">Total Kredit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    Tidak ada transaksi ditemukan
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => {
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
                      <td className="p-3">{trx.date}</td>
                      <td className="p-3">{trx.description}</td>
                      <td className="p-3">{trx.category}</td>
                      <td className="p-3">{trx.nama_umkm}</td>
                      <td className="p-3 text-right text-green-600 font-semibold">
                        Rp {totalDebit.toLocaleString("id-ID")}
                      </td>
                      <td className="p-3 text-right text-red-600 font-semibold">
                        Rp {totalCredit.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
