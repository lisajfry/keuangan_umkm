export default function Topbar({ user }) {
  return (
    <header className="bg-white shadow-sm flex justify-between items-center px-6 py-3">
      <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-gray-800 font-medium">{user?.name || "Admin"}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-semibold">
          {user?.name?.charAt(0).toUpperCase() || "A"}
        </div>
      </div>
    </header>
  );
}
