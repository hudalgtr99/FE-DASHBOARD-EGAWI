import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addData, deleteData, getData } from "@/actions";
import { apiReducer } from "@/reducers/apiReducers";
import {
  API_URL_changekey,
  API_URL_edelapiclient,
  API_URL_getapiclient,
} from "@/constants";
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

const ApiPage = () => {
  const { getApiResult, getApiLoading, getApiError, deleteApiResult } =
    useSelector((state) => state.api);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null); // State to hold the detailed item

  const debouncedSearch = useCallback(
    debounce((value) => {
      const param = value
        ? {
            param: `?search=${value}&limit=${limit}&offset=${
              pageActive * limit
            }`,
          }
        : { param: `?limit=${limit}&offset=${pageActive * limit}` };
      get(param);
    }, 300),
    [limit, pageActive]
  );

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
    setPageActive(0); // Reset to page 0 when search changes
  };

  const onAdd = () => {
    navigate("/api/form");
  };

  const onEdit = (item) => {
    navigate(`/api/form/${item.id}`, {
      state: {
        item,
      },
    });
  };

  const onDetail = (item) => {
    setDetail(item); // Set the selected item for detail view
  };

  const onChangeKey = (item) => {
    addData(
      { dispatch, redux: apiReducer },
      {
        key: item.key,
      },
      API_URL_changekey,
      "ADD_API"
    );
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: apiReducer },
      item.id,
      API_URL_edelapiclient,
      "DELETE_API"
    );
  };

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: apiReducer },
        param,
        API_URL_getapiclient,
        "GET_API"
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
    setPageActive(page - 1); // Set the active page (zero-indexed)
  };

  const handleSelect = (newLimit) => {
    const param = search
      ? { param: `?search=${search}&limit=${newLimit}` }
      : { param: `?limit=${newLimit}` };
    get(param);
    setLimit(newLimit); // Set the new limit
    setPageActive(0); // Reset to the first page after changing the limit
  };

  const [actions] = useState([
    {
      name: "Detail",
      icon: icons.aifilleye,
      color: "info",
      func: onDetail,
    },
    {
      name: "Change-Key",
      icon: icons.fakey,
      color: "warning",
      func: onChangeKey,
    },
    {
      name: "Edit",
      icon: icons.fiedit,
      color: "success",
      func: onEdit,
    },
    {
      name: "Delete",
      icon: icons.rideletebin6line,
      color: "danger",
      func: doDelete,
    },
  ]);

  useEffect(() => {
    get({ param: `?limit=${limit}` });
  }, [limit, get]);

  useEffect(() => {
    if (deleteApiResult) {
      get({ param: `?limit=${limit}` });
    }
  }, [deleteApiResult, limit, get]);

  const dataWithIndex = getApiResult?.results
    ? getApiResult.results.map((item, index) => ({
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
              <Tables.Header>Nama Client</Tables.Header>
              <Tables.Header>Keterangan</Tables.Header>
              <Tables.Header>Perusahaan Access</Tables.Header>
              <Tables.Header>API Access</Tables.Header>
              <Tables.Header>Active</Tables.Header>
              <Tables.Header center>Actions</Tables.Header>
            </tr>
          </Tables.Head>
          <Tables.Body>
            {getApiLoading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : getApiError ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Error loading data
                </td>
              </tr>
            ) : dataWithIndex.length ? (
              dataWithIndex.map((item) => (
                <Tables.Row key={item.id}>
                  <Tables.Data>{item.index}</Tables.Data>
                  <Tables.Data>{item.nama_client}</Tables.Data>
                  <Tables.Data>{item.keterangan}</Tables.Data>
                  <Tables.Data>{item.perusahaan}</Tables.Data>
                  <Tables.Data>{item.api}</Tables.Data>
                  <Tables.Data>{item.is_active ? "Yes" : "No"}</Tables.Data>
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

        {/* Conditionally render the detailed view */}
        {detail && (
          <div className="mt-8 bg-gray-100 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-bold">Detail View</h2>
            <p>
              <strong>Nama Client:</strong> {detail.nama_client}
            </p>
            <p>
              <strong>Keterangan:</strong> {detail.keterangan}
            </p>
            <p>
              <strong>Perusahaan Access:</strong> {detail.perusahaan}
            </p>
            <p>
              <strong>API Access:</strong> {detail.api}
            </p>
            <p>
              <strong>Active:</strong> {detail.is_active ? "Yes" : "No"}
            </p>
            <Button onClick={() => setDetail(null)} className="mt-4">
              Close
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <Limit limit={limit} setLimit={setLimit} onChange={handleSelect} />
          <Pagination
            totalCount={getApiResult?.count || 0} // Total items count from the API result
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

export default ApiPage;
