import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addData, deleteData, getData } from "@/actions";
import { kalenderReducer } from "@/reducers/kalenderReducers";
import { API_URL_getkalender_all } from "@/constants";
import { icons } from "../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  TextField,
  Tooltip,
  PulseLoading,
} from "@/components";
import { debounce } from "lodash";
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { API_URL_edelkalender } from "../../constants";

const KalenderPage = () => {
  const {
    getKalenderResult,
    getKalenderLoading,
    getKalenderError,
    addKalenderResult,
    deleteKalenderResult,
  } = useSelector((state) => state.kalender);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { pk } = useParams();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");

  const debouncedSearch = useCallback(
    debounce((value) => {
      const params = value
        ? `?search=${value}&limit=${limit}&offset=${pageActive * limit}`
        : `?limit=${limit}&offset=${pageActive * limit}`;
      fetchKalenderData(params);
    }, 300),
    [limit, pageActive]
  );

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
    setPageActive(0);
  };

  const handleAdd = (item) => {
    navigate(
      "/kalender/form",
      pk
        ? {
            state: {
              item,
            },
          }
        : {}
    );
    sessionStorage.setItem("url", location.pathname)
  };

  const handleEdit = (data) => {
    const item = {
      ...data,
      perusahaan_id: data.perusahaan.id,
    }
    navigate(`/kalender/form/${data.id}`, {
      state: { item },
    });
    sessionStorage.setItem("url", location.pathname)
  };

  const handleDelete = (item) => {
    deleteData(
      { dispatch, redux: kalenderReducer },
      item.id,
      API_URL_edelkalender,
      "DELETE_KALENDER"
    );
  };

  const fetchKalenderData = useCallback(
    (params) => {
      getData(
        { dispatch, redux: kalenderReducer },
        { param: params },
        pk ? API_URL_getkalender_all + pk + "/" : API_URL_getkalender_all,
        "GET_KALENDER"
      );
    },
    [dispatch]
  );

  const handlePageChange = (page) => {
    const offset = (page - 1) * limit;
    const params = search
      ? `?search=${search}&limit=${limit}&offset=${offset}`
      : `?limit=${limit}&offset=${offset}`;

    fetchKalenderData(params);
    setPageActive(page - 1);
  };

  useEffect(() => {
    const params = `?limit=${limit}&offset=${pageActive * limit}`;
    fetchKalenderData(params);
  }, [limit, pageActive, fetchKalenderData]);

  useEffect(() => {
    if (addKalenderResult || deleteKalenderResult) {
      const params = search
        ? `?search=${search}&limit=${limit}&offset=${pageActive * limit}`
        : `?limit=${limit}&offset=${pageActive * limit}`;
      fetchKalenderData(params);
    }
  }, [
    addKalenderResult,
    deleteKalenderResult,
    search,
    limit,
    pageActive,
    fetchKalenderData,
  ]);

  const dataWithIndex =
    getKalenderResult?.results?.map((item, index) => ({
      ...item,
      index: pageActive * limit + index + 1,
    })) || [];

  return (
    <div>
      <Container>
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-60">
            <TextField
              onChange={handleSearch}
              placeholder="Search"
              value={search}
              icon={<CiSearch />}
            />
          </div>
          <Button onClick={() => handleAdd({ perusahaan_id: pk })}>
            <div className="flex items-center gap-2">
              <FaPlus /> Tambah Kalender
            </div>
          </Button>
        </div>

        {getKalenderLoading ? (
          <div className="flex justify-center py-4">
            <PulseLoading />
          </div>
        ) : (
          <Tables>
            <Tables.Head>
              <tr>
                <Tables.Header>No</Tables.Header>
                <Tables.Header>Nama Kalender</Tables.Header>
                <Tables.Header>Mulai</Tables.Header>
                <Tables.Header>Selesai</Tables.Header>
                <Tables.Header>Keterangan</Tables.Header>
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {dataWithIndex.length > 0 ? (
                dataWithIndex.map((item) => (
                  <Tables.Row key={item?.id}>
                    <Tables.Data>{item?.index}</Tables.Data>
                    <Tables.Data>{item?.title}</Tables.Data>
                    <Tables.Data>{item?.start}</Tables.Data>
                    <Tables.Data>{item?.end}</Tables.Data>
                    <Tables.Data>{item?.type}</Tables.Data>
                    <Tables.Data center>
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip tooltip="Edit">
                          <div
                            onClick={() => handleEdit(item)}
                            className="text-green-500 cursor-pointer"
                          >
                            {icons.bspencil}
                          </div>
                        </Tooltip>
                        <Tooltip tooltip="Delete">
                          <div
                            onClick={() => handleDelete(item)}
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
                  <td className="text-center" colSpan="5">
                    <p>Tidak ada data yang tersedia</p>
                  </td>
                </Tables.Row>
              )}
            </Tables.Body>
          </Tables>
        )}

        <div className="flex justify-end items-center mt-4">
          <Pagination
            totalCount={getKalenderResult?.count || 0}
            pageSize={limit}
            currentPage={pageActive + 1}
            onPageChange={handlePageChange}
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

export default KalenderPage;
