import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getData, deleteData } from "@/actions";
import {
  API_URL_edeltugas,
  API_URL_gettugas,
  API_URL_getdetailtugas,
} from "@/constants";
import {
  Button,
  Container,
  Pagination,
  Tables,
  Limit,
  TextField,
  Tooltip,
  PulseLoading,
} from "@/components";
import { penugasanReducer } from "@/reducers/penugasanReducers";
import { debounce } from "lodash";
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import PenugasanDetail from "./PenugasanDetail"; // Import the modal component
import axiosAPI from "@/authentication/axiosApi";
import moment from "moment";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import { LuEye, LuPencil, LuTrash2 } from "react-icons/lu";

const PenugasanPage = () => {
  const { getTugasResult, getTugasLoading, addTugasResult, deleteTugasResult } =
    useSelector((state) => state.tugas);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null); // Modal detail data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [loading, setLoading] = useState(true);

  const [jwt, setJwt] = useState({}); // Initialize jwt variable

  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, []);

  // Debounce search function
  const debouncedSearch = useCallback(
    debounce((value) => fetchTugas(value), 1500),
    [limit]
  );

  const fetchTugas = (searchValue = "") => {
    setLoading(true);
    const param = searchValue
      ? {
          param: `?search=${searchValue}&limit=${limit}&offset=${
            pageActive * limit
          }`,
        }
      : { param: `?limit=${limit}&offset=${pageActive * limit}` };
    getData(
      { dispatch, redux: penugasanReducer },
      param,
      API_URL_gettugas,
      "GET_TUGAS"
    );

    setLoading(false);
  };

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
    setPageActive(0);
  };

  const onAdd = () => {
    navigate("/kepegawaian/penugasan/form");
  };

  const onEdit = (item) => {
    navigate(`/kepegawaian/penugasan/form/${item.id}`, {
      state: {
        item,
      },
    });
  };

  const doDetail = useCallback(async (detail) => {
    try {
      const res = await axiosAPI.post(API_URL_getdetailtugas, {
        tugas_id: detail.id,
      });
      setDetail(detail); // Set the detail data for the modal
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error(error);
    }
  }, []);

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: penugasanReducer },
      item.id,
      API_URL_edeltugas,
      "DELETE_TUGAS"
    );
  };

  const statuses = [
    { label: "Menunggu Persetujuan", value: 0, color: "bg-amber-500" },
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
      color: "text-blue-500",
      func: doDetail,
    },
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

  const handlePageClick = (page) => {
    setPageActive(page - 1);
  };

  const handleSelect = (newLimit) => {
    setLimit(newLimit);
    setPageActive(0);
    fetchTugas(search);
  };

  useEffect(() => {
    fetchTugas(search);
  }, [limit, pageActive, search]);

  useEffect(() => {
    if (addTugasResult || deleteTugasResult) {
      fetchTugas(search); // Refetch the data after add/delete
    }
  }, [addTugasResult, deleteTugasResult, search]);

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
          <div className="w-full sm:w-60">
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
        {getTugasLoading ? ( // Show loading indicator if loading is true
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
                  <Tables.Row key={item.index}>
                    <Tables.Data>{item.index}</Tables.Data>
                    {!jwt.perusahaan && (
                      <Tables.Data>{item.perusahaan.nama}</Tables.Data>
                    )}
                    <Tables.Data>{item.judul}</Tables.Data>
                    <Tables.Data>{item.pengirim.nama}</Tables.Data>
                    <Tables.Data>
                      {item.penerima.map((p, idx) => (
                        <span key={p.id}>
                          {p.nama}
                          {idx < item.penerima.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </Tables.Data>
                    <Tables.Data>
                      {prioritases.map((prioritas) =>
                        prioritas.value === item.prioritas ? (
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
                        {moment(item.start_date).format("D MMMM YYYY")}
                      </div>
                    </Tables.Data>
                    <Tables.Data>
                      <div className="whitespace-nowrap">
                        {moment(item.end_date).format("D MMMM YYYY")}
                      </div>
                    </Tables.Data>
                    <Tables.Data>
                      {statuses.map((status) =>
                        status.value === item.status ? (
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

      {/* Penugasan Detail Modal */}
      <PenugasanDetail
        show={isModalOpen}
        setShow={setIsModalOpen}
        detail={detail}
      />
    </div>
  );
};

export default PenugasanPage;
