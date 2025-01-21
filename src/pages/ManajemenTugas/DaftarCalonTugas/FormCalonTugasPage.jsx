import React, { useCallback, useContext, useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextArea, TextField } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import {
  addFormData,
  decrypted_id,
  encodeURL,
  encrypted,
  encrypted_id,
  updateFormData,
} from "@/actions";
import {
  API_URL_delegation,
  API_URL_getdatapegawaiall,
  API_URL_getdataperusahaanall,
  API_URL_salary,
} from "@/constants";
import SelectSync from "@/components/atoms/SelectSync";
import { AuthContext } from "@/context/AuthContext";
import axiosAPI from "@/authentication/axiosApi";
import { masterGajiReducer } from "@/reducers/masterGajiReducers";
import CurrencyInput from "@/components/atoms/CurrencyInput";
import * as Yup from "yup";
import { delegationReducer } from "@/reducers/delegationReducers";

const FormCalonTugasPage = () => {
  const { pk } = useParams();
  const { getDelegationLoading } = useSelector((state) => state.delegation);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rerenderPegawai, setRerenderPegawai] = useState(true);

  const { jwt } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      perusahaan: null,
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      // Validasi manual setiap field
      const errors = {};
      if (Object.keys(errors).length > 0) {
        console.log(errors);
        formik.setErrors(errors);
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      //   formData.append("employee", encrypted_id(values.employee?.value));
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("type", "eksternal");

      try {
        if (pk) {
          const dekrip_id = decrypted_id(pk);
          updateFormData(
            { dispatch, redux: delegationReducer },
            formData,
            API_URL_delegation,
            "UPDATE_DELEGATION",
            dekrip_id
          );
        } else {
          addFormData(
            { dispatch, redux: delegationReducer },
            formData,
            API_URL_delegation,
            "ADD_DELEGATION"
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
        API_URL_delegation + decrypted_id(pk)
      );
      const dataResponse = response.data;
      formik.setFieldValue("perusahaan", {
        label: dataResponse?.company_name,
        value: dataResponse?.company_id,
      });
      formik.setFieldValue("title", dataResponse?.title);
      formik.setFieldValue("description", dataResponse?.description);
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
          <h1>{pk ? "Edit Data Calon Tugas" : "Tambah Data Calon Tugas"}</h1>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-6 mb-4"
          >
            <div className="">
              <TextField
                label="Judul Calon Tugas"
                name="title"
                placeholder="Judul"
                value={formik.values.title}
                onChange={formik.handleChange}
              />
              {formik.errors.title && formik.touched.title && (
                <div className="text-red-500 text-sm">
                  {formik.errors.title}
                </div>
              )}
            </div>
            <div className="">
              <TextArea
                label="Deskripsi"
                name="description"
                placeholder="Deskripsi"
                value={formik.values.description}
                onChange={formik.handleChange}
                rows={3}
              />
              {formik.errors.description && formik.touched.description && (
                <div className="text-red-500 text-sm">
                  {formik.errors.description}
                </div>
              )}
            </div>
          </form>
          <div className=" justify-between flex flex-row gap-3">
            <Button color="base" onClick={() => navigate(-1)}>
              Batal
            </Button>
            <Button
              onClick={() => formik.handleSubmit()}
              loading={getDelegationLoading}
            >
              Simpan
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FormCalonTugasPage;
