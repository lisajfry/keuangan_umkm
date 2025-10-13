// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  try {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userData || userData === "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
  } catch (err) {
    console.error("Gagal parsing user data:", err);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }
}, [navigate]);


  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Memuat Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Dashboard Admin</h1>
        <div className="flex items-center gap-4">
          <p className="text-gray-700 font-medium">👋 Hai, {user.name}</p>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Total Transaksi
            </h2>
            <p className="text-3xl font-bold text-indigo-600">Rp 120.000.000</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Pengeluaran Bulan Ini
            </h2>
            <p className="text-3xl font-bold text-red-500">Rp 42.500.000</p>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Sisa Anggaran
            </h2>
            <p className="text-3xl font-bold text-green-600">Rp 77.500.000</p>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-4">
  <button
    onClick={() => navigate("/umkms")}
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200"
  >
    Daftar UMKM
  </button>

  <button
    onClick={() => navigate("/transactions")}
    className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200"
  >
    Daftar Transaksi
  </button>
</div>


        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">
            Aktivitas Terbaru
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li>• Pembayaran vendor “ABC Corp” sebesar Rp 12.000.000</li>
            <li>• Pengajuan dana operasional diterima</li>
            <li>• Update laporan keuangan mingguan</li>

            
          </ul>
        </div>
      </main>
    </div>
  );
}
