import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteData, getData } from "@/actions";
import { perusahaanReducer } from "@/reducers/perusahaanReducers";
import {
  API_URL_getlokasiabsenwithpaginations,
  API_URL_edellokasi,
} from "@/constants";
import { icons } from "../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  TextField,
  Tooltip,
  PulseLoading,
} from "@/components";
import { debounce } from "lodash";
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/AuthContext";
import { Select } from "../../../components";
import { LuPencil, LuTrash2 } from "react-icons/lu";

const LokasiAbsenPage = () => {
  const {
    getperusahaanResult,
    getperusahaanLoading,
    addperusahaanResult,
    deleteperusahaanResult,
  } = useSelector((state) => state.perusahaan);
  const { slug } = useParams();
  const { selectedPerusahaan, loadingPerusahaan } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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
    sessionStorage.setItem("url", location.pathname);
    const item = {
      perusahaan: {
        slug: slug || "",
      },
    };
    navigate("/masterdata/lokasi-absen/form", {
      state: {
        item,
      },
    });
  };

  const onEdit = (item) => {
    sessionStorage.setItem("url", location.pathname);
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
      param: `?search=${search || ""}&perusahaan=${
        selectedPerusahaan.value
      }&perusahaan=${
        selectedPerusahaan?.value || ""
      }&limit=${limit}&offset=${offset}`,
    };

    get(param);
    setPageActive(page - 1);
  };

  const [actions] = useState([
    {
      name: "Edit",
      icon: <LuPencil />,
      color: "success",
      func: onEdit,
    },
    {
      name: "Delete",
      icon: <LuTrash2 />,
      color: "danger",
      func: doDelete,
    },
  ]);

  useEffect(() => {
    const offset = pageActive * limit;

    // Menyiapkan parameter pencarian berdasarkan kondisi slug
    const param = selectedPerusahaan
      ? `?search=${search || ""}&perusahaan=${
          selectedPerusahaan?.value || ""
        }&limit=${limit}&offset=${offset}`
      : `?limit=${limit}&search=${search || ""}&offset=${offset}`;

    get({ param });
  }, [slug, selectedPerusahaan, limit, pageActive, search, get]);

  useEffect(() => {
    if (addperusahaanResult || deleteperusahaanResult) {
      const param = search
        ? {
            param: `?search=${search}&perusahaan=${
              selectedPerusahaan?.value || ""
            }&limit=${limit}&offset=${pageActive * limit}`,
          }
        : {
            param: `?&perusahaan=${
              selectedPerusahaan?.value || ""
            }&limit=${limit}&offset=${pageActive * limit}`,
          };
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
          <div className={`w-full flex gap-2 sm:w-60`}>
            <TextField
              onChange={doSearch}
              placeholder="Search"
              value={search}
              icon={<CiSearch />}
            />
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
                            <Button
                              size={30}
                              variant="tonal"
                              color={action.color}
                              onClick={() => action.func(item)}
                              className={`cursor-pointer`}
                            >
                              {action.icon}
                            </Button>
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

export default LokasiAbsenPage;
