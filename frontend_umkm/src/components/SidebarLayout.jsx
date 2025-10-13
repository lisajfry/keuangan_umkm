import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import umkmApi from "../api/umkmApi";

export default function SidebarLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await umkmApi.logout();
    } catch (e) {
      console.error("Logout gagal:", e);
    }
    localStorage.removeItem("umkm_token");
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/transactions", label: "Transaksi" },
    { to: "/reports", label: "Laporan" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between fixed left-0 top-0 bottom-0">
        <div>
          <div className="px-6 py-5 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              UMKM Finance
            </h1>
          </div>

          <nav className="mt-6 flex flex-col gap-1 px-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.to
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full text-sm font-medium px-4 py-2 rounded-md bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
