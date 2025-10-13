import React, { useEffect, useState } from "react";
import api from "../api/api"; // sesuaikan path api.js

const TransactionList = ({ currentUser }) => {
  const [transactions, setTransactions] = useState([]);
  const [umkms, setUmkms] = useState([]);
  const [filters, setFilters] = useState({
    umkm_id: "",
    start_date: "",
    end_date: "",
    page: 1,
    per_page: 10,
  });

  const fetchTransactions = async () => {
  try {
    let url = "/umkm/" + (filters.umkm_id || "all") + "/transactions";
    const res = await api.get(url, { params: filters });
    setTransactions(res.data.data || res.data);
  } catch (error) {
    console.error(error);
    alert("Gagal mengambil data transaksi dari backend UMKM");
  }
};


  const fetchUmkms = async () => {
    if (currentUser.role !== "admin") return;
    try {
      const res = await api.get("/umkms"); // endpoint daftar UMKM
      setUmkms(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchUmkms();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Daftar Transaksi</h2>

      {/* Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        {currentUser.role === "admin" && (
          <select
            name="umkm_id"
            value={filters.umkm_id}
            onChange={handleFilterChange}
            className="border px-3 py-2 rounded"
          >
            <option value="">-- Semua UMKM --</option>
            {umkms.map((umkm) => (
              <option key={umkm.id} value={umkm.id}>
                {umkm.name}
              </option>
            ))}
          </select>
        )}

        <input
          type="date"
          name="start_date"
          value={filters.start_date}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          name="end_date"
          value={filters.end_date}
          onChange={handleFilterChange}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={fetchTransactions}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Filter
        </button>
      </div>

      {/* Tabel transaksi */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Tanggal</th>
            <th className="border px-3 py-2">Deskripsi</th>
            <th className="border px-3 py-2">Kategori</th>
            <th className="border px-3 py-2">Total Debit</th>
            <th className="border px-3 py-2">Total Kredit</th>
            <th className="border px-3 py-2">UMKM</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                Tidak ada transaksi
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="border px-3 py-2">{tx.id}</td>
                <td className="border px-3 py-2">{tx.date}</td>
                <td className="border px-3 py-2">{tx.description}</td>
                <td className="border px-3 py-2">{tx.category}</td>
                <td className="border px-3 py-2">{tx.total_debit}</td>
                <td className="border px-3 py-2">{tx.total_credit}</td>
                <td className="border px-3 py-2">{tx.created_by}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      
    </div>
  );
};

export default TransactionList;
