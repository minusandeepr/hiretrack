
import axios from "axios";
import { API_BASE_URL } from "../utils/constants.js";
console.log("AXIOS FILE LOADED");
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  console.log("TOKEN BEFORE REQUEST:", token);
  console.log("REQUEST:", config.url);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;