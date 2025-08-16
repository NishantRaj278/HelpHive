import axios from "axios";
const BASE_URL = "https://helphive-api.vercel.app/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
