import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addData,
  deleteData,
  getData,
  updateData,
} from '@/actions';
import { pegawaiReducer } from '@/reducers/kepegawaianReducers';
import {
  API_URL_getdatapegawai,
  API_URL_getmasterpegawai,
  API_URL_createuser,
  API_URL_edeluser,
  baseurl,
  API_URL_getcabang,
  // API_URL_getspesifikjabatan,
  API_URL_getspesifikdivisi,
  API_URL_getspesifikunit,
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
import * as Yup from 'yup';
import { debounce } from 'lodash'; // Import lodash debounce
import { FaPlus } from 'react-icons/fa';

const PegawaiPage = () => {
  const {
    getPegawaiResult,
    getPegawaiLoading,
    getPegawaiError,
    addPegawaiResult,
    addPegawaiLoading,
    deletePegawaiResult,
  } = useSelector((state) => state.kepegawaian);
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
    navigate('/pegawai/form');
  };

  const onEdit = (item) => {
    navigate(`/pegawai/form/${item.pk}`, {
      state: {
        item,
      }
    });
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: pegawaiReducer },
      item.pk,
      API_URL_edeluser,
      "DELETE_PEGAWAI"
    );
  };

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: pegawaiReducer },
        param,
        API_URL_getdatapegawai,
        "GET_PEGAWAI"
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
      addPegawaiResult ||
      deletePegawaiResult
    ) {
      const offset = pageActive * limit;
      const param = search
        ? { param: `?search=${search}&limit=${limit}&offset=${offset}` }
        : { param: `?limit=${limit}&offset=${offset}` };
      get(param);
    }
  }, [
    addPegawaiResult,
    deletePegawaiResult,
    search,
    limit,
    pageActive,
    get,
  ]);

  const dataWithIndex = addPegawaiResult.results
    ? addPegawaiResult.results.map((item, index) => ({
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
            />
          </div>
          <Button onClick={onAdd}>
            <div className="flex items-center gap-2">
              <FaPlus /> Tambah Pegawai
            </div>
          </Button>
        </div>
        <Tables>
          <Tables.Head>
            <tr>
              <Tables.Header>No</Tables.Header>
              <Tables.Header>ID Pegawai</Tables.Header>
              <Tables.Header>Nama Pegawai</Tables.Header>
              <Tables.Header>Pangkat</Tables.Header>
              <Tables.Header>Jabatan</Tables.Header>
              <Tables.Header>Departemen</Tables.Header>
              <Tables.Header>Divisi</Tables.Header>
              <Tables.Header>Unit</Tables.Header>
              <Tables.Header center>Actions</Tables.Header>
            </tr>
          </Tables.Head>
          <Tables.Body>
            {dataWithIndex.map((item) => (
              <Tables.Row key={item.pk}>
                <Tables.Data>{item.index}</Tables.Data>
                <Tables.Data>{item.datapegawai.id_pegawai}</Tables.Data>
                <Tables.Data>{item.datapribadi.nama}</Tables.Data>
                <Tables.Data>{item.datapegawai.pangkat.nama}</Tables.Data>
                <Tables.Data>{item.datapegawai.jabatan.nama}</Tables.Data>
                <Tables.Data>{item.datapegawai.departemen.nama}</Tables.Data>
                <Tables.Data>{item.datapegawai.divisi.nama}</Tables.Data>
                <Tables.Data>{item.datapegawai.unit.nama}</Tables.Data>
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
            totalCount={addPegawaiResult.count} // Total items count from the API result
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

export default PegawaiPage;
