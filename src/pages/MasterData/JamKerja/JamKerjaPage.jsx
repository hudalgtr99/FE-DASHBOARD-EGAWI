import React, { useCallback, useEffect, useState } from "react";
import { Container, Tables, Tooltip } from "@/components";
import { CiSearch } from "react-icons/ci";
import { Button, Select, TextField } from "../../../components";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL_getjamkerja, API_URL_getperusahaan } from "@/constants";
import { BsPencilFill } from "react-icons/bs";
import { FaExclamation } from "react-icons/fa";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import { IoMdReturnLeft } from "react-icons/io";
import axiosAPI from "@/authentication/axiosApi";

const JamKerjaPage = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(""); // State for search input
  const [locations, setLocations] = useState([]); // State for storing locations data
  const handleSearch = (e) => setSearch(e.target.value);
  const [perusahaanId, setPerusahaanId] = useState("");

  const [jwt, setJwt] = useState({});
  const [perusahaanOptions, setPerusahaanOptions] = useState([]);
  const [selectedPerusahaan, setSelectedPerusahaan] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAPI.get(API_URL_getperusahaan);
        const options = response.data.map((item) => ({
          value: item.slug,
          label: item.nama,
        }));
        setPerusahaanOptions(options);
        // Set the default selected perusahaan to the first item if no selection
        if (options.length > 0 && !selectedPerusahaan) {
          setSelectedPerusahaan(options[0]);
        }
      } catch (error) {
        console.error("Error fetching perusahaan data:", error);
      }
    };
    fetchData();
  }, []);

  const onEdit = (item) => {
    navigate(`/masterdata/jam-kerja/form/${selectedPerusahaan.value}`, {
      state: {
        item, // Pass the entire item object as state
      },
    });
  };

  const fetchData = useCallback(async () => {
    try {
      const response = selectedPerusahaan
        ? await axiosAPI.get(
            `${API_URL_getjamkerja}${selectedPerusahaan.value}/`
          )
        : await axiosAPI.get(API_URL_getjamkerja);

      setLocations(response.data);
      if (response.data.length > 0) {
        setPerusahaanId(response.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [selectedPerusahaan]);

  useEffect(() => {
    fetchData();
  }, [fetchData, selectedPerusahaan]);

  const daysOfWeek = [
    "senin",
    "selasa",
    "rabu",
    "kamis",
    "jumat",
    "sabtu",
    "minggu",
  ];

  const handleSelect = (selectedOption) => {
    setSelectedPerusahaan(selectedOption);
  };

  return (
    <div>
      <Container>
        <div className={`mb-4 flex flex-col sm:flex-row justify-center ${!jwt.perusahaan ? 'sm:justify-between' : 'sm:justify-end'} items-center gap-4`}>
            <>
              {!jwt.perusahaan && (
                <div className={`w-full sm:w-60`}>
                  <Select
                    options={perusahaanOptions}
                    placeholder="Filter perusahaan"
                    onChange={handleSelect} // Memanggil handleSelect saat ada perubahan
                    value={selectedPerusahaan} // Menampilkan perusahaan yang dipilih
                  />
                </div>
              )}
              <Button onClick={() => onEdit(locations[0])}>
                <div className="flex items-center gap-2">
                  <BsPencilFill /> Edit jam kerja
                </div>
              </Button>
            </>
        </div>
        {locations.length > 0 && (
          <Tables>
            <Tables.Head>
              <tr>
                <Tables.Header>No</Tables.Header>
                {!jwt.perusahaan && (
                  <Tables.Header>Nama perusahaan</Tables.Header>
                )}
                <Tables.Header>Hari Kerja</Tables.Header>
                <Tables.Header>Jam Masuk</Tables.Header>
                <Tables.Header>Jam Keluar</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {locations.map((item, index) => {
                return daysOfWeek.map((day, i) => (
                  <Tables.Row key={`${index}-${day}`}>
                    <Tables.Data>{i + 1}</Tables.Data>
                    {!jwt.perusahaan && <Tables.Data>{item.nama}</Tables.Data>}
                    <Tables.Data>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Tables.Data>
                    <Tables.Data>
                      {item.jadwal[day].masuk === "00:00"
                        ? "libur"
                        : item.jadwal[day].masuk}
                    </Tables.Data>
                    <Tables.Data>
                      {item.jadwal[day].keluar === "00:00"
                        ? "libur"
                        : item.jadwal[day].keluar}
                    </Tables.Data>
                  </Tables.Row>
                ));
              })}
            </Tables.Body>
          </Tables>
        )}
      </Container>
    </div>
  );
};

export default JamKerjaPage;
