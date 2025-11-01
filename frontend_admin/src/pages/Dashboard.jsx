// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/admin/report/summary-all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTotal(res.data.total_all || {});
      } catch (err) {
        console.error("Gagal ambil data total:", err);
        setError("Gagal memuat data total");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">Dashboard Admin</h1>

        {loading ? (
          <p className="text-gray-500 text-lg">Memuat data...</p>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow mb-4">
            ⚠️ {error}
          </div>
        ) : (
          <>
            {/* 🔹 Ringkasan total (6 card) */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
                <p className="text-gray-500 text-sm">Total Pendapatan</p>
                <h3 className="text-2xl font-semibold text-green-600">
                  Rp {Number(total.revenue || 0).toLocaleString("id-ID")}
                </h3>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
                <p className="text-gray-500 text-sm">Total Beban</p>
                <h3 className="text-2xl font-semibold text-red-500">
                  Rp {Number(total.expense || 0).toLocaleString("id-ID")}
                </h3>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
                <p className="text-gray-500 text-sm">Laba Bersih</p>
                <h3 className="text-2xl font-semibold text-blue-600">
                  Rp {Number(total.net_income || 0).toLocaleString("id-ID")}
                </h3>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
                <p className="text-gray-500 text-sm">Total Aset</p>
                <h3 className="text-2xl font-semibold text-indigo-600">
                  Rp {Number(total.assets || 0).toLocaleString("id-ID")}
                </h3>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
                <p className="text-gray-500 text-sm">Total Kewajiban</p>
                <h3 className="text-2xl font-semibold text-yellow-600">
                  Rp {Number(total.liabilities || 0).toLocaleString("id-ID")}
                </h3>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
                <p className="text-gray-500 text-sm">Total Ekuitas</p>
                <h3 className="text-2xl font-semibold text-purple-600">
                  Rp {Number(total.equity || 0).toLocaleString("id-ID")}
                </h3>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
