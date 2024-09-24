import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addData,
  convertJSON,
  deleteData,
  getData,
  handleInputError,
  updateData,
} from '@/actions';
import { callbackReducer } from '@/reducers/apiReducers';
import {
  API_URL_createcallback,
  API_URL_edelcallback,
  API_URL_getapiclientall,
  API_URL_getcallback,
  API_URL_gettypecallback,
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

const CallbackPage = () => {
  const {
    getCallbackResult,
    getCallbackLoading,
    getCallbackError,
    addCallbackResult,
    addCallbackLoading,
    deleteCallbackResult,
  } = useSelector((state) => state.api);
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
    navigate('/callback/form');
  };

  const onEdit = (item) => {
    navigate(`/callback/form/${item.id}`, {
      state: {
        item,
      }
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

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: callbackReducer },
        param,
        API_URL_getcallback,
        "GET_CALLBACK"
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

  // useEffect
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (addCallbackResult) {
      fetchData();
    }
  }, [addCallbackResult, dispatch]);

  useEffect(() => {
    if (deleteCallbackResult) {
      fetchData();
    }
  }, [deleteCallbackResult, dispatch]);

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
              <FaPlus /> Tambah Callback
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
            {dataWithIndex.map((item) => (
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
            totalCount={getCallbackResult.count} // Total items count from the API result
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

export default CallbackPage;
