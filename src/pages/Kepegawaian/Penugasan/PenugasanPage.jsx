import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addFormData,
  deleteData,
  getData,
  handleInputError,
  updateFormData,
} from '@/actions';
import { penugasanReducer } from '@/reducers/penugasanReducers';
import {
  API_URL_edeltugas,
  API_URL_gettugas,
  API_URL_getriwayattugas,
} from '@/constants';
import { icons } from "../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  Limit,
  TextField,
  Tooltip,
} from '@/components';
import { debounce } from 'lodash';
import { FaPlus } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';
import axiosAPI from "@/authentication/axiosApi";
import moment from 'moment';

const PenugasanPage = () => {
  const { getTugasResult, addTugasResult, deleteTugasResult } = useSelector((state) => state.tugas);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState({});

  // Debounce search function
  const debouncedSearch = useCallback(
    debounce((value) => fetchTugas(value), 300),
    [limit]
  );

  const fetchTugas = (searchValue = "") => {
    const param = searchValue
      ? { param: `?search=${searchValue}&limit=${limit}&offset=${pageActive * limit}` }
      : { param: `?limit=${limit}&offset=${pageActive * limit}` };
    getData({ dispatch, redux: penugasanReducer }, param, API_URL_gettugas, "GET_TUGAS");
  };

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
    setPageActive(0);
  };

  const onAdd = () => {
    navigate('/penugasan/form');
  };

  const onEdit = (item) => {
    navigate(`/penugasan/form/${item.pk}`, { state: { item } });
  };

  const doDetail = useCallback(async (detail) => {
    try {
      const res = await axiosAPI.post(API_URL_getriwayattugas, {
        tugas_id: detail.id,
      });
      setDetail(detail);
      // Handle the fetched data here (e.g., show it in a new page or component)
    } catch (error) {
      console.log(error);
    }
  }, []);

  const doDelete = (item) => {
    deleteData({ dispatch, redux: penugasanReducer }, item.pk, API_URL_edeltugas, "DELETE_TUGAS");
  };

  const statuses = [
    { label: "Menunggu Persetujuan", value: 0, color: "bg-amber-500" },
    { label: "Proses", value: 1, color: "bg-blue-500" },
    { label: "Meminta Ulasan", value: 2, color: "bg-amber-500" },
    { label: "Selesai", value: 3, color: "bg-green-500" },
    { label: "Ditolak", value: 4, color: "bg-red-500" },
  ];

  const [actions] = useState([
    {
      name: "Detail",
      icon: icons.aifilleye,
      color: "text-blue-500",
      func: doDetail,
    },
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
              <FaPlus /> Tambah Data
            </div>
          </Button>
        </div>
        <Tables>
          <Tables.Head>
            <tr>
              <Tables.Header>No</Tables.Header>
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
            {dataWithIndex.map((item) => (
              <Tables.Row key={item.index}>
                <Tables.Data>{item.index}</Tables.Data>
                <Tables.Data>{item.judul}</Tables.Data>
                <Tables.Data>{item.pengirim.nama}</Tables.Data>
                <Tables.Data>
                  {item.penerima.map((p, idx) => (
                    <span key={p.id}>
                      {p.nama}{idx < item.penerima.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </Tables.Data>
                <Tables.Data>{item.prioritas}</Tables.Data>
                <Tables.Data>{moment(item.start_date).format("D MMMM YYYY")}</Tables.Data>
                <Tables.Data>{moment(item.end_date).format("D MMMM YYYY")}</Tables.Data>
                <Tables.Data>
                  {statuses.map((status) =>
                    status.value === item.status ? (
                      <span key={status.value} className={`${status.color} text-white px-2 py-1 rounded whitespace-nowrap`}>
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
                          className={action.color}
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
        <div className="flex justify-between items-center mt-4">
          <Limit limit={limit} setLimit={setLimit} onChange={handleSelect} />
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
