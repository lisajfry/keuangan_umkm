import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Kalau belum login, arahkan ke halaman login
    return <Navigate to="/" replace />;
  }

  // Kalau sudah login, lanjut render halaman
  return children;
}

export default PrivateRoute;
