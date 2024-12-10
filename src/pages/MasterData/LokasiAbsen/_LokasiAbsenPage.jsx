import React, { useCallback, useEffect, useState } from "react";
import { Button, Container, Tables, Tooltip, PulseLoading } from "@/components"; 
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { TextField } from "../../../components";
import { icons } from "../../../../public/icons";
import axiosAPI from "@/authentication/axiosApi";
import { API_URL_getlokasiabsen, API_URL_edellokasi } from "@/constants";
import { useNavigate } from "react-router-dom";
import { deleteData } from "@/actions";
import { lokasiAbsenReducer } from "@/reducers/lokasiAbsenReducers";
import { useDispatch } from "react-redux";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";

const LokasiAbsen = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const handleSearch = (e) => setSearch(e.target.value);
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading

  const [jwt, setJwt] = useState({}); // Initialize jwt variable

  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axiosAPI.get(API_URL_getlokasiabsen);
      setLocations(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onAdd = () => {
    navigate("/masterdata/lokasi-absen/form");
  };

  const onEdit = (item) => {
    navigate(`/masterdata/lokasi-absen/form/${item.id}`, {
      state: {
        item,
      },
    });
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: lokasiAbsenReducer },
      item.id,
      API_URL_edellokasi,
      "DELETE_LOKASI_ABSEN"
    );
  };

  const actions = [
    {
      name: "Edit",
      icon: icons.bspencil,
      color: "text-green-500",
      func: onEdit,
    },
    {
      name: "Delete",
      icon: icons.citrash,
      color: "text-red-500",
      func: doDelete,
    },
  ];

  return (
    <div>
      <Container>
        <div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <div className="w-full sm:w-60">
            <TextField
              onChange={handleSearch}
              placeholder="Search"
              value={search}
              icon={<CiSearch />}
            />
          </div>
          <Button onClick={onAdd}>
            <div className="flex items-center gap-2">
              <FaPlus /> Tambah lokasi absen
            </div>
          </Button>
        </div>

        {/* Show PulseLoading if loading */}
        {loading ? (
          <div className="flex justify-center py-4">
            <PulseLoading />
          </div>
        ) : (
          <Tables>
            <Tables.Head>
              <tr>
                <Tables.Header>No</Tables.Header>
                {!jwt.perusahaan && (
                  <Tables.Header>Nama perusahaan</Tables.Header>
                )}
                <Tables.Header>Lokasi</Tables.Header>
                <Tables.Header>Longitude</Tables.Header>
                <Tables.Header>Latitude</Tables.Header>
                <Tables.Header>Radius</Tables.Header>
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {locations.map((item, index) => (
                <Tables.Row key={item.id}>
                  <Tables.Data>{index + 1}</Tables.Data>
                  {!jwt.perusahaan && (
                  <Tables.Data>{item.perusahaan.nama}</Tables.Data>
                  )}
                  <Tables.Data>{item.nama_lokasi}</Tables.Data>
                  <Tables.Data>{item.longitude}</Tables.Data>
                  <Tables.Data>{item.latitude}</Tables.Data>
                  <Tables.Data>{item.radius}</Tables.Data>
                  <Tables.Data center>
                    <div className="flex items-center justify-center gap-2">
                      {actions.map((action) => (
                        <Tooltip key={action.name} tooltip={action.name}>
                          <div
                            onClick={() => action.func(item)}
                            className={`${action.color} cursor-pointer`}
                          >
                            {action.icon}
                          </div>
                        </Tooltip>
                      ))}
                    </div>
                  </Tables.Data>
                </Tables.Row>
              ))}
            </Tables.Body>
          </Tables>
        )}
      </Container>
    </div>
  );
};

export default LokasiAbsen;
