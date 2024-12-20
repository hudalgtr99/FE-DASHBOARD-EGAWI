import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteData, getData, updateData } from "@/actions";
import { perusahaanReducer } from "@/reducers/perusahaanReducers";
import {
  API_URL_edelperusahaan,
  API_URL_getperusahaan_withPaginations,
  API_URL_changeactivedata
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
  PulseLoading,
} from "@/components";
import { debounce } from "lodash";
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const PerusahaanPage = () => {
  const {
    getperusahaanResult,
    getperusahaanLoading,
    addperusahaanResult,
    deleteperusahaanResult,
  } = useSelector((state) => state.perusahaan); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");

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
    navigate("/perusahaan/form");
  };

  const onEdit = (item) => {
    navigate(`/perusahaan/form/${item.slug}`, {
      state: {
        item,
      },
    });
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: perusahaanReducer },
      item.slug,
      API_URL_edelperusahaan,
      "DELETE_perusahaan" // Update to match your action type
    );
  };

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: perusahaanReducer },
        param,
        API_URL_getperusahaan_withPaginations,
        "GET_perusahaan" // Update to match your action type
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

  const [actions] = useState([
    {
      name: "Edit",
      icon: icons.bspencil,
      color: "text-green-500",
      func: onEdit,
    },
  ]);

  useEffect(() => {
    const param = { param: `?limit=${limit}&offset=${pageActive * limit}` };
    if (search) {
      get({
        param: `?search=${search}&limit=${limit}&offset=${pageActive * limit}`,
      });
    } else {
      get(param);
    }
  }, [limit, pageActive, search, get]);

  useEffect(() => {
    if (addperusahaanResult || deleteperusahaanResult) {
      const param = search
        ? {
            param: `?search=${search}&limit=${limit}&offset=${
              pageActive * limit
            }`,
          }
        : { param: `?limit=${limit}&offset=${pageActive * limit}` };
      get(param);
    }
  }, [
    addperusahaanResult,
    deleteperusahaanResult,
    search,
    limit,
    pageActive,
    get,
  ]);

  const dataWithIndex = getperusahaanResult.results
    ? getperusahaanResult.results.map((item, index) => ({
        ...item,
        index: pageActive * limit + index + 1,
      }))
    : [];

  function handleActive(e, item){
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Ingin mengubah status perusahaan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6a82fb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, ubah!",
      cancelButtonText: "Batal",
      customClass: {
        container: "z-[99999]",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const data = updateData(
          { dispatch, redux: perusahaanReducer },
          {
            pk: "perusahaan",
            slug: item.slug,
          },
          API_URL_changeactivedata,
          "ADD_perusahaan"
        );
      }})
  }

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
              <FaPlus /> Tambah Perusahaan
            </div>
          </Button>
        </div>

        {getperusahaanLoading ? (
          <div className="flex justify-center py-4">
            <PulseLoading />
          </div>
        ) : (
          <Tables>
            <Tables.Head>
              <tr>
                <Tables.Header>No</Tables.Header>
                <Tables.Header>Nama perusahaan</Tables.Header>
                <Tables.Header>No Telepon</Tables.Header>
                <Tables.Header>Alamat</Tables.Header>
                <Tables.Header>Active</Tables.Header>
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {dataWithIndex.length > 0 ? (
                dataWithIndex.map((item) => (
                  <Tables.Row key={item.pk}>
                    <Tables.Data>{item.index}</Tables.Data>
                    <Tables.Data>{item.nama}</Tables.Data>
                    <Tables.Data>{item.no_telepon}</Tables.Data>
                    <Tables.Data>{item.alamat}</Tables.Data>
                    <Tables.Data center>
                      <label className="flex items-center justify-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.is_active ? true : false}
                          onChange={(e) => handleActive(e, item)}
                          className="toggle-switch"
                        />
                      </label>
                    </Tables.Data>
                    <Tables.Data center>
                      <div className="flex items-center justify-center gap-2">
                        {actions.map((action, i) => (
                          <Tooltip key={i} tooltip={action.name}>
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
            totalCount={getperusahaanResult.count}
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

export default PerusahaanPage;
