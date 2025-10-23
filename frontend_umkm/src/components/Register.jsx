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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 p-4">
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-md p-8 border border-blue-100 transition-transform duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-2">
          Daftar UMKM
        </h2>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Lengkapi data di bawah untuk membuat akun UMKM Anda
        </p>

        {error && (
          <p className="bg-red-50 border border-red-200 text-red-700 text-center py-2 rounded-lg mb-4 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nama_umkm"
            placeholder="Nama UMKM"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            onChange={handleChange}
            required
          />

          <textarea
            name="alamat"
            placeholder="Alamat"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            onChange={handleChange}
          />

          <input
            type="text"
            name="nib"
            placeholder="Nomor Induk Berusaha (NIB)"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="pirt"
            placeholder="Nomor PIRT (Opsional)"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            onChange={handleChange}
          />

          <input
            type="text"
            name="no_hp"
            placeholder="Nomor HP"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            onChange={handleChange}
          />

          <input
            type="text"
            name="kategori_umkm"
            placeholder="Kategori UMKM (misal: Kuliner, Pakaian, Kerajinan)"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password_confirmation"
            placeholder="Konfirmasi Password"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2.5 transition duration-300 shadow-md"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Masuk sekarang
          </span>
        </p>
      </div>
    </div>
  );
}
