import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteData, encrypted_id, getData } from "@/actions";
import { API_URL_edeluser, API_URL_salary } from "@/constants";
import {
  Button,
  Container,
  Pagination,
  Tables,
  TextField,
  Tooltip,
  PulseLoading,
} from "@/components";
import { debounce } from "lodash"; // Import lodash debounce
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";

import { AuthContext, useAuth } from "@/context/AuthContext";
import { LuEye, LuPencil } from "react-icons/lu";
import { Modal } from "../../../components";
import axiosAPI from "../../../authentication/axiosApi";
import moment from "moment";
import { masterGajiReducer } from "@/reducers/masterGajiReducers";

const MasterGajiPage = () => {
  const {
    getMasterGajiResult,
    addMasterGajiResult,
    deleteMasterGajiResult,
    getMasterGajiLoading,
  } = useSelector((state) => state.mastergaji);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);
  const { slug } = useParams();
  const { selectedPerusahaan, loadingPerusahaan } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [detailGaji, setDetailGaji] = useState("");

  const { jwt } = useContext(AuthContext);

  const debouncedSearch = useCallback(
    debounce((value) => {
      const param = {
        param: `?search=${value}&limit=${limit}&offset=${pageActive * limit}`,
      };

      // Jika perusahaan dipilih, tambahkan parameter perusahaan ke dalam query string
      if (selectedPerusahaan) {
        param.param += `&perusahaan=${selectedPerusahaan.value}`;
      }

      get(param);
    }, 1500),
    [limit, pageActive, selectedPerusahaan] // Tambahkan selectedPerusahaan sebagai dependency
  );

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
    setPageActive(0);
  };

  const onEdit = (item) => {
    // Store the item in localStorage
    navigate(`/payroll/mastergaji/form/${encrypted_id(item.id)}`);
  };

  const onShow = (item) => {
    getDetail(item?.id);
    setShowModal(true);
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: masterGajiReducer },
      item.id,
      API_URL_edeluser,
      "DELETE_AKUN"
    );
  };

  const get = useCallback(
    async (param) => {
      await getData(
        { dispatch, redux: masterGajiReducer },
        param,
        API_URL_salary,
        "GET_MASTERGAJI"
      );
      setLoading(false);
    },
    [dispatch]
  );

  const getDetail = async (id) => {
    setLoadingModal(true);
    try {
      const res = await axiosAPI.get(`${API_URL_salary}${id}`);
      setDetailGaji(res.data);
    } catch (error) {
      alert(
        error.response.data.error ||
          "Terjadi Kesalahan saat mengambil detail gaji pegawai"
      );
    }
    setLoadingModal(false);
  };

  const handlePageClick = (page) => {
    const offset = (page - 1) * limit; // Calculate the offset based on the page

    // Menyiapkan parameter pencarian dan perusahaan
    const param = {
      param: `?search=${search || ""}&perusahaan=${
        selectedPerusahaan?.value || ""
      }&limit=${limit}&offset=${offset}`,
    };

    get(param);
    setPageActive(page - 1);
  };

  useEffect(() => {
    const offset = pageActive * limit;

    // Menyiapkan parameter pencarian berdasarkan kondisi slug
    const param = selectedPerusahaan?.value
      ? `?search=${search || ""}&perusahaan=${
          selectedPerusahaan?.value || ""
        }&limit=${limit}&offset=${offset}`
      : `?limit=${limit}&search=${search || ""}&offset=${offset}`;

    get({ param });
  }, [slug, selectedPerusahaan, limit, pageActive, get]);

  useEffect(() => {
    if (addMasterGajiResult || deleteMasterGajiResult) {
      const param = search
        ? {
            param: `?search=${search}&perusahaan=${
              selectedPerusahaan?.value || ""
            }&limit=${limit}&offset=${pageActive * limit}`,
          }
        : {
            param: `?perusahaan=${
              selectedPerusahaan?.value || ""
            }&limit=${limit}&offset=${pageActive * limit}`,
          };
      get(param);
    }
  }, [
    addMasterGajiResult,
    deleteMasterGajiResult,
    search,
    limit,
    pageActive,
    get,
  ]);

  const dataWithIndex = getMasterGajiResult.results
    ? getMasterGajiResult.results.map((item, index) => ({
        ...item,
        index: pageActive * limit + index + 1,
      }))
    : [];

  const [actions] = useState([
    {
      name: "Show",
      icon: <LuEye />,
      color: "primary",
      func: onShow,
    },
    {
      name: "Edit",
      icon: <LuPencil />,
      color: "success",
      func: onEdit,
    },
  ]);

  const onAdd = () => {
    navigate(`/payroll/mastergaji/form`);
  };

  return (
    <div>
      <Container>
        <div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <div className={`w-full flex gap-2 sm:w-60`}>
            <TextField
              onChange={doSearch}
              placeholder="Search"
              value={search}
              icon={<CiSearch />}
            />
          </div>
          <div className="flex gap-2 items-center">
            <Button onClick={onAdd}>
              <div className="flex items-center gap-2">
                <FaPlus /> Tambah Gaji Dasar Pegawai
              </div>
            </Button>
          </div>
        </div>
        {getMasterGajiLoading ? ( // Show loading indicator if loading is true
          <div className="flex justify-center py-4">
            <PulseLoading />
          </div>
        ) : (
          <Tables>
            <Tables.Head>
              <tr>
                <Tables.Header>No</Tables.Header>
                {jwt?.level === "Super Admin" && (
                  <Tables.Header>Nama perusahaan</Tables.Header>
                )}
                <Tables.Header>Id Pegawai</Tables.Header>
                <Tables.Header>Nama Pegawai</Tables.Header>
                <Tables.Header>Jabatan</Tables.Header>
                <Tables.Header>Gaji</Tables.Header>
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {dataWithIndex.length > 0 ? (
                dataWithIndex.map((item) => (
                  <Tables.Row key={item.id}>
                    <Tables.Data>{item.index || "-"}</Tables.Data>
                    {jwt?.level === "Super Admin" && (
                      <Tables.Data>
                        {item?.nama_perusahaan || "N/A"}
                      </Tables.Data>
                    )}
                    <Tables.Data>{item?.id_pegawai || "belum ada"}</Tables.Data>
                    <Tables.Data>
                      {item?.employee_name || "Nama tidak tersedia"}
                    </Tables.Data>
                    <Tables.Data>{item?.jabatan_pegawai || "-"}</Tables.Data>
                    <Tables.Data>{item?.amount}</Tables.Data>
                    <Tables.Data center>
                      <div className="flex items-center justify-center gap-2">
                        {actions.map((action) => (
                          <Tooltip key={action.name} tooltip={action.name}>
                            <Button
                              size={30}
                              variant="tonal"
                              color={action.color}
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
            totalCount={getMasterGajiResult.count} // Total items count from the API result
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

      <Modal
        show={showModal}
        setShow={setShowModal}
        width="md"
        btnClose={true}
        persistent={false}
      >
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Detail Gaji
          </h2>
          <ul className="space-y-4">
            <li className="flex justify-between">
              <span className="font-medium">ID:</span>
              <span className="text-gray-700">{detailGaji?.id}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Nama:</span>
              <span className="text-gray-700">{detailGaji?.employee_name}</span>
            </li>
            {jwt?.level === "Super Admin" && (
              <li className="flex justify-between">
                <span className="font-medium">Perusahaan:</span>
                <span className="text-gray-700">
                  {detailGaji?.nama_perusahaan}
                </span>
              </li>
            )}
            <li className="flex justify-between">
              <span className="font-medium">ID Pegawai:</span>
              <span className="text-gray-700">{detailGaji?.id_pegawai}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Jabatan:</span>
              <span className="text-gray-700">
                {detailGaji?.jabatan_pegawai}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Gaji:</span>
              <span className="text-gray-700">{detailGaji?.amount}</span>
            </li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default MasterGajiPage;
