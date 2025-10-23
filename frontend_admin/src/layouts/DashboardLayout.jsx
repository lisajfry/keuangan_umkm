// src/layouts/DashboardLayout.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Users, FileText, LogOut } from "lucide-react";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!token || !userData || userData === "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (err) {
      console.error("Gagal parsing user data:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-blue-50">
        <p className="text-gray-600 text-lg">Memuat Dashboard...</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white/90 backdrop-blur-md border-r border-blue-100 shadow-md flex flex-col">
        <div className="px-6 py-6 border-b border-blue-100">
          <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">👋 Hai, {user.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition-all"
          >
            <Home className="w-5 h-5 text-blue-600" /> Dashboard
          </button>

          <button
            onClick={() => navigate("/umkms")}
            className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition-all"
          >
            <Users className="w-5 h-5 text-blue-600" /> Daftar UMKM
          </button>

          <button
            onClick={() => navigate("/transactions")}
            className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-blue-100 rounded-lg transition-all"
          >
            <FileText className="w-5 h-5 text-blue-600" /> Transaksi
          </button>
        </nav>

        <div className="p-4 border-t border-blue-100">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
