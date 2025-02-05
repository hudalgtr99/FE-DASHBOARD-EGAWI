import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getData, deleteData } from "@/actions";
import { API_URL_edeltugas, API_URL_gettugas } from "@/constants";
import { icons } from "../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  TextField,
  Tooltip,
  PulseLoading,
  Select,
} from "@/components";
import { penugasanReducer } from "@/reducers/penugasanReducers";
import { debounce } from "lodash";
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import moment from "moment";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/AuthContext";
import { LuEye, LuTrash2 } from "react-icons/lu";

const PenugasanPage = () => {
  const { getTugasResult, getTugasLoading, addTugasResult, deleteTugasResult } =
    useSelector((state) => state.tugas);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();
  // States
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [jwt, setJwt] = useState({});
  const { selectedPerusahaan, loadingPerusahaan } = useAuth();

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
    const item = slug ? { perusahaan: { slug: slug } } : null;
    navigate("/kepegawaian/penugasan/form", { state: { item } });
  };

  const onEdit = (item) => {
    sessionStorage.setItem("url", location.pathname);
    item = {
      ...item,
      perusahaan: item?.perusahaan?.id,
    };
    navigate(`/kepegawaian/penugasan/form/${item?.slug}`, {
      state: {
        item,
      },
    });
  };
  const doDetail = (item) => {
    navigate(`/kepegawaian/penugasan/${item?.slug}`);
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: penugasanReducer },
      item?.slug,
      API_URL_edeltugas,
      "DELETE_TUGAS"
    );
  };

  const statuses = [
    { label: "Menunggu Diproses", value: 0, color: "bg-amber-500" },
    { label: "Proses", value: 1, color: "bg-blue-500" },
    { label: "Meminta Ulasan", value: 2, color: "bg-amber-500" },
    { label: "Selesai", value: 3, color: "bg-green-500" },
    { label: "Ditolak", value: 4, color: "bg-red-500" },
  ];

  const prioritases = [
    { value: "1", label: "Tinggi", color: "bg-red-500" },
    { value: "2", label: "Sedang", color: "bg-green-500" },
    { value: "3", label: "Rendah", color: "bg-blue-500" },
  ];

  const [actions] = useState([
    {
      name: "Detail",
      // icon: icons.aifilleye,
      icon: <LuEye />,
      color: "info",
      func: doDetail,
    },
    {
      name: "Edit",
      // icon: icons.bspencil,
      icon: <LuPencil />,
      color: "success",
      func: onEdit,
    },
    {
      name: "Delete",
      // icon: icons.citrash,
      icon: <LuTrash2 />,
      color: "danger",
      func: doDelete,
    },
  ]);

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: penugasanReducer },
        param,
        API_URL_gettugas,
        "GET_TUGAS"
      );
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

  useEffect(() => {
    const offset = pageActive * limit;

    // Menyiapkan parameter pencarian berdasarkan kondisi slug
    const param = selectedPerusahaan?.value
      ? `?search=${search || ""}&perusahaan=${
          selectedPerusahaan?.value || ""
        }&limit=${limit}&offset=${offset}`
      : `?limit=${limit}&search=${search || ""}&offset=${offset}`;

    get({ param });
  }, [slug, selectedPerusahaan, limit, pageActive, search, get]);

  useEffect(() => {
    const offset = pageActive * limit;

    // Menyiapkan parameter pencarian berdasarkan kondisi slug
    const param = selectedPerusahaan?.value
      ? `?search=${search || ""}&perusahaan=${
          selectedPerusahaan?.value || ""
        }&limit=${limit}&offset=${offset}`
      : `?limit=${limit}&search=${search || ""}&offset=${offset}`;

    get({ param });
  }, [slug, selectedPerusahaan, limit, pageActive, search, get]);

  useEffect(() => {
    if (addTugasResult || deleteTugasResult) {
      const param = search
        ? {
            param: `?search=${search}&perusahaan=${
              selectedPerusahaan?.value || ""
            }&limit=${limit}&offset=${pageActive * limit}`,
          }
        : {
            param: `?perusahaan=${
              selectedPerusahaan?.value || ""
            }&limit=${limit}&offset=${pageActive * limit}`,
          };
      get(param);
    }
  }, [
    addTugasResult,
    deleteTugasResult,
    selectedPerusahaan,
    search,
    limit,
    pageActive,
    get,
  ]);

  const dataWithIndex = getTugasResult.results
    ? getTugasResult.results.map((item, index) => ({
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
              <FaPlus /> Tambah Tugas
            </div>
          </Button>
        </div>
        {getTugasLoading && !loadingPerusahaan ? ( // Show loading indicator if loading is true
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
                <Tables.Header>Judul</Tables.Header>
                <Tables.Header>Pengirim</Tables.Header>
                <Tables.Header>Penerima</Tables.Header>
                <Tables.Header>Prioritas</Tables.Header>
                <Tables.Header>Mulai</Tables.Header>
                <Tables.Header>Selesai</Tables.Header>
                <Tables.Header>Status</Tables.Header>
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {dataWithIndex.length > 0 ? (
                dataWithIndex.map((item) => (
                  <Tables.Row key={item?.index}>
                    <Tables.Data>{item?.index}</Tables.Data>
                    {!jwt.perusahaan && (
                      <Tables.Data>
                        {(item?.perusahaan && item?.perusahaan.nama) || "-"}
                      </Tables.Data>
                    )}
                    <Tables.Data>{item?.judul || "-"}</Tables.Data>
                    <Tables.Data>{item?.pengirim?.nama || "-"}</Tables.Data>
                    <Tables.Data>
                      {item.penerima
                        ? item?.penerima.map((p, idx) => (
                            <span key={p.id}>
                              {p.nama}
                              {idx < item?.penerima.length - 1 ? ", " : ""}
                            </span>
                          ))
                        : "-"}
                    </Tables.Data>
                    <Tables.Data>
                      {prioritases.map((prioritas) =>
                        prioritas.value === item?.prioritas ? (
                          <span
                            key={prioritas.value}
                            className={`${prioritas.color} text-white px-2 py-1 rounded whitespace-nowrap`}
                          >
                            {prioritas.label}
                          </span>
                        ) : null
                      )}
                    </Tables.Data>
                    <Tables.Data>
                      <div className="whitespace-nowrap">
                        {moment(item?.start_date).format("D MMMM YYYY")}
                      </div>
                    </Tables.Data>
                    <Tables.Data>
                      <div className="whitespace-nowrap">
                        {moment(item?.end_date).format("D MMMM YYYY")}
                      </div>
                    </Tables.Data>
                    <Tables.Data>
                      {statuses.map((status) =>
                        status.value === item?.status ? (
                          <span
                            key={status.value}
                            className={`${status.color} text-white px-2 py-1 rounded whitespace-nowrap`}
                          >
                            {status.label}
                          </span>
                        ) : null
                      )}
                    </Tables.Data>
                    <Tables.Data center>
                      <div className="flex items-center justify-center gap-2">
                        {actions.map((action) => (
                          <Tooltip key={action.name} tooltip={action.name}>
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
                  <td colSpan="9" className="text-center">
                    Tidak ada data yang tersedia
                  </td>
                </Tables.Row>
              )}
            </Tables.Body>
          </Tables>
        )}
        <div className="flex justify-end items-center mt-4">
          <Pagination
            totalCount={getTugasResult.count}
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

export default PenugasanPage;
