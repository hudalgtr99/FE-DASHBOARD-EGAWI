import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteData, getData } from "@/actions";
import { divisiReducers } from "@/reducers/organReducers";
import {
  API_URL_edeldivisi,
  API_URL_getdivisi,
  API_URL_getperusahaan,
} from "@/constants";
import { icons } from "../../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  Select,
  TextField,
  Tooltip,
  PulseLoading, // Import PulseLoading component
} from "@/components";
import { debounce } from "lodash"; // Import lodash debounce
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import axiosAPI from "@/authentication/axiosApi";
import { LuPencil, LuTrash2 } from "react-icons/lu";

const DivisiSub = () => {
  const {
    getDivisiResult,
    addDivisiResult,
    deleteDivisiResult,
    getDivisiLoading,
  } = useSelector((state) => state.organ);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [jwt, setJwt] = useState({}); // Initialize jwt variable
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
      } catch (error) {
        console.error("Error fetching perusahaan data:", error);
      }
    };
    fetchData();
  }, []);

  const debouncedSearch = useCallback(
    debounce((value) => {
      const param = {
        param: `?search=${value}&limit=${limit}&offset=${pageActive * limit}`,
      };

      // Jika perusahaan dipilih, tambahkan parameter perusahaan ke dalam query string
      if (selectedPerusahaan) {
        param.param += `&perusahaan=${selectedPerusahaan.value}`;
      }

      get(param);
    }, 1000),
    [limit, pageActive, selectedPerusahaan] // Tambahkan selectedPerusahaan sebagai dependency
  );

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
    setPageActive(0);
  };

  const onAdd = () => {
    navigate("/masterdata/organization/divisi/form");
  };

  const onEdit = (item) => {
    navigate(`/masterdata/organization/divisi/form/${item.slug}`, {
      state: {
        item,
      },
    });
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: divisiReducers },
      item.slug,
      API_URL_edeldivisi,
      "DELETE_DIVISI"
    );
  };

  const get = useCallback(
    async (param) => {
      setLoading(true); // Set loading to true
      await getData(
        { dispatch, redux: divisiReducers },
        param,
        API_URL_getdivisi,
        "GET_DIVISI"
      );
      setLoading(false); // Set loading to false after fetching
    },
    [dispatch]
  );

  const handlePageClick = (page) => {
    const offset = (page - 1) * limit; // Calculate the offset based on the page

    // Menyiapkan parameter pencarian dan perusahaan
    const param = {
      param: `?search=${search || ""}&perusahaan=${
        selectedPerusahaan?.value || ""
      }&limit=${limit}&offset=${offset}`,
    };

    get(param);
    setPageActive(page - 1);
  };

  const handleSelect = (selectedOption) => {
    setSelectedPerusahaan(selectedOption);
    const offset = pageActive * limit;
    const param = {
      param: `?search=${search || ""}&perusahaan=${
        selectedOption?.value || ""
      }&limit=${limit}&offset=${offset}`,
    };

    get(param);
  };

  const [actions] = useState([
    {
      name: "Edit",
      // icon: icons.bspencil,
      icon: <LuPencil />,
      color: "text-green-500",
      func: onEdit,
    },
    {
      name: "Delete",
      // icon: icons.citrash,
      icon: <LuTrash2 />,
      color: "text-red-500",
      func: doDelete,
    },
  ]);

  useEffect(() => {
    const param = selectedPerusahaan
      ? {
          param: `?perusahaan=${
            selectedPerusahaan.value
          }&limit=${limit}&offset=${pageActive * limit}`,
        }
      : { param: `?limit=${limit}&offset=${pageActive * limit}` };
    get(param);
  }, [limit, pageActive, search, selectedPerusahaan, get]);

  useEffect(() => {
    if (addDivisiResult || deleteDivisiResult) {
      const offset = pageActive * limit;
      const param = search
        ? {
            param: `?search=${search}&perusahaan=${
              selectedPerusahaan?.value || ""
            }&limit=${limit}&offset=${offset}`,
          }
        : {
            param: `?perusahaan=${
              selectedPerusahaan?.value || ""
            }&limit=${limit}&offset=${offset}`,
          };
      get(param);
    }
  }, [
    addDivisiResult,
    deleteDivisiResult,
    selectedPerusahaan,
    search,
    limit,
    pageActive,
    get,
  ]);

  const dataDevisi = getDivisiResult.results
    ? getDivisiResult.results.map((item, index) => ({
        ...item,
        index: pageActive * limit + index + 1,
      }))
    : [];

  return (
    <div>
      <Container>
        <div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <div
            className={`w-full flex gap-2 ${
              jwt.perusahaan ? "sm:w-60" : "sm:w-1/2"
            }`}
          >
            <TextField
              onChange={doSearch}
              placeholder="Search"
              value={search}
              icon={<CiSearch />}
            />
            {!jwt.perusahaan && (
              <Select
                options={perusahaanOptions}
                placeholder="Filter perusahaan"
                onChange={handleSelect} // Memanggil handleSelect saat ada perubahan
                value={selectedPerusahaan} // Menampilkan perusahaan yang dipilih
              />
            )}
          </div>
          <Button onClick={onAdd}>
            <div className="flex items-center gap-2">
              <FaPlus /> Tambah Divisi
            </div>
          </Button>
        </div>
        {getDivisiLoading ? ( // Show loading indicator if loading is true
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
                <Tables.Header>Nama Departemen</Tables.Header>
                <Tables.Header>Nama Divisi</Tables.Header>
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {dataDevisi.length > 0 ? (
                dataDevisi.map((item) => (
                  <Tables.Row key={item.pk}>
                    <Tables.Data>{item.index}</Tables.Data>
                    {!jwt.perusahaan && (
                      <Tables.Data>
                        {item?.departemen?.perusahaan?.nama || ""}
                      </Tables.Data>
                    )}
                    <Tables.Data>{item?.departemen?.nama || ""}</Tables.Data>
                    <Tables.Data>{item.nama}</Tables.Data>
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
                ))
              ) : (
                <Tables.Row>
                  <td colSpan={5} className="text-center">
                    Tidak ada data yang tersedia
                  </td>
                </Tables.Row>
              )}
            </Tables.Body>
          </Tables>
        )}
        <div className="flex justify-end items-center mt-4">
          <Pagination
            totalCount={getDivisiResult.count} // Total items count from the API result
            pageSize={limit} // Items per page (limit)
            currentPage={pageActive + 1} // Current page
            onPageChange={handlePageClick} // Page change handler
            siblingCount={1} // Number of sibling pages (adjust as needed)
            activeColor="primary" // Optional: active page color
            rounded="md" // Optional: rounded button style
            variant="flat" // Optional: button variant
            size="md" // Optional: button size
          />
        </div>
      </Container>
    </div>
  );
};

export default DivisiSub;
