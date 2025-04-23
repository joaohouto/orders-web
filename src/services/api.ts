import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { toast } from "sonner";

//export const API_URL = "http://localhost:3000";
export const API_URL = "https://orders-api.fly.dev";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (req) => {
  const token = localStorage.getItem("@Orders:Token");

  if (token) {
    const decoded = jwtDecode(token);
    const isExpired = dayjs().unix() > decoded.exp!;

    if (!isExpired) return req;

    localStorage.removeItem("@Orders:Token");
    localStorage.removeItem("@Orders:User");
    toast.info("Sessão expirada! Entre novamente!");

    window.location.href = "/auth";
  }

  return req;
});

export default api;
