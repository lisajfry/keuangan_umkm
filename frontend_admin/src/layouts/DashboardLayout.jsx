// ===== DashboardLayout.jsx =====
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, Users, FileText, LogOut, Menu } from "lucide-react";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Memuat Dashboard...</p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { to: "/umkms", label: "Daftar UMKM", icon: <Users className="w-5 h-5" /> },
    { to: "/transactions", label: "Transaksi", icon: <FileText className="w-5 h-5" /> },
    { to: "/laporan", label: "Laporan", icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR OVERLAY (mobile) */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* SIDEBAR */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col justify-between transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div>
          {/* Header Sidebar */}
          <div className="px-6 py-8 border-b border-gray-100 flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center space-x-5">
              <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
                <img
                  src="/logo1.png"
                  alt="Logo kiri"
                  className="w-full h-full object-contain scale-125"
                />
              </div>

              <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
                <img
                  src="/logo2.png"
                  alt="Logo kanan"
                  className="w-full h-full object-contain scale-125"
                />
              </div>
            </div>

            <h1 className="text-xl font-bold text-gray-800 tracking-tight text-center">
              Hai, <span className="text-blue-600">Admin Dinas</span>
            </h1>
          </div>

          {/* Navigasi */}
          <nav className="mt-6 flex flex-col gap-1 px-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.to
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Masukan / Saran UMKM */}
<div className="px-6 py-4">
  <a
    href="https://docs.google.com/forms/d/1_KMXUAuaj5_D819QrulVxoyZqI2zzCMgtRXmn5higC8/edit#question=1691572368&field=1274762544"
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full text-sm font-medium text-blue-600 border border-blue-200 py-2 rounded-md text-center hover:bg-blue-50 transition"
  >
    Lihat Masukan / Saran
  </a>
</div>


        {/* Logout */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full text-sm font-medium px-4 py-2 rounded-md bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition"
          >
            <LogOut className="inline w-4 h-4 mr-1" /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        {/* Navbar (mobile) */}
        <header className="bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-blue-600"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-700">Admin Dinas</h1>
          <div className="w-6 h-6"></div>
        </header>

        {/* Main area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 md:pl-10 pr-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
