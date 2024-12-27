import React, { createContext, useContext, useEffect, useState } from "react";
import axiosAPI from "@/authentication/axiosApi";
import { API_URL_getperusahaan } from "@/constants";

// Membuat Context
export const AuthContext = createContext();

// Provider untuk Context
export const AuthProvider = ({ children }) => {
  const [perusahaan, setPerusahaan] = useState(null);
  const [loadingPerusahaan, setLoadingPerusahaan] = useState(true);
  const [errorPerusahaan, setErrorPerusahaan] = useState(null);

  useEffect(() => {
    const fetchPerusahaan = async () => {
      try {
        setLoadingPerusahaan(true);
        const response = await axiosAPI.get(API_URL_getperusahaan + "?active=true");
        setPerusahaan(response.data);
      } catch (err) {
        setErrorPerusahaan(err.message);
      } finally {
        setLoadingPerusahaan(false);
      }
    };

    fetchPerusahaan();
  }, []); // Hanya dipanggil sekali saat render pertama

  return (
    <AuthContext.Provider value={{ perusahaan, loadingPerusahaan, errorPerusahaan }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook untuk Menggunakan Context
export const useAuth = () => {
  return useContext(AuthContext);
};
