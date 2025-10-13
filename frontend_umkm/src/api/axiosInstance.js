import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8001/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("umkm_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert("Sesi kamu habis, silakan login ulang.");
      localStorage.removeItem("umkm_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
