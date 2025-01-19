import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "@/constants";
import { IoAdd, IoAddCircle, IoAddOutline, IoTrash } from "react-icons/io5";
import AsyncSelect from "react-select/async";
import SelectSync from "@/components/atoms/SelectSync";
import { AuthContext } from "@/context/AuthContext";
import { apiReducer } from "@/reducers/apiReducers";
import { jobdeskPegawaiReducer } from "@/reducers/jobdeskPegawaiReducers";
import axiosAPI from "@/authentication/axiosApi";

const recurrenceOptions = [
  { label: "Harian", value: "daily" },
  { label: "Mingguan", value: "weekly" },
  { label: "Bulanan", value: "monthly" },
  { label: "Tahunan", value: "yearly" },
];

const FormJobdeskPegawaiPage = () => {
  const { pk } = useParams();
  const { getJobdeskPegawaiLoading } = useSelector(
    (state) => state.jobdeskpegawai
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rerenderPegawai, setRerenderPegawai] = useState(true);

  const { jwt } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      perusahaan: null,
      employee: null,
      jobdesks: [
        {
          title: "",
          description: "",
          recurrence: "",
          date: "",
        },
      ],
    },
    onSubmit: (values, { setSubmitting }) => {
      // Validasi manual setiap field
      const errors = {};

      values.jobdesks.forEach((jobdesk, index) => {
        if (!jobdesk.title) {
          errors[`jobdesks.${index}.title`] = "Title is required";
        }
        if (!jobdesk.description) {
          errors[`jobdesks.${index}.description`] = "Deskripsi is required";
        }
        if (!jobdesk.recurrence) {
          errors[`jobdesks.${index}.recurrence`] = "Periode is required";
        }
        if (!jobdesk.date) {
          errors[`jobdesks.${index}.date`] = "Tanggal is required";
        }
      });

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
      formData.append("employee_doang", values.employee?.value);
      formData.append("jobdesks", JSON.stringify(values.jobdesks));

      try {
        if (pk) {
          const dekrip_id = decrypted_id(pk);
          updateFormData(
            { dispatch, redux: jobdeskPegawaiReducer },
            formData,
            API_URL_jobdesk,
            "UPDATE_JOBDESKPEGAWAI",
            dekrip_id
          );
        } else {
          addFormData(
            { dispatch, redux: jobdeskPegawaiReducer },
            formData,
            API_URL_jobdesk,
            "ADD_JOBDESKPEGAWAI"
          );
        }
        navigate(-1);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const addJobdesk = () => {
    formik.setFieldValue("jobdesks", [
      ...formik.values.jobdesks,
      { title: "", description: "", recurrence: "", date: "" },
    ]);
  };

  const removeJobdesk = (index) => {
    const newJobdesks = formik.values.jobdesks.filter((_, i) => i !== index);
    formik.setFieldValue("jobdesks", newJobdesks);
  };

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
        API_URL_datapegawaijobdesk + decrypted_id(pk)
      );
      const dataResponse = response.data;

      formik.setFieldValue("perusahaan", {
        label: dataResponse?.nama_perusahaan,
        value: dataResponse?.id_perusahaan,
      });
      formik.setFieldValue("employee", {
        label: dataResponse?.first_name,
        value: dataResponse?.id,
      });

      const mappedJobdesks = dataResponse?.jobdesk_details?.map((item) => ({
        title: item?.title,
        description: item?.description,
        recurrence: {
          value: item?.recurrence,
          label: item?.recurrence_display,
        },
        date: item?.date,
      }));

      formik.setFieldValue("jobdesks", mappedJobdesks);
    } else {
      navigate(-1);
    }
  }, [pk]);

  useEffect(() => {
    if (pk) {
      get();
    }
  }, [pk]);

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
              {formik.values.jobdesks.map((jobdesk, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-2 md:items-center"
                >
                  <div className="">
                    <TextField
                      label="Judul Pekerjaan"
                      type="text"
                      name={`jobdesks.${index}.title`}
                      value={jobdesk.title}
                      placeholder="Judul Pekerjaan"
                      onChange={formik.handleChange}
                    />
                    {formik.errors[`jobdesks.${index}.title`] && (
                      <div className="text-red-500 text-sm">
                        {formik.errors[`jobdesks.${index}.title`]}
                      </div>
                    )}
                  </div>
                  <div className="">
                    <TextField
                      label={`Deskripsi Pekerjaan`}
                      type="text"
                      name={`jobdesks.${index}.description`}
                      placeholder="Deskripsi Pekerjaan"
                      value={jobdesk.description}
                      onChange={formik.handleChange}
                    />
                    {formik.errors[`jobdesks.${index}.description`] && (
                      <div className="text-red-500 text-sm">
                        {formik.errors[`jobdesks.${index}.description`]}
                      </div>
                    )}
                  </div>

                  <div className="">
                    <Select
                      required
                      label="Periode Pengulangan Pekerjaan"
                      name={`jobdesks.${index}.recurrence`}
                      placeholder="Pilih periode perkerjaan"
                      onChange={(option) => {
                        formik.setFieldValue(
                          `jobdesks.${index}.recurrence`,
                          option
                        ); // Set nilai yang dipilih
                      }}
                      value={jobdesk.recurrence}
                      options={recurrenceOptions}
                      disabled={recurrenceOptions.length === 1}
                    />

                    {formik.errors[`jobdesks.${index}.recurrence`] && (
                      <div className="text-red-500 text-sm">
                        {formik.errors[`jobdesks.${index}.recurrence`]}
                      </div>
                    )}
                  </div>
                  <div className="">
                    <TextField
                      label={`Tanggal Awal Kegiatan`}
                      type="date"
                      name={`jobdesks.${index}.date`}
                      placeholder="Tanggal Awal Kegiatan"
                      value={jobdesk.date}
                      onChange={formik.handleChange}
                    />
                    {formik.errors[`jobdesks.${index}.date`] && (
                      <div className="text-red-500 text-sm">
                        {formik.errors[`jobdesks.${index}.date`]}
                      </div>
                    )}
                  </div>
                  <div className="">
                    <button
                      size="md"
                      type="button"
                      onClick={() => removeJobdesk(index)}
                    >
                      <IoTrash color="red" size={25} />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addJobdesk}
                className="mt-1 flex flex-row gap-1 items-center"
              >
                <IoAddCircle color="green" size={25} />
                <p>Tambah Jobdesk</p>
              </button>
            </div>
          </form>
          <div className=" justify-between flex flex-row gap-3">
            <Button color="base" onClick={() => navigate(-1)}>
              Batal
            </Button>
            <Button
              onClick={() => formik.handleSubmit()}
              loading={getJobdeskPegawaiLoading}
            >
              Simpan
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FormJobdeskPegawaiPage;
