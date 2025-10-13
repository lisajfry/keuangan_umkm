// src/pages/EditUmkm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

export default function EditUmkm() {
  const { id } = useParams(); // ambil id dari URL
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
      .then((res) => {
        setUmkm(res.data);
      })
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
      alert("UMKM berhasil diupdate");
      navigate("/umkms");
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Memuat data UMKM...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!umkm) return null;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit UMKM</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block font-medium mb-1">Nama UMKM</label>
          <input
            type="text"
            name="nama_umkm"
            value={umkm.nama_umkm}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Alamat</label>
          <textarea
            name="alamat"
            value={umkm.alamat || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">NIB</label>
          <input
            type="text"
            name="nib"
            value={umkm.nib}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">PIRT</label>
          <input
            type="text"
            name="pirt"
            value={umkm.pirt || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">No. HP</label>
          <input
            type="text"
            name="no_hp"
            value={umkm.no_hp || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Kategori UMKM</label>
          <input
            type="text"
            name="kategori_umkm"
            value={umkm.kategori_umkm || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        

        <button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
