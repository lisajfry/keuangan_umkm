// src/pages/AdminSummary.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function AdminSummary() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState([]);
  const [total, setTotal] = useState({});
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // 🔹 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(summary.length / itemsPerPage);
  const paginatedData = summary.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const months = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember",
  ];

  const fetchSummary = async (selectedMonth, selectedYear) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://127.0.0.1:8000/api/admin/report/summary-all?month=${selectedMonth}&year=${selectedYear}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(res.data.summary_per_umkm || []);
      setTotal(res.data.total_all || {});
      setError(null);
      setCurrentPage(1); // reset halaman ketika data di-refresh
    } catch (err) {
      console.error("Gagal memuat data summary:", err);
      setError("Gagal memuat data summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(month, year);
  }, [month, year]);

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://127.0.0.1:8000/api/admin/report/download?month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `laporan_semua_umkm_${year}_${month}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Gagal download file:", err);
      alert("❌ Gagal download file laporan.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* 🔹 Header & Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-indigo-700 leading-snug">
              📊 Rekapitulasi Keuangan UMKM
            </h1>
          </div>

          {/* Filter */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <label htmlFor="bulan" className="text-gray-600 font-medium">
                Bulan:
              </label>
              <select
                id="bulan"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full sm:w-auto"
              >
                {months.map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <label htmlFor="tahun" className="text-gray-600 font-medium">
                Tahun:
              </label>
              <select
                id="tahun"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full sm:w-auto"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-150 w-full sm:w-auto"
            >
              ⬇️ Download Excel
            </button>
          </div>
        </div>

        {/* 🔹 Konten */}
        {loading ? (
          <p className="text-gray-500 text-lg">Memuat data...</p>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow mb-4">
            ⚠️ {error}
          </div>
        ) : (
          <>
            {/* 🔹 Ringkasan Total */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[ 
                { label: "Total Pendapatan", value: total.revenue, color: "text-green-600" },
                { label: "Total Beban", value: total.expense, color: "text-red-500" },
                { label: "Laba Bersih", value: total.net_income, color: "text-blue-600" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:scale-[1.01] transition-all text-center sm:text-left"
                >
                  <p className="text-gray-500 text-sm">{item.label}</p>
                  <h3 className={`text-xl sm:text-2xl font-semibold ${item.color}`}>
                    Rp {Number(item.value || 0).toLocaleString("id-ID")}
                  </h3>
                </div>
              ))}
            </div>

            {/* 🔹 Tabel Data */}
            <div className="bg-white rounded-xl shadow overflow-x-auto border border-gray-200">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100 text-gray-800 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left whitespace-nowrap">Nama UMKM</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Pendapatan</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Beban</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Laba Bersih</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Aset</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Kewajiban</th>
                    <th className="px-4 py-3 text-right whitespace-nowrap">Ekuitas</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((u, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium whitespace-nowrap">
                          {u.nama_umkm}
                        </td>
                        <td className="px-4 py-3 text-right text-green-600 whitespace-nowrap">
                          Rp {Number(u.revenue).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-right text-red-500 whitespace-nowrap">
                          Rp {Number(u.expense).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-blue-600 whitespace-nowrap">
                          Rp {Number(u.net_income).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          Rp {Number(u.total_assets).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          Rp {Number(u.total_liabilities).toLocaleString("id-ID")}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          Rp {Number(u.total_equity).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-6 text-gray-500">
                        Tidak ada data UMKM untuk bulan ini
                      </td>
                    </tr>
                  )}

                  {/* 🔹 Total Keseluruhan */}
                  <tr className="bg-blue-50 text-blue-800 font-semibold border-t">
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      TOTAL SEMUA UMKM
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      Rp {Number(total.revenue).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      Rp {Number(total.expense).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      Rp {Number(total.net_income).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      Rp {Number(total.assets).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      Rp {Number(total.liabilities).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      Rp {Number(total.equity).toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

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
    </DashboardLayout>
  );
}
