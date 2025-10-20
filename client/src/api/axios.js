import axios from "axios";

const url = import.meta.env.VITE_SERVER_API;
const baseURL = `${url}/api`;
console.log("API Base URL:", import.meta.env.VITE_SERVER_API);

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default api;
