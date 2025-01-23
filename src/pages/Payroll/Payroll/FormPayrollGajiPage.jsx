import React, { useCallback, useContext, useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, Select, Tables } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import {
  addData,
  addFormData,
  decrypted_id,
  encodeURL,
  encrypted,
  encrypted_id,
  updateFormData,
} from "@/actions";
import {
  API_URL_datapegawaijobdesk,
  API_URL_deductiontypes,
  API_URL_getdatapegawaiall,
  API_URL_getdataperusahaanall,
  API_URL_incometypes,
  API_URL_jobdesk,
  API_URL_payroll,
  API_URL_salary,
} from "@/constants";
import { IoAdd, IoAddCircle, IoAddOutline, IoTrash } from "react-icons/io5";
import AsyncSelect from "react-select/async";
import SelectSync from "@/components/atoms/SelectSync";
import { AuthContext, useAuth } from "@/context/AuthContext";
import { apiReducer } from "@/reducers/apiReducers";
import { jobdeskPegawaiReducer } from "@/reducers/jobdeskPegawaiReducers";
import axiosAPI from "@/authentication/axiosApi";
import { masterGajiReducer } from "@/reducers/masterGajiReducers";
import CurrencyInput from "@/components/atoms/CurrencyInput";
import * as Yup from "yup";
import formatRupiah from "@/utils/formatRupiah";
import { FaCompactDisc, FaPencil, FaTrash, FaX } from "react-icons/fa6";
import { useGetData } from "@/actions/auth";
import { showSweetAlert } from "@/utils/showSweetAlert";
import { FaSave } from "react-icons/fa";
import DeductionComponent from "./child/DeductionComponent";
import IncomeComponent from "./child/IncomeComponent";

