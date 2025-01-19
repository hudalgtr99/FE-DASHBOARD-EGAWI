import React, { useCallback, useContext, useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, Select } from "@/components";
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
  API_URL_getdatapegawaiall,
  API_URL_getdataperusahaanall,
  API_URL_jobdesk,
  API_URL_salary,
} from "@/constants";
import { IoAdd, IoAddCircle, IoAddOutline, IoTrash } from "react-icons/io5";
import AsyncSelect from "react-select/async";
import SelectSync from "@/components/atoms/SelectSync";
import { AuthContext } from "@/context/AuthContext";
import { apiReducer } from "@/reducers/apiReducers";
import { jobdeskPegawaiReducer } from "@/reducers/jobdeskPegawaiReducers";
import axiosAPI from "@/authentication/axiosApi";
import { masterGajiReducer } from "@/reducers/masterGajiReducers";
import CurrencyInput from "@/components/atoms/CurrencyInput";
import * as Yup from "yup";

const recurrenceOptions = [
  { label: "Harian", value: "daily" },
  { label: "Mingguan", value: "weekly" },
  { label: "Bulanan", value: "monthly" },
  { label: "Tahunan", value: "yearly" },
];

const FormMasterGajiPage = () => {
  const { pk } = useParams();
  const { getMasterGajiLoading } = useSelector((state) => state.mastergaji);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rerenderPegawai, setRerenderPegawai] = useState(true);

  const { jwt } = useContext(AuthContext);

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
      const response = await axiosAPI.get(API_URL_salary + decrypted_id(pk));
      const dataResponse = response.data;

      formik.setFieldValue("perusahaan", {
        label: dataResponse?.nama_perusahaan,
        value: dataResponse?.id_perusahaan,
      });
      formik.setFieldValue("employee", {
        label: dataResponse?.employee_name,
        value: dataResponse?.employee_id,
      });

      formik.setFieldValue("amount", dataResponse?.amount);
    } else {
      navigate(-1);
    }
  }, [pk]);

  useEffect(() => {
    if (pk) {
      get();
    }
  }, [pk]);

  console.log(formik.values);

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
          <h1>
            {pk ? "Edit Data Jobdesk Pegawai" : "Tambah Data Jobdesk Pegawai"}
          </h1>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-6 mb-4"
          >
            <div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
              {/* jika isSuperAdmin  */}
              {jwt?.level === "Super Admin" && (
                <>
                  <SelectSync
                    className="w-full md:w-[50%]"
                    required={true}
                    label={"Perusahaan"}
                    url={API_URL_getdataperusahaanall}
                    fieldName={"nama"}
                    setSelect={(e) => formik.setFieldValue("perusahaan", e)}
                    select={formik.values.perusahaan}
                    error={
                      formik.touched.perusahaan &&
                      formik.errors.perusahaan &&
                      formik.errors.perusahaan
                    }
                  />
                  {rerenderPegawai && formik.values.perusahaan?.value && (
                    <SelectSync
                      className="w-full md:w-[50%]"
                      required={true}
                      label={"Pegawai"}
                      url={API_URL_getdatapegawaiall}
                      fieldName={"first_name"}
                      setSelect={(e) => formik.setFieldValue("employee", e)}
                      select={formik.values.employee}
                      error={
                        formik.touched.employee &&
                        formik.errors.employee &&
                        formik.errors.employee
                      }
                      addParams={
                        formik.values.perusahaan?.value
                          ? `&perusahaan=${encodeURL(
                              encrypted(formik.values.perusahaan.value)
                            )}`
                          : ""
                      }
                    />
                  )}
                </>
              )}

              {/* Jika Bukan Super Admin  */}
              {jwt?.level !== "Super Admin" && (
                <SelectSync
                  className="w-full"
                  required={true}
                  label={"Pegawai"}
                  url={API_URL_getdatapegawaiall}
                  fieldName={"first_name"}
                  setSelect={(e) => formik.setFieldValue("employee", e)}
                  select={formik.values.employee}
                  error={
                    formik.touched.employee &&
                    formik.errors.employee &&
                    formik.errors.employee
                  }
                  addParams={
                    formik.values.perusahaan?.value
                      ? `&perusahaan=${encodeURL(
                          encrypted(formik.values.perusahaan.value)
                        )}`
                      : ""
                  }
                />
              )}
            </div>
            <div className="">
              <div className="">
                <CurrencyInput
                  label={"Gaji"}
                  name="amount"
                  value={formik.values.amount}
                  onChange={(e) => {
                    formik.setFieldValue("amount", e);
                  }}
                />

                {formik.errors.amount && formik.touched.amount && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.amount}
                  </div>
                )}
              </div>
            </div>
          </form>
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

export default FormMasterGajiPage;
