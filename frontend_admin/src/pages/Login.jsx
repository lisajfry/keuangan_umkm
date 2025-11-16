import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "../api/api";
import { User } from "lucide-react";


export default function Login() {
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/admin/login", { username, password });

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 sm:p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-md border border-blue-100 shadow-lg rounded-3xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg text-gray-800"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">
            Admin Login
          </h1>
          <p className="text-blue-500/70 text-xs sm:text-sm mt-1">
            Masuk ke sistem keuangan UMKM
          </p>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-200 text-red-700 px-3 sm:px-4 py-2 rounded-lg mb-4 text-xs sm:text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="relative"
>
  <User className="absolute left-3 top-2.5 sm:top-3 text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
  <input
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    placeholder="Masukkan username"
    required
    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 rounded-xl bg-blue-50 focus:bg-white border border-blue-200 
               focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm sm:text-base transition-all"
  />
</motion.div>

          </motion.div>

          {/* Password + Icon mata */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <Lock className="absolute left-3 top-2.5 sm:top-3 text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="w-full pl-9 sm:pl-10 pr-10 py-2 sm:py-2.5 rounded-xl bg-blue-50 focus:bg-white border border-blue-200 
                         focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm sm:text-base transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 sm:top-3 text-blue-400 hover:text-blue-600 transition"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </motion.div>

          {/* Tombol Login */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`w-full py-2 sm:py-2.5 mt-1 sm:mt-2 rounded-xl font-semibold text-white shadow-md transition-all duration-300 text-sm sm:text-base
              ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-200"
              }`}
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
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
          className="text-center text-blue-400 text-xs sm:text-sm mt-6 sm:mt-8"
        >
          © {new Date().getFullYear()} Sistem Keuangan UMKM
        </motion.p>
      </motion.div>
    </div>
  );
}
