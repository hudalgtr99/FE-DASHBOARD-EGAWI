import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteData, encrypted_id, getData, updateData } from "@/actions";
import { userReducer } from "@/reducers/authReducers";
import {
  API_URL_edeluser,
  API_URL_datapegawaijobdesk,
  API_URL_changeactive,
  API_URL_changeoutofarea,
} from "@/constants";
import { icons } from "../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  TextField,
  Tooltip,
  PulseLoading,
  Checkbox,
} from "@/components";
import { debounce } from "lodash"; // Import lodash debounce
import { CiSearch } from "react-icons/ci";
import { FaFileExcel, FaPlus } from "react-icons/fa";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { AuthContext, useAuth } from "@/context/AuthContext";
import { LuEye, LuPencil } from "react-icons/lu";
import { jobdeskPegawaiReducer } from "../../../reducers/jobdeskPegawaiReducers";
import { Modal } from "../../../components";
import axiosAPI from "../../../authentication/axiosApi";
import { set } from "date-fns";
import moment from "moment";

const JobdeskPegawaiPage = () => {
  const {
    getJobdeskPegawaiResult,
    addJobdeskPegawaiResult,
    deleteJobdeskPegawaiResult,
    getJobdeskPegawaiLoading,
  } = useSelector((state) => state.jobdeskpegawai);

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
  const [detailJobdesk, setDetailJobdesk] = useState("");

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
    navigate(`/kepegawaian/jobdeskpegawai/form/${encrypted_id(item.id)}`);
  };

  const onShow = (item) => {
    getDetail(item?.id);
    setShowModal(true);
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: jobdeskPegawaiReducer },
      item.id,
      API_URL_edeluser,
      "DELETE_AKUN"
    );
  };

  const get = useCallback(
    async (param) => {
      await getData(
        { dispatch, redux: jobdeskPegawaiReducer },
        param,
        API_URL_datapegawaijobdesk,
        "GET_JOBDESKPEGAWAI"
      );

      setLoading(false);
    },
    [dispatch]
  );

  const getDetail = async (id) => {
    setLoadingModal(true);
    try {
      const res = await axiosAPI.get(`${API_URL_datapegawaijobdesk}${id}`);
      setDetailJobdesk(res.data);
    } catch (error) {
      alert(
        error.response.data.error ||
          "Terjadi Kesalahan saat mengambil detail jobdesk pegawai"
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
    if (addJobdeskPegawaiResult || deleteJobdeskPegawaiResult) {
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
    addJobdeskPegawaiResult,
    deleteJobdeskPegawaiResult,
    search,
    limit,
    pageActive,
    get,
  ]);

  const dataWithIndex = getJobdeskPegawaiResult.results
    ? getJobdeskPegawaiResult.results.map((item, index) => ({
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
    navigate(`/kepegawaian/jobdeskpegawai/form`);
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
                <FaPlus /> Tambah Jobdesk Pegawai
              </div>
            </Button>
          </div>
        </div>
        {getJobdeskPegawaiLoading ? ( // Show loading indicator if loading is true
          <div className="flex justify-center py-4">
            <PulseLoading />
          </div>
        ) : (
          <Tables>
            <Tables.Head>
              <tr>
                <Tables.Header>No</Tables.Header>
                {/* <Tables.Header>Id pegawai</Tables.Header> */}
                {jwt?.level === "Super Admin" && (
                  <Tables.Header>Nama perusahaan</Tables.Header>
                )}
                <Tables.Header>Id Pegawai</Tables.Header>
                <Tables.Header>Nama Pegawai</Tables.Header>
                <Tables.Header>Jabatan</Tables.Header>
                <Tables.Header>Jobdesk</Tables.Header>
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
                      {item?.first_name || "Nama tidak tersedia"}
                    </Tables.Data>
                    <Tables.Data>{item?.jabatan_pegawai || "-"}</Tables.Data>
                    <Tables.Data>{item?.total_jobdesk}</Tables.Data>
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
            totalCount={getJobdeskPegawaiResult.count} // Total items count from the API result
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
            Detail Jobdesk
          </h2>
          <ul className="space-y-4">
            <li className="flex justify-between">
              <span className="font-medium">ID:</span>
              <span className="text-gray-800">{detailJobdesk?.id}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Nama:</span>
              <span className="text-gray-800">{detailJobdesk?.first_name}</span>
            </li>
            {jwt?.level === "Super Admin" && (
              <li className="flex justify-between">
                <span className="font-medium">Perusahaan:</span>
                <span className="text-gray-800">
                  {detailJobdesk?.nama_perusahaan}
                </span>
              </li>
            )}
            <li className="flex justify-between">
              <span className="font-medium">ID Pegawai:</span>
              <span className="text-gray-800">{detailJobdesk?.id_pegawai}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Jabatan:</span>
              <span className="text-gray-800">
                {detailJobdesk?.jabatan_pegawai}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Total Jobdesk:</span>
              <span className="text-gray-800">
                {detailJobdesk?.total_jobdesk}
              </span>
            </li>
            <li>
              <span className="font-medium">Detail Jobdesk:</span>
              <ul className="mt-2 space-y-2">
                {detailJobdesk?.jobdesk_details?.length > 0 ? (
                  detailJobdesk?.jobdesk_details?.map((jobdesk, index) => (
                    <li
                      key={index}
                      className="border border-gray-300 p-4 rounded-md bg-gray-50"
                    >
                      <h3 className="font-semibold">{jobdesk?.title}</h3>
                      <p className="text-gray-600">{jobdesk?.description}</p>
                      <div className="mt-2">
                        <span className="font-medium">Tanggal:</span>{" "}
                        <span className="text-gray-800">
                          {moment(jobdesk?.date).format("DD MMMM YYYY")}
                        </span>
                      </div>
                      {/* <div className="mt-1">
                        <span className="font-medium">Prioritas:</span>{" "}
                        <span className="text-gray-800">
                          {jobdesk?.priority_display}
                        </span>
                      </div> */}
                      <div className="mt-1">
                        <span className="font-medium">Periode Pekerjaan:</span>{" "}
                        <span className="text-gray-800">
                          {jobdesk?.recurrence_display}
                        </span>
                      </div>
                      {/* <div className="mt-1">
                        <span className="font-medium">Status:</span>{" "}
                        <span className="text-gray-800">
                          {jobdesk?.is_completed ? "Selesai" : "Belum Selesai"}
                        </span>
                      </div> */}
                      <div className="mt-1">
                        <span className="font-medium">Dibuat Oleh:</span>{" "}
                        <span className="text-gray-800">
                          {jobdesk?.created_by_firstname}
                        </span>
                      </div>
                      {/* <div className="mt-1">
                        <span className="font-medium">Dibuat Pada:</span>{" "}
                        <span className="text-gray-800">
                          {new Date(jobdesk?.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className="font-medium">Diupdate Pada:</span>{" "}
                        <span className="text-gray-800">
                          {new Date(jobdesk?.updated_at).toLocaleString()}
                        </span>
                      </div> */}
                    </li>
                  ))
                ) : (
                  <div className="text-center">Tidak ada detail Jobdesk</div>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default JobdeskPegawaiPage;
