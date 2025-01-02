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
  const [perusahaanOptions, setPerusahaanOptions] = useState([]);
  const [selectedPerusahaan, setSelectedPerusahaan] = useState(null);

  useEffect(() => {
    const fetchPerusahaan = async () => {
      try {
        setLoadingPerusahaan(true);
        const response = await axiosAPI.get(API_URL_getperusahaan);
        setPerusahaan(response.data);

        // Mengatur options berdasarkan data perusahaan
        const options = [
          { value: null, label: "Semua" },
          ...response.data.map((opt) => ({
            value: opt.slug,
            label: opt.nama,
          })),
        ];
        setPerusahaanOptions(options);
      } catch (err) {
        setErrorPerusahaan(err.message);
      } finally {
        setLoadingPerusahaan(false);
      }
    };

    fetchPerusahaan();
  }, []); // Hanya dipanggil sekali saat render pertama

  const updateSelectedPerusahaan = (option) => {
    setSelectedPerusahaan(option);
  };

  return (
    <AuthContext.Provider
      value={{
        perusahaan,
        loadingPerusahaan,
        errorPerusahaan,
        perusahaanOptions,
        selectedPerusahaan,
        updateSelectedPerusahaan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook untuk Menggunakan Context
export const useAuth = () => {
  return useContext(AuthContext);
};
