import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addData, deleteData, getData } from "@/actions";
import { callbackReducer } from "@/reducers/apiReducers";
import { API_URL_edelcallback, API_URL_getcallback } from "@/constants";
import { icons } from "../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  Limit,
  TextField,
  Tooltip,
} from "@/components";
import { debounce } from "lodash"; // Import lodash debounce
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

const CallbackPage = () => {
  const {
    getCallbackResult,
    getCallbackLoading,
    getCallbackError,
    deleteCallbackResult,
    addCallbackResult,
  } = useSelector((state) => state.api);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");

  const debouncedSearch = useCallback(
    debounce((value) => {
      fetchData(value);
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
    navigate("/callback/form");
  };

  const onEdit = (item) => {
    navigate(`/callback/form/${item.id}`, {
      state: { item },
    });
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: callbackReducer },
      item.id,
      API_URL_edelcallback,
      "DELETE_CALLBACK"
    );
  };

  const fetchData = (searchValue = search) => {
    const param = searchValue
      ? {
          param: `?search=${searchValue}&limit=${limit}&offset=${
            pageActive * limit
          }`,
        }
      : { param: `?limit=${limit}&offset=${pageActive * limit}` };

    getData(
      { dispatch, redux: callbackReducer },
      param,
      API_URL_getcallback,
      "GET_CALLBACK"
    );
  };

  const handlePageClick = (page) => {
    setPageActive(page - 1); // Set the active page
    fetchData();
  };

  const handleSelect = (newLimit) => {
    setLimit(newLimit);
    setPageActive(0);
    fetchData();
  };

  const [actions] = useState([
    {
      name: "Edit",
      icon: icons.bspencil,
      color: "success",
      func: onEdit,
    },
    {
      name: "Delete",
      icon: icons.citrash,
      color: "danger",
      func: doDelete,
    },
  ]);

  // useEffect
  useEffect(() => {
    fetchData();
  }, [limit, pageActive]); // Fetch data when limit or page changes

  useEffect(() => {
    if (addCallbackResult || deleteCallbackResult) {
      fetchData(); // Refetch data on add/delete success
    }
  }, [addCallbackResult, deleteCallbackResult]);

  const dataWithIndex = getCallbackResult.results
    ? getCallbackResult.results.map((item, index) => ({
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
              <Tables.Header>Key</Tables.Header>
              <Tables.Header>URL</Tables.Header>
              <Tables.Header>Type Callback</Tables.Header>
              <Tables.Header>Api Client</Tables.Header>
              <Tables.Header center>Actions</Tables.Header>
            </tr>
          </Tables.Head>
          <Tables.Body>
            {getCallbackLoading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : getCallbackError ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Error loading data
                </td>
              </tr>
            ) : dataWithIndex.length ? (
              dataWithIndex.map((item) => (
                <Tables.Row key={item.id}>
                  <Tables.Data>{item.index}</Tables.Data>
                  <Tables.Data>{item.key}</Tables.Data>
                  <Tables.Data>{item.url}</Tables.Data>
                  <Tables.Data>{item.type.type}</Tables.Data>
                  <Tables.Data>{item.api.nama_client}</Tables.Data>
                  <Tables.Data center>
                    <div className="flex items-center justify-center gap-2">
                      {actions.map((action) => (
                        <Tooltip key={action.name} tooltip={action.name}>
                          <Button
                            size={30}
                            variant="tonal"
                            color={action.color}
                            key={action.name}
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
              <tr>
                <td colSpan="7" className="text-center">
                  Tidak ada data yang tersedia
                </td>
              </tr>
            )}
          </Tables.Body>
        </Tables>
        <div className="flex justify-between items-center mt-4">
          <Limit limit={limit} setLimit={setLimit} onChange={handleSelect} />
          <Pagination
            totalCount={getCallbackResult.count}
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

export default CallbackPage;
