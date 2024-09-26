import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  deleteData,
  getData,
} from '@/actions';
import { userReducer } from '@/reducers/authReducers';
import {
  API_URL_edeluser,
  API_URL_getdataakun,
} from '@/constants';
import { icons } from "../../../public/icons";
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
import { CiSearch } from 'react-icons/ci';

const AkunPage = () => {
  const {
    getDataAkunResult,
    addAkunResult,
    deleteAkunResult,
  } = useSelector((state) => state.auth);
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

  const onEdit = (item) => {
    navigate(`/pegawai/form/${item.datapribadi.user_id}`, {
      state: {
        item,
      },
    });
  };

  const onChange = (data) => {
    setInputsPassword(
      inputsPassword.map((item, index) => ({
        ...item,
        value: index === 0 ? data.datapribadi.user_id : "",
      }))
    );
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: userReducer },
      item.datapribadi.user_id,
      API_URL_edeluser,
      "DELETE_AKUN"
    );
  };

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: userReducer },
        param,
        API_URL_getdataakun,
        "GET_AKUN"
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
      icon: icons.fiedit,
      color: "text-blue-500",
      func: onEdit,
    },
    {
      name: "ChangePassword",
      icon: icons.fakey,
      color: "text-yellow-500",
      func: onChange,
    },
    {
      name: "Delete",
      icon: icons.rideletebin6line,
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
      addAkunResult ||
      deleteAkunResult
    ) {
      const offset = pageActive * limit;
      const param = search
        ? { param: `?search=${search}&limit=${limit}&offset=${offset}` }
        : { param: `?limit=${limit}&offset=${offset}` };
      get(param);
    }
  }, [
    addAkunResult,
    deleteAkunResult,
    search,
    limit,
    pageActive,
    get,
  ]);

  const dataWithIndex = getDataAkunResult.results
    ? getDataAkunResult.results.map((item, index) => ({
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
        </div>
        <Tables>
          <Tables.Head>
            <tr>
              <Tables.Header>No</Tables.Header>
              <Tables.Header>ID</Tables.Header>
              <Tables.Header>Nama Pegawai</Tables.Header>
              <Tables.Header>Username</Tables.Header>
              <Tables.Header>Jabatan</Tables.Header>
              <Tables.Header>Email</Tables.Header>
              <Tables.Header>Nomor Telepon</Tables.Header>
              <Tables.Header>Active</Tables.Header>
              <Tables.Header>Out of Area</Tables.Header>
              <Tables.Header center>Actions</Tables.Header>
            </tr>
          </Tables.Head>
          <Tables.Body>
            {dataWithIndex.map((item) => (
              <Tables.Row key={item.datapribadi.user_id}>
                <Tables.Data>{item.index}</Tables.Data>
                <Tables.Data>{item.datapribadi.user_id}</Tables.Data>
                <Tables.Data>{item.datapribadi.nama}</Tables.Data>
                <Tables.Data>{item.datapribadi.username}</Tables.Data>
                <Tables.Data>{item.datapegawai?.jabatan?.nama || '-'}</Tables.Data>
                <Tables.Data>{item.datapribadi.email}</Tables.Data>
                <Tables.Data>{item.datapribadi.no_telepon}</Tables.Data>
                <Tables.Data>{item.datapribadi?.is_staff || '-'}</Tables.Data>
                <Tables.Data>{item.datapribadi?.out_of_area || '-'}</Tables.Data>
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
            totalCount={getDataAkunResult.count} // Total items count from the API result
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

export default AkunPage;
