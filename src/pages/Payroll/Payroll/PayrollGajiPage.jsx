import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteData, encrypted_id, getData } from "@/actions";
import { API_URL_edeluser, API_URL_payroll } from "@/constants";
import {
  Button,
  Container,
  Pagination,
  Tables,
  Tooltip,
  PulseLoading,
} from "@/components";
import { debounce } from "lodash"; // Import lodash debounce
import { FaTelegramPlane } from "react-icons/fa";

import { AuthContext, useAuth } from "@/context/AuthContext";
import { LuEye, LuPencil } from "react-icons/lu";
import { Modal } from "../../../components";
import axiosAPI from "../../../authentication/axiosApi";
import { masterGajiReducer } from "@/reducers/masterGajiReducers";
import formatRupiah from "@/utils/formatRupiah";
import { FaCalendar } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import id from "date-fns/locale/id";
import { format } from "date-fns";
import moment from "moment";
import { payrollReducer } from "@/reducers/payrollReducers";
import SelectMonthYear from "@/components/atoms/SelectMonthYear";

const PayrollGajiPage = () => {
  const [periodeMonth, setPeriodeMonth] = useState(new Date());

  const {
    getPayrollResult,
    addPayrollResult,
    deletePayrollResult,
    getPayrollLoading,
  } = useSelector((state) => state.payroll);

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

      if (periodeMonth instanceof Date && !isNaN(periodeMonth)) {
        param.param += `&periode=${moment(periodeMonth).format("YYYY-MM")}`;
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
    navigate(`/payroll/payrollgaji/form/${encrypted_id(item.id)}`);
  };

  const onShow = (item) => {
    getDetail(item?.id);
    setShowModal(true);
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: payrollReducer },
      item.id,
      API_URL_edeluser,
      "DELETE_AKUN"
    );
  };

  const get = useCallback(
    async (param) => {
      await getData(
        { dispatch, redux: payrollReducer },
        param,
        API_URL_payroll,
        "GET_PAYROLL"
      );
      setLoading(false);
    },
    [dispatch]
  );

  const getDetail = async (id) => {
    setLoadingModal(true);
    try {
      const res = await axiosAPI.get(`${API_URL_payroll}${id}`);
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

    if (periodeMonth instanceof Date && !isNaN(periodeMonth)) {
      param.param += `&periode=${moment(periodeMonth).format("YYYY-MM")}`;
  } 
    get(param);
    setPageActive(page - 1);
  };

  useEffect(() => {
    const offset = pageActive * limit;

    // Menyiapkan parameter pencarian berdasarkan kondisi slug
    const param = selectedPerusahaan?.value
      ? {
          param: `?search=${search || ""}&perusahaan=${
            selectedPerusahaan?.value || ""
          }&limit=${limit}&offset=${offset}`,
        }
      : { param: `?limit=${limit}&search=${search || ""}&offset=${offset}` };

    if (periodeMonth) {
      param.param += `&periode=${moment(periodeMonth).format("YYYY-MM")}`;
    }

    get(param);
  }, [slug, selectedPerusahaan, limit, pageActive, get, periodeMonth]);

  useEffect(() => {
    if (addPayrollResult || deletePayrollResult) {
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
      if (periodeMonth) {
        param.param += `&periode=${moment(periodeMonth).format("YYYY-MM")}`;
      }
      get(param);
    }
  }, [addPayrollResult, deletePayrollResult, search, limit, pageActive, get]);

  const dataWithIndex = getPayrollResult.results
    ? getPayrollResult.results.map((item, index) => ({
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
        <div className="flex flex-row items-center gap-4 justify-between">
          {/* <div className="flex flex-row items-center gap-4">
            <button
              onClick={() => alert("hello")}
              className="flex text-sm flex-row rounded items-center gap-2 bg-orange-500 text-white w-fit px-2 py-1 hover:bg-orange-600"
            >
              <FaCogs />
              Pengaturan
            </button>
          </div> */}

          <div>
            <label className="text-sm">Periode : </label>
            <div className="">
            <SelectMonthYear 
              selected={periodeMonth}
              onChange={(date) => {
                  const validDate = date ? new Date(date) : null;
                  setPeriodeMonth(validDate && !isNaN(validDate) ? validDate : null);
              }} 
            />       
            </div>
          </div>

          <button
            onClick={() => alert("hello")}
            className="flex text-sm flex-row rounded items-center gap-2 bg-sky-500 text-white w-fit px-2 py-1 hover:bg-sky-600"
          >
            <FaTelegramPlane />
            Jalankan Payroll
          </button>
        </div>

        {getPayrollLoading ? ( // Show loading indicator if loading is true
          <div className="flex justify-center py-4">
            <PulseLoading />
          </div>
        ) : (
          <Tables>
            <Tables.Head>
              <tr>
                <Tables.Header>No</Tables.Header>
                {jwt?.level === "Super Admin" && (
                  <Tables.Header>Perusahaan</Tables.Header>
                )}
                <Tables.Header>Nama Pegawai</Tables.Header>
                <Tables.Header>Jabatan</Tables.Header>
                <Tables.Header>Gaji Pokok</Tables.Header>
                <Tables.Header>Tambahan</Tables.Header>
                <Tables.Header>Potongan</Tables.Header>
                <Tables.Header>Total</Tables.Header>
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {dataWithIndex.length > 0 ? (
                dataWithIndex.map((item) => (
                  <Tables.Row key={item.id}>
                    <Tables.Data>{item.index || "-"}</Tables.Data>
                    {jwt?.level === "Super Admin" && (
                      <Tables.Data>{item?.company_name || "N/A"}</Tables.Data>
                    )}
                    <Tables.Data>
                      {item?.employee_first_name || "Nama tidak tersedia"}
                    </Tables.Data>
                    <Tables.Data>{item?.jabatan_pegawai || "-"}</Tables.Data>
                    <Tables.Data>
                      {formatRupiah(item?.basic_salary)}
                    </Tables.Data>
                    <Tables.Data>
                      <span className="text-green-600">
                        {formatRupiah(item?.total_income)}
                      </span>
                    </Tables.Data>
                    <Tables.Data>
                      <span className="text-red-600">
                        {formatRupiah(item?.total_deduction)}
                      </span>
                    </Tables.Data>
                    <Tables.Data>
                      <span className="text-gray-800">
                        {formatRupiah(item?.total_salary)}
                      </span>
                    </Tables.Data>
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
                    Tidak ada data pada Periode{" "}
                    {format(periodeMonth, "MMMM yyyy", { locale: id })}
                  </td>
                </Tables.Row>
              )}
            </Tables.Body>
          </Tables>
        )}
        <div className="flex justify-end items-center mt-4">
          <Pagination
            totalCount={getPayrollResult.count} // Total items count from the API result
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
              <span className="text-gray-800">{detailGaji?.id}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Nama:</span>
              <span className="text-gray-800">{detailGaji?.employee_name}</span>
            </li>
            {jwt?.level === "Super Admin" && (
              <li className="flex justify-between">
                <span className="font-medium">Perusahaan:</span>
                <span className="text-gray-800">
                  {detailGaji?.nama_perusahaan}
                </span>
              </li>
            )}
            <li className="flex justify-between">
              <span className="font-medium">ID Pegawai:</span>
              <span className="text-gray-800">{detailGaji?.id_pegawai}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Jabatan:</span>
              <span className="text-gray-800">
                {detailGaji?.jabatan_pegawai}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Gaji:</span>
              <span className="text-gray-800">
                {formatRupiah(detailGaji?.amount)}
              </span>
            </li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default PayrollGajiPage;
