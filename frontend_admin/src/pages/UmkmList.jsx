import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";

export default function UmkmList() {
  const [umkms, setUmkms] = useState([]);
  const [filteredUmkms, setFilteredUmkms] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUmkms = () => {
    setLoading(true);
    api
      .get("/umkms")
      .then((res) => {
        setUmkms(res.data);
        setFilteredUmkms(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Gagal memuat data");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUmkms();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus UMKM ini?")) return;
    try {
      await api.delete(`/umkms/${id}`);
      alert("UMKM berhasil dihapus");
      fetchUmkms();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus UMKM");
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Setujui pendaftaran UMKM ini?")) return;
    try {
      await api.post(`/umkms/${id}/approve`);
      alert("✅ UMKM berhasil disetujui");
      fetchUmkms();
    } catch (err) {
      console.error(err);
      alert("Gagal menyetujui UMKM");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Tolak pendaftaran UMKM ini?")) return;
    try {
      await api.post(`/umkms/${id}/reject`);
      alert("❌ UMKM telah ditolak");
      fetchUmkms();
    } catch (err) {
      console.error(err);
      alert("Gagal menolak UMKM");
    }
  };

  // 🔍 Filter pencarian realtime
  useEffect(() => {
    const result = umkms.filter((u) =>
      u.nama_umkm.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUmkms(result);
  }, [search, umkms]);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-indigo-700 mb-6">
            📋 Daftar UMKM
          </h1>
          <input
            type="text"
            placeholder="🔍 Cari UMKM..."
            className="border border-gray-300 focus:ring-2 focus:ring-indigo-400 rounded-lg px-4 py-2 w-full md:w-64 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-3 text-gray-600">Memuat data UMKM...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : filteredUmkms.length === 0 ? (
          <p className="text-gray-500 text-center">Tidak ada data UMKM ditemukan.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
                <tr>
                  <th className="py-3 px-4 rounded-tl-lg">#</th>
                  <th className="py-3 px-4">Nama UMKM</th>
                  <th className="py-3 px-4">Alamat</th>
                  <th className="py-3 px-4">NIB</th>
                  <th className="py-3 px-4">PIRT</th>
                  <th className="py-3 px-4">No HP</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Approval</th>
                  <th className="py-3 px-4 rounded-tr-lg text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUmkms.map((u, idx) => (
                  <tr
                    key={u.id}
                    className={`transition-colors ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-indigo-50`}
                  >
                    <td className="py-3 px-4 font-medium text-gray-700">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-800">
                      {u.nama_umkm}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{u.alamat}</td>
                    <td className="py-3 px-4">{u.nib}</td>
                    <td className="py-3 px-4">{u.pirt}</td>
                    <td className="py-3 px-4">{u.no_hp}</td>
                    <td className="py-3 px-4">{u.kategori_umkm || "-"}</td>

                    <td className="py-3 px-4">
                      {u.is_approved ? (
                        <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-medium">
                          ✅ Disetujui
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(u.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs transition-all"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleReject(u.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition-all"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/umkms/edit/${u.id}`)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition-all"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
