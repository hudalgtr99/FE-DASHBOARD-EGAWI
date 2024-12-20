import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteData, getData } from "@/actions";
import { perusahaanReducer } from "@/reducers/perusahaanReducers";
import {
  API_URL_getlokasiabsenwithpaginations,
  API_URL_edellokasi,
  API_URL_getperusahaan,
} from "@/constants";
import { icons } from "../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  Select,
  TextField,
  Tooltip,
  PulseLoading,
} from "@/components";
import { debounce } from "lodash";
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import axiosAPI from "@/authentication/axiosApi";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";

const PerusahaanPage = () => {
  const {
    getperusahaanResult,
    getperusahaanLoading,
    addperusahaanResult,
    deleteperusahaanResult,
  } = useSelector((state) => state.perusahaan);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [perusahaanOptions, setPerusahaanOptions] = useState([]);
  const [selectedPerusahaan, setSelectedPerusahaan] = useState(null);

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");

  const [jwt, setJwt] = useState({}); // Initialize jwt variable

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
        param: `?search=${value}&limit=${limit}&offset=${pageActive * limit}`
      };
  
      // Jika perusahaan dipilih, tambahkan parameter perusahaan ke dalam query string
      if (selectedPerusahaan) {
        param.param += `&perusahaan=${selectedPerusahaan.value}`;
      }
  
      get(param);
    }, 300),
    [limit, pageActive, selectedPerusahaan] // Tambahkan selectedPerusahaan sebagai dependency
  );

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
    setPageActive(0);
  };

  const onAdd = () => {
    navigate("/masterdata/lokasi-absen/form");
  };

  const onEdit = (item) => {
    navigate(`/masterdata/lokasi-absen/form/${item.slug}`, {
      state: {
        item,
      },
    });
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: perusahaanReducer },
      item.slug,
      API_URL_edellokasi,
      "DELETE_perusahaan" // Update to match your action type
    );
  };

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: perusahaanReducer },
        param,
        API_URL_getlokasiabsenwithpaginations,
        "GET_perusahaan" // Update to match your action type
      );
    },
    [dispatch]
  );

  const handlePageClick = (page) => {
    const offset = (page - 1) * limit; // Calculate the offset based on the page
    
    // Menyiapkan parameter pencarian dan perusahaan
    const param = {
      param: `?search=${search || ''}&perusahaan=${selectedPerusahaan?.value || ''}&limit=${limit}&offset=${offset}`
    };
  
    get(param); 
    setPageActive(page - 1); 
  };
  
  const handleSelect = (selectedOption) => {
    setSelectedPerusahaan(selectedOption); 
    const offset = pageActive * limit; 
    const param = {
      param: `?search=${search || ''}&perusahaan=${selectedOption?.value || ''}&limit=${limit}&offset=${offset}`
    };
  
    get(param); 
  };  

  const [actions] = useState([
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
    if (addperusahaanResult || deleteperusahaanResult) {
      const param = search
        ? {
            param: `?search=${search}&perusahaan=${selectedPerusahaan?.value || ""}&limit=${limit}&offset=${
              pageActive * limit
            }`,
          }
        : { param: `?&perusahaan=${selectedPerusahaan?.value || ""}&limit=${limit}&offset=${pageActive * limit}` };
      get(param);
    }
  }, [
    addperusahaanResult,
    deleteperusahaanResult,
    selectedPerusahaan,
    search,
    limit,
    pageActive,
    get,
  ]);

  const dataWithIndex = getperusahaanResult.results
    ? getperusahaanResult.results.map((item, index) => ({
        ...item,
        index: pageActive * limit + index + 1,
      }))
    : [];

  return (
    <div>
      <Container>
        <div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <div className={`w-full flex gap-2 ${jwt.perusahaan ? 'sm:w-60' : 'sm:w-1/2'}`}>
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
              <FaPlus /> Tambah Lokasi Absen
            </div>
          </Button>
        </div>

        {getperusahaanLoading ? (
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
              {dataWithIndex.length > 0 ? (
                dataWithIndex.map((item) => (
                  <Tables.Row key={item?.id}>
                    <Tables.Data>{item?.index}</Tables.Data>
                    {!jwt.perusahaan && (
                      <Tables.Data>
                        {(item?.perusahaan && item?.perusahaan?.nama) || "-"}
                      </Tables.Data>
                    )}
                    <Tables.Data>{item?.nama_lokasi}</Tables.Data>
                    <Tables.Data>{item?.longitude}</Tables.Data>
                    <Tables.Data>{item?.latitude}</Tables.Data>
                    <Tables.Data>{item?.radius}</Tables.Data>
                    <Tables.Data center>
                      <div className="flex items-center justify-center gap-2">
                        {actions.map((action, i) => (
                          <Tooltip key={i} tooltip={action.name}>
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
                  <td className="text-center" colSpan="7">
                    <p>Tidak ada data yang tersedia</p>
                  </td>
                </Tables.Row>
              )}
            </Tables.Body>
          </Tables>
        )}

        <div className="flex justify-end items-center mt-4">
          <Pagination
            totalCount={getperusahaanResult.count}
            pageSize={limit}
            currentPage={pageActive + 1}
            onPageChange={handlePageClick}
            siblingCount={1}
            activeColor="primary"
            rounded="md"
            variant="flat"
            size="md"
          />
        </div>
      </Container>
    </div>
  );
};

export default PerusahaanPage;
