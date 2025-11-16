import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";

export default function EditUmkm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [umkm, setUmkm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    api
      .get(`/umkms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUmkm(res.data))
      .catch((err) => {
        console.error(err);
        setError("Gagal memuat data UMKM");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (e) => {
    setUmkm({ ...umkm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      await api.put(`/umkms/${id}`, umkm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ UMKM berhasil diperbarui!");
      navigate("/umkms");
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-3 text-gray-600">Memuat data UMKM...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error)
    return (
      <DashboardLayout>
        <p className="p-6 text-red-500 text-center">{error}</p>
      </DashboardLayout>
    );

  if (!umkm) return null;

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-700 tracking-tight">
            ✏️ Edit UMKM
          </h1>
          <button
            onClick={() => navigate("/umkms")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-all"
          >
            ← Kembali
          </button>
        </div>

        {/* Form Section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Nama UMKM
              </label>
              <input
                type="text"
                name="nama_umkm"
                value={umkm.nama_umkm}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Alamat
              </label>
              <textarea
                name="alamat"
                value={umkm.alamat || ""}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  NIB
                </label>
                <input
                  type="text"
                  name="nib"
                  value={umkm.nib}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                  required
                />
              </div>

              
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  No. HP
                </label>
                <input
                  type="text"
                  name="no_hp"
                  value={umkm.no_hp || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Kategori UMKM
                </label>
                <input
                  type="text"
                  name="kategori_umkm"
                  value={umkm.kategori_umkm || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-2.5 rounded-lg text-white font-semibold transition-all ${
                  saving
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow"
                }`}
              >
                {saving ? "Menyimpan..." : "💾 Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
