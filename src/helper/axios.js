import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  timeout: 30000,
});

export default axiosInstance;
