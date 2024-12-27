import axios from "axios";
import { getToken, logout as handleLogout } from "./authenticationApi";
import { decrypted, encrypted } from "../actions";
import { getCookie, setCookie, removeCookie } from "./jsCookie";

const axiosAPI = axios.create({
  headers: {
    accept: "application/json",
  },
});

axiosAPI.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tambahkan interceptor respons untuk menangani refresh token
axiosAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const access = getCookie("casnet")
    const refresh = getCookie("srehfre")
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      if (
        !access &&
        !refresh
      ) {
        handleLogout();
      }
      originalRequest._retry = true;

      if (refresh) {
        const decryptRefreshToken = decrypted(refresh);

        // Jika refresh token ada, coba refresh akses token
        if (decryptRefreshToken) {
          try {
            // Panggil endpoint refresh token
            const response = await axios.post(
              "http://127.0.0.1:8000/api/token/refresh/",
              { refresh: decryptRefreshToken }
            );
            const accessToken = response.data.access;

            // Ganti token akses lewat local storage
            const encryptedToken = accessToken;
            setCookie("casnet", encryptedToken);
            return axiosAPI(originalRequest);
          } catch (err) {
            handleLogout();
            // console.log("refresh token error", err);
          }
        }
      } else {
        removeCookie("casnet");
        removeCookie("srehfre");
        useRouter().push("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosAPI;
