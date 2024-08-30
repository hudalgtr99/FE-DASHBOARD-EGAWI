import axios from "axios";
import { getToken, logout } from "./authenticationApi";

const axiosAPI = axios.create({
  headers: {
    accept: "application/json",
  },
});

axiosAPI.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if (error.response.status === 403) {
    //   originalRequest.headers["Authorization"] = "Token " + getToken();
    //   return axiosAPI(originalRequest);
    // }

    // if (error.response.status === 401) {
    //   logout();
    //   return Promise.reject(error);
    // }
    // if (error.response.status === 403) {
    // logout();
    //   return Promise.reject(error);
    // }

    return Promise.reject(error);
  }
);

export default axiosAPI;
