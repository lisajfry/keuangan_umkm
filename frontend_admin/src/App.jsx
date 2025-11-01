import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UmkmList from "./pages/UmkmList";
import UmkmAdd from "./pages/UmkmAdd";
import Login from "./pages/Login";
import EditUmkm from "./pages/EditUmkm";
import TransactionList from "./pages/TransactionList"; // import halaman transaksi
import AdminSummary from "./pages/AdminSummary";

function App() {
  const currentUser = JSON.parse(localStorage.getItem("user")); // ambil user login

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/umkms" element={<UmkmList />} />
        <Route path="/umkms/add" element={<UmkmAdd />} />
        <Route path="/umkms/edit/:id" element={<EditUmkm />} />

        {/* Halaman Transaksi */}
        <Route
          path="/transactions"
          element={<TransactionList currentUser={currentUser} />}
        />
        <Route
          path="/laporan"
          element={<AdminSummary currentUser={currentUser} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
