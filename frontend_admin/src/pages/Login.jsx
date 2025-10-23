import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/admin/login", { email, password });
      const { token, admin } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(admin));

      alert("Login berhasil!");
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-md border border-blue-100 shadow-lg rounded-3xl p-8 w-full max-w-md text-gray-800"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="w-16 h-16 mx-auto mb-3 rounded-full shadow-md border border-blue-100"
          />
          <h1 className="text-3xl font-bold text-blue-600">Admin Login</h1>
          <p className="text-blue-500/70 text-sm mt-1">
            Masuk ke sistem keuangan UMKM
          </p>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <Mail className="absolute left-3 top-2.5 text-blue-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-blue-50 focus:bg-white border border-blue-200 
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <Lock className="absolute left-3 top-2.5 text-blue-400 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-blue-50 focus:bg-white border border-blue-200 
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`w-full py-2.5 mt-2 rounded-xl font-semibold text-white shadow-md transition-all duration-300 
              ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-200"
              }`}
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>Memproses...</span>
              </div>
            ) : (
              "Login"
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-blue-400 text-sm mt-8"
        >
          © {new Date().getFullYear()} Sistem Keuangan UMKM
        </motion.p>
      </motion.div>
    </div>
  );
}