const FormPayrollGajiPage = () => {
  const { pk } = useParams();
  const { getMasterGajiLoading } = useSelector((state) => state.mastergaji);
  const { selectedPerusahaan } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rerenderPegawai, setRerenderPegawai] = useState(true);
  const [detailPayroll, setDetailPayroll] = useState([]);
  const { jwt } = useContext(AuthContext);

  //list data Komponen
  const [listOptionPendapatan, setListOptionPendapatan] = useState([]);
  const [listOptionPemotongan, setListOptionPemotongan] = useState([]);

  const getIncomeTypes = useGetData(
    API_URL_incometypes,
    ["incometypes", selectedPerusahaan],
    {
      limit: 999999,
      perusahaan: selectedPerusahaan?.value,
    }
  );

  const getDeductionTypes = useGetData(
    API_URL_deductiontypes,
    ["deductiontypes", selectedPerusahaan],
    {
      limit: 99999,
      peruasahaan: selectedPerusahaan?.value,
    }
  );
  // Handle Tambah dan Hapus Komponen Gaji
  const [deductions, setDeductions] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const formik = useFormik({
    initialValues: {
      perusahaan: null,
      employee: null,
      amount: null,
    },
    validationSchema: Yup.object({
      amount: Yup.string().required("Jumlah uang wajib diisi"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      // Validasi manual setiap field
      const errors = {};

      if (values.employee === null) {
        errors.employee = "Pegawai is required";
      }

      if (Object.keys(errors).length > 0) {
        console.log(errors);
        formik.setErrors(errors);
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("employee", encrypted_id(values.employee?.value));
      formData.append("amount", values.amount);

      try {
        if (pk) {
          const dekrip_id = decrypted_id(pk);
          updateFormData(
            { dispatch, redux: masterGajiReducer },
            formData,
            API_URL_salary,
            "UPDATE_MASTERGAJI",
            dekrip_id
          );
        } else {
          addFormData(
            { dispatch, redux: masterGajiReducer },
            formData,
            API_URL_salary,
            "ADD_MASTERGAJI"
          );
        }
        navigate(-1);
      } catch (error) {
        console.log(error);
      }
    },
  });

  // Effect untuk memantau perubahan perusahaan untuk melakukan
  useEffect(() => {
    if (!pk) {
      setRerenderPegawai(false);
      if (formik.values.perusahaan) {
        // Reset employee ke null ketika perusahaan berubah
        formik.setFieldValue("employee", null);
        setTimeout(() => {
          setRerenderPegawai(true);
        }, 1);
      }
    }
  }, [formik.values.perusahaan]);

  // Jika ada Pk maka Fetching data lama
  const get = useCallback(async () => {
    if (decrypted_id(pk)) {
      const response = await axiosAPI.get(
        API_URL_payroll + decrypted_id(pk) + "/"
      );
      const dataResponse = response.data;

      setDetailPayroll(dataResponse);
    } else {
      navigate(-1);
    }
  }, [pk]);

  useEffect(() => {
    if (detailPayroll) {
      setDeductions(detailPayroll?.deduction_details);
      setIncomes(detailPayroll?.income_details);
    }
  }, [detailPayroll]);

  useEffect(() => {
    if (deductions) {
      let totalAmount = 0;
      deductions.forEach((deduction) => {
        totalAmount = Number(deduction.amount) + totalAmount;
      });
      setTotalDeduction(totalAmount);
    }

    if (incomes) {
      let totalAmount = 0;
      incomes.forEach((income) => {
        totalAmount = Number(income.amount) + totalAmount;
      });
      setTotalIncome(totalAmount);
    }
  }, [deductions, incomes]);

  useEffect(() => {
    if (pk) {
      get();
    }
  }, [pk]);

  useEffect(() => {
    if (getIncomeTypes.data) {
      const options =
        getIncomeTypes.data?.results.map((item) => ({
          value: item.id, // Ganti 'id' dengan nama field yang sesuai
          label: item.name, // Ganti 'name' dengan nama field yang sesuai
        })) || [];
      setListOptionPendapatan(options);
    }
  }, [getIncomeTypes.data]);

  useEffect(() => {
    if (getDeductionTypes.data) {
      let options = [];
      options =
        getDeductionTypes.data?.results.map((item) => ({
          value: item.id, // Ganti 'id' dengan nama field yang sesuai
          label: item.name, // Ganti 'name' dengan nama field yang sesuai
        })) || [];
      setListOptionPemotongan(options);
    }
  }, [getDeductionTypes.data]);

  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate(-1)}
          >
            <IoMdReturnLeft />
          </button>
          <h1>{pk ? "Edit Payroll Pegawai" : "Tambah Payroll Pegawai"}</h1>
        </div>
        <div>
          <div className="border p-3 rounded mb-4">
            <div className="font-semibold border-b-2 border-blue-300 w-fit">
              Ringkasan{" "}
            </div>
            <div>
              <Tables>
                <Tables.Head>
                  <tr>
                    {jwt?.level === "Super Admin" && (
                      <Tables.Header>Perusahaan</Tables.Header>
                    )}
                    <Tables.Header>Nama Pegawai</Tables.Header>
                    <Tables.Header>Jabatan</Tables.Header>
                    <Tables.Header>Gaji Pokok</Tables.Header>
                    <Tables.Header>Tambahan</Tables.Header>
                    <Tables.Header>Potongan</Tables.Header>
                    <Tables.Header>Total</Tables.Header>
                  </tr>
                </Tables.Head>
                <Tables.Body>
                  <Tables.Row>
                    {jwt?.level === "Super Admin" && (
                      <Tables.Data>
                        {detailPayroll?.company_name || "N/A"}
                      </Tables.Data>
                    )}
                    <Tables.Data>
                      {detailPayroll?.employee_first_name ||
                        "Nama tidak tersedia"}
                    </Tables.Data>
                    <Tables.Data>
                      {detailPayroll?.jabatan_pegawai || "-"}
                    </Tables.Data>
                    <Tables.Data>
                      {formatRupiah(detailPayroll?.basic_salary)}
                    </Tables.Data>
                    <Tables.Data>
                      <span className="text-green-600">
                        {formatRupiah(totalIncome)}
                      </span>
                    </Tables.Data>
                    <Tables.Data>
                      <span className="text-red-600">
                        {formatRupiah(totalDeduction)}
                      </span>
                    </Tables.Data>
                    <Tables.Data>
                      <span className="text-gray-800">
                        {formatRupiah(
                          detailPayroll?.basic_salary +
                            totalIncome -
                            totalDeduction
                        )}
                      </span>
                    </Tables.Data>
                  </Tables.Row>
                </Tables.Body>
              </Tables>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <IncomeComponent
              totalIncome={totalIncome}
              incomes={incomes}
              setIncomes={setIncomes}
              listOptionPendapatan={listOptionPendapatan}
            />
            <DeductionComponent
              totalDeduction={totalDeduction}
              deductions={deductions}
              setDeductions={setDeductions}
              listOptionPemotongan={listOptionPemotongan}
            />
          </div>

          <div className=" justify-between flex flex-row gap-3">
            <Button color="base" onClick={() => navigate(-1)}>
              Batal
            </Button>
            <Button
              onClick={() => formik.handleSubmit()}
              loading={getMasterGajiLoading}
            >
              Simpan
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FormPayrollGajiPage;
