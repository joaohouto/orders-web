import axios from "axios";
import jwtDecode from "jwt-decode";
import moment from "moment";

const API_URL = "http://localhost:3333";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
  },
});

api.interceptors.request.use(async (req) => {
  const token = localStorage.getItem("@iGym:Token");
  const refreshToken = localStorage.getItem("@iGym:RefreshToken");

  if (token) {
    const decoded = jwtDecode(token);
    const isExpired = moment().unix() > decoded.exp;

    if (!isExpired) return req;

    try {
      console.log("[info] Refreshing access token right now...");

      const response = await axios.post(
        `${API_URL}/refresh?token=${refreshToken}`
      );

      const { newToken, newRefreshToken } = response.data;
      api.defaults.headers["x-access-token"] = newToken;
      req.headers["x-access-token"] = newToken;

      localStorage.setItem("@iGym:Token", newToken);

      if (newRefreshToken) {
        localStorage.setItem("@iGym:RefreshToken", newRefreshToken);
      }
    } catch (err) {
      console.log("[info] Error while refreshing access token!");
      console.log(err);
    }
  }

  return req;
});

export default api;
