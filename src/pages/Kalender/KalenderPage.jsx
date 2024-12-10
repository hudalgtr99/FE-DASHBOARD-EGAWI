import { useCallback, useEffect, useState } from "react";
import KalenderSubPage from "./MyKalender";
import { fetchUserDetails } from "@/constants/user";
import { useDispatch, useSelector } from "react-redux";
import axiosAPI from "@/authentication/axiosApi";
import { API_URL_getperusahaan } from "@/constants";
import { Container, TextField } from "@/components";
import { CiSearch } from "react-icons/ci";
import PulseLoader from "react-spinners/PulseLoader";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext } from "react";
import { FaExclamation } from "react-icons/fa6";
import { Button, CardImage as Card } from "../../components";

export default function KalenderPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { deleteperusahaanResult } = useSelector((state) => state.perusahaan);
  const dispatch = useDispatch();
  const { themeColor } = useContext(ThemeContext);
  const bgColor = `bg-[${themeColor}]`;

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
        <>
          <div>
            <Container>
              <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center">
                <div className="w-full sm:w-60">
                  <TextField
                    placeholder="Search"
                    icon={<CiSearch />}
                    value={searchTerm} // Bind value dengan state
                    onChange={(e) => setSearchTerm(e.target.value)} // Update state saat input berubah
                  />
                </div>
              </div>
            </Container>
            {filteredCard.length > 0 ? (
              <>
                <div className="grid grid-cols-5 gap-3 mt-6">
                  {filteredCard.map((item) => (
                    <Card
                      key={item.pk}
                      image={item.image}
                      nama={item.nama}
                      pk={item.pk}
                      to={`/kalender/${item.pk}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 justify-center items-center h-[60vh]">
                <FaExclamation className="text-3xl" />
                <p className="font-bold">Tidak ada data yang tersedia</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <KalenderSubPage />
      )}
    </>
  );
}
