// src/pages/UmkmList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function UmkmList() {
  const [umkms, setUmkms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUmkms = () => {
    setLoading(true);
    api
      .get("/umkms")
      .then((res) => setUmkms(res.data))
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

  if (loading) return <p className="p-6">Memuat UMKM...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Daftar UMKM</h1>
        {/* Tombol tambah sementara dinonaktifkan */}
        {/* <button
          onClick={() => navigate("/umkms/add")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Tambah UMKM
        </button> */}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">Nama UMKM</th>
              <th className="py-2 px-4 text-left">Alamat</th>
              <th className="py-2 px-4 text-left">NIB</th>
              <th className="py-2 px-4 text-left">PIRT</th>
              <th className="py-2 px-4 text-left">No HP</th>
              <th className="py-2 px-4 text-left">Kategori</th>
              <th className="py-2 px-4 text-left">Approval</th>
              <th className="py-2 px-4 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {umkms.map((u, idx) => (
              <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-2 px-4">{idx + 1}</td>
                <td className="py-2 px-4 font-medium text-gray-800">
                  {u.nama_umkm}
                </td>
                <td className="py-2 px-4">{u.alamat}</td>
                <td className="py-2 px-4">{u.nib}</td>
                <td className="py-2 px-4">{u.pirt}</td>
                <td className="py-2 px-4">{u.no_hp}</td>
                <td className="py-2 px-4">{u.kategori_umkm || "-"}</td>

                {/* Kolom Approval */}
                <td className="py-2 px-4">
                  {u.is_approved ? (
                    <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full text-sm font-medium">
                      ✅ Disetujui
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(u.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Setujui
                      </button>
                      <button
                        onClick={() => handleReject(u.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Tolak
                      </button>
                    </div>
                  )}
                </td>

                {/* Kolom Aksi */}
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/umkms/edit/${u.id}`)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
