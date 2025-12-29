import axios from "axios";
import { getToken, logout } from "../services/authService";

export const adminHttp = axios.create({
  baseURL: "https://localhost:7046",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

adminHttp.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminHttp.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      logout();
      // ileride: window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);
