import { Home, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="w-64 bg-indigo-700 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold tracking-wide border-b border-indigo-500">
        Keuangan Admin
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-indigo-600 transition-all"
        >
          <Home size={20} /> Dashboard
        </button>

        <button
          onClick={() => navigate("/karyawan")}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-indigo-600 transition-all"
        >
          <Users size={20} /> Karyawan
        </button>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-800 hover:bg-red-600 transition-all"
      >
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
}
