import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function AddUmkm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama_umkm: "",
    alamat: "",
    nib: "",
    no_hp: "",
    kategori_umkm: "",
    saldo_kas: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        saldo_kas: form.saldo_kas ? parseFloat(form.saldo_kas) : 0,
      };

      await api.post("/umkms", payload);
alert("UMKM berhasil ditambahkan!");
navigate("/umkms"); // kembali ke list UMKM

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal menambahkan UMKM");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-indigo-600">Tambah UMKM</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Nama UMKM</label>
            <input
              type="text"
              name="nama_umkm"
              value={form.nama_umkm}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Alamat</label>
            <input
              type="text"
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">NIB</label>
            <input
              type="text"
              name="nib"
              value={form.nib}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

         

          <div>
            <label className="block font-medium mb-1">No. HP</label>
            <input
              type="text"
              name="no_hp"
              value={form.no_hp}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Kategori UMKM</label>
            <input
              type="text"
              name="kategori_umkm"
              value={form.kategori_umkm}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Saldo Kas</label>
            <input
              type="number"
              name="saldo_kas"
              value={form.saldo_kas}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
          >
            {loading ? "Memproses..." : "Tambah UMKM"}
          </button>
        </form>
      </div>
    </div>
  );
}
