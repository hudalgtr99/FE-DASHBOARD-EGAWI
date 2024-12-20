import { useCallback, useEffect, useState } from "react";
import PerusahaanList from "./PerusahaanList";
import MyPerusahaan from "./MyPerusahaan";
import { fetchUserDetails } from "@/constants/user";
import { useDispatch, useSelector } from "react-redux";
import axiosAPI from "@/authentication/axiosApi";
import { API_URL_getperusahaan } from "@/constants";
import PulseLoader from "react-spinners/PulseLoader"; 
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";

export default function PerusahaanPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { deleteperusahaanResult } = useSelector((state) => state.perusahaan);
  const dispatch = useDispatch();
  const { themeColor } = useContext(ThemeContext);

  const [card, setCard] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State untuk pencarian

  const fetchData2 = useCallback(async () => {
    const response = await axiosAPI.get(API_URL_getperusahaan);
    setCard(response.data);
  }, []);

  useEffect(() => {
    fetchData2();
  }, []);

  useEffect(() => {
    if (deleteperusahaanResult) {
      fetchData();
    }
  }, [deleteperusahaanResult, dispatch]);

  const fetchData = useCallback(async () => {
    const userData = await fetchUserDetails();
    if (userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <PulseLoader size={13} color={themeColor} loading={loading} />
      </div>
    );
  }

  // Filter card berdasarkan searchTerm
  const filteredCard = card.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {user && user?.groups[0]?.name === "Super Admin" ? (
        <PerusahaanList />
      ) : (
        <MyPerusahaan />
      )}
    </>
  );
}
