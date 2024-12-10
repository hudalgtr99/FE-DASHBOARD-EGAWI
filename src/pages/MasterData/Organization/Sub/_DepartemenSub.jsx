import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteData, getData } from "@/actions";
import { departemenReducers, divisiReducers } from "@/reducers/organReducers";
import { API_URL_edeldepartemen, API_URL_getdepartemen } from "@/constants";
import { icons } from "../../../../../public/icons";
import {
  Button,
  Container,
  Tables,
  Limit,
  TextField,
  Tooltip,
  PulseLoading, // Import PulseLoading component
  Pagination,
} from "@/components";
import { debounce } from "lodash";
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
const DepartemenSub = () => {
  const {
    getDepartemenResult,
    addDepartemenResult,
    deleteDepartemenResult,
    getDepartemenLoading,
  } = useSelector((state) => state.organ);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [jwt, setJwt] = useState({});

  // JWT setup
  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, []);

  const get = useCallback(
    async (param) => {
      setLoading(true); // Start loading
      await getData(
        { dispatch, redux: departemenReducers },
        param,
        API_URL_getdepartemen,
        "GET_DEPARTEMEN"
      );
      setLoading(false); // Stop loading
    },
    [dispatch]
  );

  // Debounced search
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
    [get, limit, pageActive]
  );

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
    setPageActive(0);
  };

  const onAdd = () => navigate("/masterdata/organization/departemen/form");

  const onEdit = (item) =>
    navigate(`/masterdata/organization/departemen/form/${item.pk}`, {
      state: { item },
    });

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: divisiReducers },
      item.pk,
      API_URL_edeldepartemen,
      "DELETE_DIVISI"
    );
  };

  const handlePageClick = (page) => {
    const offset = (page - 1) * limit;
    const param = search
      ? { param: `?search=${search}&limit=${limit}&offset=${offset}` }
      : { param: `?limit=${limit}&offset=${offset}` };
    get(param);
    setPageActive(page - 1);
  };

  const handleSelect = (newLimit) => {
    const param = search
      ? { param: `?search=${search}&limit=${newLimit}` }
      : { param: `?limit=${newLimit}` };
    get(param);
    setLimit(newLimit);
    setPageActive(0);
  };

  useEffect(() => {
    const param = { param: `?limit=${limit}&offset=${pageActive * limit}` };
    get(param);
  }, [limit, pageActive, get]);

  useEffect(() => {
    if (addDepartemenResult || deleteDepartemenResult) {
      const offset = pageActive * limit;
      const param = search
        ? { param: `?search=${search}&limit=${limit}&offset=${offset}` }
        : { param: `?limit=${limit}&offset=${offset}` };
      get(param);
    }
  }, [
    addDepartemenResult,
    deleteDepartemenResult,
    search,
    limit,
    pageActive,
    get,
  ]);

  const dataDepartemen = getDepartemenResult.results
    ? getDepartemenResult.results.map((item, index) => ({
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
              <FaPlus /> Tambah Departemen
            </div>
          </Button>
        </div>
        {getDepartemenLoading ? (
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
            totalCount={getDepartemenResult.count}
            pageSize={limit}
            currentPage={pageActive + 1}
            onPageChange={handlePageClick}
          />
        </div>
      </Container>
    </div>
  );
};

export default DepartemenSub;
