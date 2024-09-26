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
  API_URL_createtugas,
  API_URL_edeltugas,
  API_URL_getpegawai,
  API_URL_getriwayattugas,
  API_URL_gettugas,
  baseurl,
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
import { debounce } from 'lodash'; // Import lodash debounce
import { FaPlus } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';

const PenugasanPage = () => {
  const {
    getTugasResult,
    getTugasLoading,
    getTugasError,
    addTugasResult,
    addTugasLoading,
    deleteTugasResult,
  } = useSelector((state) => state.tugas);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");

  const debouncedSearch = useCallback(
    debounce((value) => {
      const param = value
        ? { param: `?search=${value}&limit=${limit}&offset=${pageActive * limit}` }
        : { param: `?limit=${limit}&offset=${pageActive * limit}` };
      get(param);
    }, 300),
    [limit, pageActive]
  );

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
    navigate(`/penugasan/form/${item.pk}`, {
      state: {
        item,
      }
    });
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: penugasanReducer },
      item.pk,
      API_URL_edeltugas,
      "DELETE_TUGAS"
    );
  };

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
    const param = search
      ? { param: `?search=${search}&limit=${limit}&offset=${offset}` }
      : { param: `?limit=${limit}&offset=${offset}` };

    get(param);
    setPageActive(page - 1); // Set the active page
  };

  const handleSelect = (newLimit) => {
    const param = search
      ? { param: `?search=${search}&limit=${newLimit}` }
      : { param: `?limit=${newLimit}` };
    get(param);
    setLimit(newLimit);
    setPageActive(0);
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
    const param = { param: "?limit=" + limit + "&offset=" + pageActive * limit };
    get(param);
  }, [limit, pageActive, get]);

  useEffect(() => {
    if (
      getTugasResult ||
      getTugasLoading ||
      getTugasError ||
      addTugasResult ||
      addTugasLoading ||
      deleteTugasResult
    ) {
      const offset = pageActive * limit;
      const param = search
        ? { param: `?search=${search}&limit=${limit}&offset=${offset}` }
        : { param: `?limit=${limit}&offset=${offset}` };
      get(param);
    }
  }, [
    getTugasResult,
    getTugasLoading,
    getTugasError,
    addTugasResult,
    addTugasLoading,
    deleteTugasResult,
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
              <Tables.Header>Judul Tugas</Tables.Header>
              <Tables.Header>Pengirim Tugas</Tables.Header>
              <Tables.Header>Prioritas</Tables.Header>
              <Tables.Header>Tanggal Mulai</Tables.Header>
              <Tables.Header>Tanggal Selesai</Tables.Header>
              <Tables.Header>Status</Tables.Header>
              <Tables.Header center>Actions</Tables.Header>
            </tr>
          </Tables.Head>
          <Tables.Body>
            {dataWithIndex.map((item) => (
              <Tables.Row key={item.pk}>
                <Tables.Data>{item.index}</Tables.Data>
                <Tables.Data>{item.judul}</Tables.Data>
                <Tables.Data>{item.pengirim.nama}</Tables.Data>
                <Tables.Data>{item.penerima}</Tables.Data>
                <Tables.Data>{item.prioritas}</Tables.Data>
                <Tables.Data>{item.start_date}</Tables.Data>
                <Tables.Data>{item.end_date}</Tables.Data>
                <Tables.Data>{item.status}</Tables.Data>
                <Tables.Data center>
                  <div className="flex items-center justify-center gap-2">
                    {actions.map((action) => (
                      <Tooltip key={action.name} tooltip={action.name}>
                        <div
                          key={action.name}
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
            totalCount={getTugasResult.count} // Total items count from the API result
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

export default PenugasanPage;
