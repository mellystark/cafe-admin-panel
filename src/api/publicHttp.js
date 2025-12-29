import axios from "axios";
import { handleApiError } from "../utils/handleApiError";

export const publicHttp = axios.create({
  baseURL: "https://localhost:7046",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

publicHttp.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);
