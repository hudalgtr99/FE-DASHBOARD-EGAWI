import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteData, getData } from "@/actions";
import { unitReducers } from "@/reducers/organReducers";
import { API_URL_edelunit, API_URL_getunit } from "@/constants";
import { icons } from "../../../../../public/icons";
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
import { debounce } from "lodash";
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";

const UnitSub = () => {
  const {
    getUnitResult,
    addDepartemenResult,
    addDivisiResult,
    addUnitResult,
    deleteDepartemenResult,
    deleteDivisiResult,
    deleteUnitResult,
    getUnitLoading
  } = useSelector((state) => state.organ);
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

  const onAdd = () => {
    navigate("/masterdata/organization/unit/form");
  };

  const onEdit = (item) => {
    navigate(`/masterdata/organization/unit/form/${item.slug}`, {
      state: {
        item,
      },
    });
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: unitReducers },
      item.slug,
      API_URL_edelunit,
      "DELETE_UNIT"
    );
  };

  const get = useCallback(
    async (param) => {
      setLoading(true); // Set loading to true before fetching
      await getData(
        { dispatch, redux: unitReducers },
        param,
        API_URL_getunit,
        "GET_UNIT"
      );
      setLoading(false); // Set loading to false after fetching
    },
    [dispatch]
  );

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
    if (
      addDepartemenResult ||
      addDivisiResult ||
      addUnitResult ||
      deleteDepartemenResult ||
      deleteDivisiResult ||
      deleteUnitResult
    ) {
      const offset = pageActive * limit;
      const param = search
        ? { param: `?search=${search}&limit=${limit}&offset=${offset}` }
        : { param: `?limit=${limit}&offset=${offset}` };
      get(param);
    }
  }, [
    addDepartemenResult,
    addDivisiResult,
    addUnitResult,
    deleteDepartemenResult,
    deleteDivisiResult,
    deleteUnitResult,
    search,
    limit,
    pageActive,
    get,
  ]);

  const dataWithIndex = getUnitResult.results
    ? getUnitResult.results.map((item, index) => ({
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
              <FaPlus /> Tambah Unit
            </div>
          </Button>
        </div>
        {getUnitLoading ? ( // Conditional rendering for loading state
          <div className="flex justify-center">
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
                <Tables.Header>Nama Unit</Tables.Header>
                <Tables.Header>Nama Departemen</Tables.Header>
                <Tables.Header>Nama Divisi</Tables.Header>
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {dataWithIndex.length > 0 ? (
                dataWithIndex.map((item) => (
                  <Tables.Row key={item.pk}>
                    <Tables.Data>{item?.index || "-"}</Tables.Data>
                    {!jwt.perusahaan && (
                      <Tables.Data>
                        {item?.divisi?.departemen?.perusahaan && item.divisi.departemen.perusahaan.nama || "-"}
                      </Tables.Data>
                    )}
                    <Tables.Data>{item?.nama || "-"}</Tables.Data>
                    <Tables.Data>{item?.divisi?.departemen && item?.divisi?.departemen.nama || "-"}</Tables.Data>
                    <Tables.Data>{item?.divisi && item?.divisi?.nama || "-"}</Tables.Data>
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
                  <td colSpan={6} className="text-center">
                    Tidak ada data yang tersedia
                  </td>
                </Tables.Row>
              )}
            </Tables.Body>
          </Tables>
        )}
        <div className="flex justify-end items-center mt-4">
          <Pagination
            totalCount={getUnitResult.count}
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

export default UnitSub;
