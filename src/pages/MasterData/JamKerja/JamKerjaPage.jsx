import React, { useCallback, useEffect, useState } from "react";
import { Container, Tables, Tooltip } from "@/components";
import { CiSearch } from "react-icons/ci";
import { Button, TextField } from "../../../components";
import { icons } from "../../../../public/icons";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL_getjamkerja } from "@/constants";
import axiosAPI from "@/authentication/axiosApi";
import { BsPencilFill } from "react-icons/bs";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";

const LokasiAbsen = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(""); // State for search input
  const [locations, setLocations] = useState([]); // State for storing locations data
  const handleSearch = (e) => setSearch(e.target.value);
  const [perusahaanId, setPerusahaanId] = useState("");

  const [jwt, setJwt] = useState({}); // Initialize jwt variable

  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, [])

  const onEdit = (item) => {
    navigate(`/masterdata/jam-kerja/form/${item.id}`, {
      state: {
        item, // Pass the entire item object as state
      },
    });
  };

  const fetchData = useCallback(async () => {
    try {
      const response = pk
        ? await axiosAPI.get(`${API_URL_getjamkerja}${pk}/`)
        : await axiosAPI.get(API_URL_getjamkerja);

      setLocations(response.data);
      if (response.data.length > 0) {
        setPerusahaanId(response.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [pk]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Dependency array to refetch data when fetchData changes

  const daysOfWeek = [
    "senin",
    "selasa",
    "rabu",
    "kamis",
    "jumat",
    "sabtu",
    "minggu",
  ];

  return (
    <div>
      <Container>
        <div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <div className="w-full sm:w-60">
            {/* <TextField
              onChange={handleSearch}
              placeholder="Search"
              value={search}
              icon={<CiSearch />}
            /> */}
          </div>
          {locations.length > 0 && (
            <Button onClick={() => onEdit(locations[0])}>
              <div className="flex items-center gap-2">
                <BsPencilFill /> Edit jam kerja
              </div>
            </Button>
          )}
        </div>
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
      </Container>
    </div>
  );
};

export default LokasiAbsen;
