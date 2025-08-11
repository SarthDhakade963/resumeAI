import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_SPRING_BASE_URL;
const API = axios.create({
  baseURL: BACKEND_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
