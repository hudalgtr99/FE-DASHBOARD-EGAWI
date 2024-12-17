import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteData, getData } from "@/actions";
import { divisiReducers } from "@/reducers/organReducers";
import { API_URL_edeldepartemen, API_URL_getdepartemen } from "@/constants";
import { icons } from "../../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  Limit,
  TextField,
  Tooltip,
  PulseLoading, // Import PulseLoading component
} from "@/components";
import { debounce } from "lodash"; // Import lodash debounce
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import { data } from "autoprefixer";

const DivisiSub = () => {
  const { getDivisiResult, addDivisiResult, deleteDivisiResult, getDivisiLoading } = useSelector(
    (state) => state.organ
  ); // reducer departemen gabisa, jadi pakai departemen
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [jwt, setJwt] = useState({}); // Initialize jwt variable

  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, []);

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
    setPageActive(0);
  };

  const onAdd = () => navigate("/masterdata/organization/departemen/form");

  const onEdit = (item) =>{
    item.perusahaan = item.perusahaan.id,
    navigate(`/masterdata/organization/departemen/form/${item.slug}`, {
      state: { item },
    });
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: divisiReducers },
      item.slug,
      API_URL_edeldepartemen,
      "DELETE_DIVISI" 
      // reducer departemen gabisa, jadi pakai divisi
    );
  };

  const get = useCallback(
    async (param) => {
      setLoading(true); // Set loading to true
      await getData(
        { dispatch, redux: divisiReducers },
        param,
        API_URL_getdepartemen,
        "GET_DIVISI" 
        // reducer departemen gabisa, jadi pakai divisi
      );
      setLoading(false); // Set loading to false after fetching
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
    const param = {
      param: "?limit=" + limit + "&offset=" + pageActive * limit,
    };
    get(param);
  }, [limit, pageActive, get]);

  useEffect(() => {
    if (addDivisiResult || deleteDivisiResult) {
      const offset = pageActive * limit;
      const param = search
        ? { param: `?search=${search}&limit=${limit}&offset=${offset}` }
        : { param: `?limit=${limit}&offset=${offset}` };
      get(param);
    }
  }, [addDivisiResult, deleteDivisiResult, search, limit, pageActive, get]); // reducer departemen gabisa, jadi pakai departemen

  const dataDepartemen = getDivisiResult.results
    ? getDivisiResult.results.map((item, index) => ({
        ...item,
        index: pageActive * limit + index + 1,
      }))
    : []; // reducer departemen gabisa, jadi pakai divisi

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
              <FaPlus /> Tambah Departemen
            </div>
          </Button>
        </div>
        {getDivisiLoading ? ( // Show loading indicator if loading is true
          <div className="flex justify-center py-4">
            <PulseLoading />
          </div>
        ) : (
          <Tables>
            <Tables.Head>
              <tr>
                <Tables.Header>No</Tables.Header>
                {!jwt?.perusahaan && (
                  <Tables.Header>Nama Perusahaan</Tables.Header>
                )}
                <Tables.Header>Nama Departemen</Tables.Header>
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {dataDepartemen.length > 0 ? (
                dataDepartemen.map((item) => (
                  <Tables.Row key={item.pk}>
                    <Tables.Data>{item.index}</Tables.Data>
                    {!jwt?.perusahaan && (
                      <Tables.Data>{item?.perusahaan?.nama}</Tables.Data>
                    )}
                    <Tables.Data>{item.nama}</Tables.Data>
                    <Tables.Data center>
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip key="edit" tooltip="Edit">
                          <div
                            onClick={() => onEdit(item)}
                            className="text-green-500 cursor-pointer"
                          >
                            {icons.bspencil}
                          </div>
                        </Tooltip>
                        <Tooltip key="delete" tooltip="Delete">
                          <div
                            onClick={() => doDelete(item)}
                            className="text-red-500 cursor-pointer"
                          >
                            {icons.citrash}
                          </div>
                        </Tooltip>
                      </div>
                    </Tables.Data>
                  </Tables.Row>
                ))
              ) : (
                <Tables.Row>
                  <td className="text-center" colSpan="4">
                    <p>Tidak ada data yang tersedia</p>
                  </td>
                </Tables.Row>
              )}
            </Tables.Body>
          </Tables>
        )}
        <div className="flex justify-end items-center mt-4">
          <Pagination
            totalCount={getDivisiResult.count} // Total items count from the API result
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

export default DivisiSub;
