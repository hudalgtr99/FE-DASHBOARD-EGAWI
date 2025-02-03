import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteData, encrypted_id, getData } from "@/actions";
import {
  API_URL_delegation,
  API_URL_edeluser,
  API_URL_subtodotask,
  API_URL_todotask,
  baseurl,
} from "@/constants";
import {
  Button,
  Container,
  Pagination,
  Tables,
  TextField,
  Tooltip,
  PulseLoading,
  Modal,
} from "@/components";
import { debounce } from "lodash"; // Import lodash debounce
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";

import { AuthContext, useAuth } from "@/context/AuthContext";
import { LuEye } from "react-icons/lu";
import { delegationReducer } from "@/reducers/delegationReducers";
import axiosAPI from "@/authentication/axiosApi";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { todoTaskReducer } from "@/reducers/todoTaskReducers";
import moment from "moment";
import { subTodoTaskReducer } from "@/reducers/subTodoTaskReducers";

const SubAktivitasPage = () => {
  const {
    getSubTodoTaskResult,
    addSubTodoTaskResult,
    deleteSubTodoTaskResult,
    getSubTodoTaskLoading,
  } = useSelector((state) => state.subtodotask);

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
  const [detailSubTodoTask, setDetailSubTodoTask] = useState("");

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
    }, 1000),
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
    navigate(`/manajementugas/daftarcalontugas/form/${encrypted_id(item.id)}`);
  };

  const onShow = (item) => {
    getDetail(item?.id);
    setShowModal(true);
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: subTodoTaskReducer },
      item.id,
      API_URL_subtodotask,
      "DELETE_SUBTODOTASK"
    );
  };

  const get = useCallback(
    async (param) => {
      await getData(
        { dispatch, redux: subTodoTaskReducer },
        param,
        API_URL_subtodotask,
        "GET_SUBTODOTASK"
      );
      setLoading(false);
    },
    [dispatch]
  );

  const getDetail = async (id) => {
    setLoadingModal(true);
    try {
      const res = await axiosAPI.get(`${API_URL_subtodotask}${id}`);
      setDetailSubTodoTask(res.data);
    } catch (error) {
      alert(
        error?.response?.data?.error ||
          "Terjadi Kesalahan saat mengambil detail calon tugas"
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
    if (addSubTodoTaskResult || deleteSubTodoTaskResult) {
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
    addSubTodoTaskResult,
    deleteSubTodoTaskResult,
    search,
    limit,
    pageActive,
    get,
  ]);

  //   const dataWithIndex = [];

  //   console.log(getSubTodoTaskResult);

  const dataWithIndex = getSubTodoTaskResult?.results
    ? getSubTodoTaskResult?.results?.map((item, index) => ({
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
  ]);

  const onAdd = () => {
    navigate(`/manajementugas/daftarcalontugas/form`);
  };

  return (
    <div className="p-2">
      {getSubTodoTaskLoading ? ( // Show loading indicator if loading is true
        <div className="flex justify-center py-4">
          <PulseLoading />
        </div>
      ) : (
        <>
          {dataWithIndex?.map((item, index) => {
            return (
              <div key={index} className="h-fit mb-8 p-1 shadow-md">
                <div className="flex flex-row justify-between gap-2 items-center">
                  <div className="flex flex-row gap-2">
                    <img
                      className="w-10 h-10 rounded-full bg-violet-400"
                      src={baseurl + item?.createdby_details?.image}
                    />

                    <div className="font-medium">
                      <div>{item?.createdby_details?.first_name}</div>
                      {/* <div>{item?.}</div> */}
                      <div className="text-xs bg-violet-200 p-1 rounded">
                        To do : {item?.todotask_details?.title}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div>
                      {moment(item?.created_at).format("DD MMMM YYYY, HH:mm")}
                    </div>
                  </div>
                </div>
                <div>{item?.title}</div>
              </div>
            );
          })}
        </>
      )}
      <div className="flex justify-end items-center mt-4">
        <Pagination
          totalCount={getSubTodoTaskResult?.count} // Total items count from the API result
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

      <Modal
        show={showModal}
        setShow={setShowModal}
        width="md"
        btnClose={true}
        persistent={false}
      >
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Detail Calon Tugas
          </h2>
          {/* <div>Fitur Sedang dibuat</div> */}
          <ul className="space-y-4">
            {jwt?.level === "Super Admin" && (
              <li className="flex justify-between">
                <span className="font-medium">Perusahaan:</span>
                <span className="text-gray-800">
                  {detailSubTodoTask?.company_name}
                </span>
              </li>
            )}
            <li className="flex justify-between">
              <span className="font-medium">Nama:</span>
              <span className="text-gray-800">
                {detailSubTodoTask?.createdbydetail?.first_name}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">ID Pegawai:</span>
              <span className="text-gray-800">
                {detailSubTodoTask?.id_pegawai}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Jabatan:</span>
              <span className="text-gray-800">
                {detailSubTodoTask?.jabatan_pegawai}
              </span>
            </li>
          </ul>
          <div className="mt-4  bg-white rounded-lg shadow-md">
            <div className="font-medium text-gray-800 mb-2">
              Departemen Yang Akan Ditunjukan:
            </div>
            <div className="space-y-2">
              {detailSubTodoTask.departemen_details &&
                detailSubTodoTask.departemen_details.map((value, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition duration-200"
                  >
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                        <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-gray-800">
                      {value?.departemen?.nama}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubAktivitasPage;
