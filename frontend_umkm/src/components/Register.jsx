import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import umkmApi from "../api/umkmApi";

export default function RegisterUmkmPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama_umkm: "",
    alamat: "",
    nib: "",
    pirt: "",
    no_hp: "",
    kategori_umkm: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await umkmApi.register(form);
      alert("Pendaftaran berhasil! Silakan login setelah diverifikasi admin.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Daftar UMKM</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nama_umkm"
            placeholder="Nama UMKM"
            className="w-full border p-2 rounded-lg"
            onChange={handleChange}
            required
          />

          <textarea
            name="alamat"
            placeholder="Alamat"
            className="w-full border p-2 rounded-lg"
            onChange={handleChange}
          />

          <input
            type="text"
            name="nib"
            placeholder="Nomor Induk Berusaha (NIB)"
            className="w-full border p-2 rounded-lg"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="pirt"
            placeholder="Nomor PIRT (Opsional)"
            className="w-full border p-2 rounded-lg"
            onChange={handleChange}
          />

          <input
            type="text"
            name="no_hp"
            placeholder="Nomor HP"
            className="w-full border p-2 rounded-lg"
            onChange={handleChange}
          />

          <input
            type="text"
            name="kategori_umkm"
            placeholder="Kategori UMKM (misal: Kuliner, Pakaian, Kerajinan)"
            className="w-full border p-2 rounded-lg"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-2 rounded-lg"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password_confirmation"
            placeholder="Konfirmasi Password"
            className="w-full border p-2 rounded-lg"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Sudah punya akun?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Masuk sekarang
          </span>
        </p>
      </div>
    </div>
  );
}
