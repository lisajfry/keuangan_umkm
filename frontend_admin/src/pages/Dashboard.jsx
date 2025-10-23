// src/pages/Dashboard.jsx
import DashboardLayout from "../layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Dashboard Admin</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Transaksi
          </h3>
          <p className="text-3xl font-bold text-blue-600">Rp 120.000.000</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Pengeluaran Bulan Ini
          </h3>
          <p className="text-3xl font-bold text-red-500">Rp 42.500.000</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Sisa Anggaran
          </h3>
          <p className="text-3xl font-bold text-green-600">Rp 77.500.000</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Aktivitas Terbaru
        </h3>
        <ul className="space-y-3 text-gray-700">
          <li>• Pembayaran vendor “ABC Corp” sebesar Rp 12.000.000</li>
          <li>• Pengajuan dana operasional diterima</li>
          <li>• Update laporan keuangan mingguan</li>
        </ul>
      </div>
    </DashboardLayout>
  );
}
