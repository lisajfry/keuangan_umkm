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
        const res = await axios.get(
          "http://127.0.0.1:8000/api/admin/report/summary-all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-6 text-center sm:text-left">
          Dashboard Admin
        </h1>

        {loading ? (
          <p className="text-gray-500 text-center sm:text-left">Memuat data...</p>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-3 sm:p-4 rounded-lg shadow mb-4 text-center sm:text-left">
            ⚠️ {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { label: "Total Pendapatan", value: total.revenue, color: "text-green-600" },
              { label: "Total Beban", value: total.expense, color: "text-red-500" },
              { label: "Laba Bersih", value: total.net_income, color: "text-blue-600" },
              { label: "Total Aset", value: total.assets, color: "text-indigo-600" },
              { label: "Total Kewajiban", value: total.liabilities, color: "text-yellow-600" },
              { label: "Total Ekuitas", value: total.equity, color: "text-purple-600" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition"
              >
                <p className="text-gray-500 text-sm">{item.label}</p>
                <h3 className={`text-xl sm:text-2xl font-semibold ${item.color}`}>
                  Rp {Number(item.value || 0).toLocaleString("id-ID")}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
