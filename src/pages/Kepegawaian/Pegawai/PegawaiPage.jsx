import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteData, getData, updateData } from "@/actions";
import { userReducer } from "@/reducers/authReducers";
import {
  API_URL_edeluser,
  API_URL_getdataakun,
  API_URL_changeactive,
  API_URL_changeoutofarea,
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
import { debounce } from "lodash"; // Import lodash debounce
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const AkunPage = () => {
  const {
    getDataAkunResult,
    addAkunResult,
    deleteAkunResult,
    getDataAkunLoading,
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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

  const onEdit = (item) => {
    // Store the item in localStorage
    localStorage.setItem("editUserData", JSON.stringify(item));
    sessionStorage.removeItem("url"), sessionStorage.removeItem("activeTab");
    navigate(`/kepegawaian/pegawai/form/${item.datapribadi.no_identitas}`);
  };

  const onChange = (item) => {
    sessionStorage.removeItem("url"), sessionStorage.removeItem("activeTab");
    navigate(
      `/kepegawaian/pegawai/changepassword/${item.datapribadi.no_identitas}`
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
      await getData(
        { dispatch, redux: userReducer },
        param,
        API_URL_getdataakun,
        "GET_AKUN"
      );

      setLoading(false);
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

  const handleSwitch = (e, item, index) => {
    if (index === 6) {
      Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Ingin mengubah status pegawai ini?",
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
          updateData(
            { dispatch, redux: userReducer },
            {
              pk: item.datapribadi.user_id,
            },
            API_URL_changeactive,
            "ADD_AKUN"
          );
        }
      });
    } else if (index === 7) {
      Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Ingin mengubah status pegawai ini?",
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
          updateData(
            { dispatch, redux: userReducer },
            {
              pk: item.datapribadi.user_id,
            },
            API_URL_changeoutofarea,
            "ADD_AKUN"
          );
        }
      });
    }
  };

  useEffect(() => {
    const param = {
      param: "?limit=" + limit + "&offset=" + pageActive * limit,
    };
    get(param);
  }, [limit, pageActive, get]);

  useEffect(() => {
    if (addAkunResult || deleteAkunResult) {
      const offset = pageActive * limit;
      const param = search
        ? { param: `?search=${search}&limit=${limit}&offset=${offset}` }
        : { param: `?limit=${limit}&offset=${offset}` };
      get(param);
    }
  }, [addAkunResult, deleteAkunResult, search, limit, pageActive, get]);

  const dataWithIndex = getDataAkunResult.results
    ? getDataAkunResult.results.map((item, index) => ({
        ...item,
        index: pageActive * limit + index + 1,
      }))
    : [];

  const [actions] = useState([
    {
      name: "Edit",
      icon: icons.fiedit,
      color: "text-blue-500",
      func: onEdit,
    },
    {
      name: "Change Password",
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

  const onAdd = () => {
    localStorage.setItem(
      "editUserData",
      JSON.stringify({
        datapribadi: {
          user_id: null,
          nama: "",
          username: "",
          email: "",
          is_staff: false,
          perusahaan: "",
          lokasi_absen: [],
          groups: {},
          jenis_kelamin: "",
          no_identitas: "",
          npwp: "",
          agama: "",
          alamat_ktp: "",
          alamat_domisili: "",
          no_telepon: "",
          tempat_lahir: "",
          tgl_lahir: "",
          out_of_area: false,
          password: "",
        },
        datapegawai: null,
        datakeluarga: null,
        datapendidikan: null,
        datalainnya: null,
        datajadwal: {
          jadwal: "{}",
        },
        index: null,
      })
    );
    sessionStorage.removeItem("url"), sessionStorage.removeItem("activeTab");
    navigate("/kepegawaian/pegawai/form");
  };

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
              <FaPlus /> Tambah Pegawai
            </div>
          </Button>
        </div>
        {getDataAkunLoading ? ( // Show loading indicator if loading is true
          <div className="flex justify-center py-4">
            <PulseLoading />
          </div>
        ) : (
          <Tables>
            <Tables.Head>
              <tr>
                <Tables.Header>No</Tables.Header>
                {/* <Tables.Header>Id pegawai</Tables.Header> */}
                {!jwt.perusahaan && (
                  <Tables.Header>Nama perusahaan</Tables.Header>
                )}
                <Tables.Header>Id Pegawai</Tables.Header>
                <Tables.Header>Nama Pribadi</Tables.Header>
                <Tables.Header>Jabatan</Tables.Header>
                <Tables.Header>Email</Tables.Header>
                <Tables.Header>Nomor Telepon</Tables.Header>
                <Tables.Header>Active</Tables.Header>
                <Tables.Header>Out of Area</Tables.Header>
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {dataWithIndex.length > 0 ? (
                dataWithIndex.map((item) => (
                  <Tables.Row key={item.datapribadi.user_id}>
                    <Tables.Data>{item.index || "-"}</Tables.Data>
                    {!jwt.perusahaan && (
                      <Tables.Data>
                        {item?.datapribadi?.perusahaan?.nama || "N/A"}
                      </Tables.Data>
                    )}
                    <Tables.Data>
                      {item.datapegawai?.id_pegawai || "belum ada"}
                    </Tables.Data>
                    <Tables.Data>
                      {item.datapribadi?.nama || "Nama tidak tersedia"}
                    </Tables.Data>
                    <Tables.Data>
                      {item.datapegawai?.jabatan?.nama || "-"}
                    </Tables.Data>
                    <Tables.Data>
                      {item.datapribadi?.email || "Email tidak tersedia"}
                    </Tables.Data>
                    <Tables.Data>
                      {item.datapribadi?.no_telepon ||
                        "No telepon tidak tersedia"}
                    </Tables.Data>
                    <Tables.Data>
                      <label className="flex items-center justify-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.datapribadi?.is_staff || false}
                          onChange={(e) => handleSwitch(e, item, 6)}
                          className="toggle-switch"
                        />
                      </label>
                    </Tables.Data>
                    <Tables.Data>
                      <label className="flex items-center justify-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.datapribadi?.out_of_area || false}
                          onChange={(e) => handleSwitch(e, item, 7)}
                          className="toggle-switch"
                        />
                      </label>
                    </Tables.Data>
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
                  <td colSpan="9" className="text-center">
                    Tidak ada data yang tersedia
                  </td>
                </Tables.Row>
              )}
            </Tables.Body>
          </Tables>
        )}
        <div className="flex justify-end items-center mt-4">
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
