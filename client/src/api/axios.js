import axios from "axios";

// This must exist before build
const baseURL = "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default api;
