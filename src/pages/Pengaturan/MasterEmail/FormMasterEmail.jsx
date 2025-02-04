import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, Radio, TextField } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { addFormData, decrypted_id, updateFormData } from "@/actions";
import { API_URL_masteremail } from "@/constants";
import { AuthContext } from "@/context/AuthContext";
import axiosAPI from "@/authentication/axiosApi";
import * as Yup from "yup";
import { masterEmailReducer } from "@/reducers/masterEmailReducers";

const FormMasterEmailPage = () => {
  const { pk } = useParams();
  const { getMasterEmailLoading } = useSelector((state) => state.masteremail);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rerenderPegawai, setRerenderPegawai] = useState(true);

  const { jwt } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      perusahaan: null,
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      host: "",
      port: "",
      status: "",
      use_tls: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("nama wajib diisi"),
      email: Yup.string().required("Email wajib diisi"),
      host: Yup.string().required("Host wajib diisi"),
      port: Yup.string().required("Port wajib diisi"),
      status: Yup.string().required("Status wajib diisi"),
      use_tls: Yup.string().required("Use Tls wajib diisi"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      // Validasi manual setiap field
      const errors = {};

      if (values.password === "" && !pk) {
        errors.password = "Password is required";
      }

      if (Object.keys(errors).length > 0) {
        console.log(errors);
        formik.setErrors(errors);
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("host", values.host);
      formData.append("port", values.port);
      formData.append("status", values.status);
      formData.append("use_tls", values.use_tls);

      if (values.password) {
        formData.append("password", values.password);
      }

      try {
        if (pk) {
          const dekrip_id = decrypted_id(pk);
          updateFormData(
            { dispatch, redux: masterEmailReducer },
            formData,
            API_URL_masteremail,
            "UPDATE_MASTEREMAIL",
            dekrip_id + "/"
          );
        } else {
          addFormData(
            { dispatch, redux: masterEmailReducer },
            formData,
            API_URL_masteremail,
            "ADD_MASTEREMAIL"
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
        API_URL_masteremail + decrypted_id(pk) + "/"
      );
      const dataResponse = response.data;

      formik.setFieldValue("name", dataResponse?.name);
      formik.setFieldValue("email", dataResponse?.email);
      formik.setFieldValue("host", dataResponse?.host);
      formik.setFieldValue("port", dataResponse?.port);
      formik.setFieldValue("status", dataResponse?.status);
      formik.setFieldValue("use_tls", dataResponse?.use_tls);
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
          <h1>{pk ? "Edit Data Master Email" : "Tambah Data Master Email"}</h1>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-6 mb-4"
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-full md:col-span-6">
                <TextField
                  label={"Name"}
                  name="name"
                  required
                  value={formik.values.name}
                  onChange={(e) => {
                    formik.setFieldValue("name", e.target?.value);
                  }}
                  placeholder="Nama Email"
                />

                {formik.errors.name && formik.touched.name && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.name}
                  </div>
                )}
              </div>

              <div className="col-span-full md:col-span-6">
                <TextField
                  label={"Email"}
                  name="email"
                  required
                  value={formik.values.email}
                  onChange={(e) => {
                    formik.setFieldValue("email", e.target.value);
                  }}
                  placeholder="Email"
                />

                {formik.errors.email && formik.touched.email && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <div className="col-span-full md:col-span-6">
                <TextField
                  label={"Password"}
                  name="password"
                  required={pk ? false : true}
                  value={formik.values.password}
                  onChange={(e) => {
                    formik.setFieldValue("password", e.target.value);
                  }}
                  placeholder="Password"
                />

                {formik.errors.password && formik.touched.password && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              <div className="col-span-full md:col-span-6">
                {formik.values.password != "" && (
                  <>
                    <TextField
                      label={"Konfirmasi Password"}
                      name="confirm_password"
                      required
                      value={formik.values.confirm_password}
                      onChange={(e) => {
                        formik.setFieldValue(
                          "confirm_password",
                          e.target.value
                        );
                      }}
                      placeholder="Konfirmasi password"
                    />

                    {formik.errors.confirm_password &&
                      formik.touched.confirm_password && (
                        <div className="text-red-500 text-sm">
                          {formik.errors.confirm_password}
                        </div>
                      )}
                  </>
                )}
              </div>

              <div className="col-span-full md:col-span-3">
                <TextField
                  label={"Host"}
                  name="host"
                  required
                  value={formik.values.host}
                  onChange={(e) => {
                    formik.setFieldValue("host", e.target.value);
                  }}
                  placeholder="Host"
                />

                {formik.errors.host && formik.touched.host && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.host}
                  </div>
                )}
              </div>

              <div className="col-span-full md:col-span-3">
                <TextField
                  label={"Port"}
                  required
                  name="port"
                  value={formik.values.port}
                  onChange={(e) => {
                    formik.setFieldValue("port", e.target.value);
                  }}
                  placeholder="port"
                />

                {formik.errors.port && formik.touched.port && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.port}
                  </div>
                )}
              </div>

              <div className="col-span-full md:col-span-3">
                <div>
                  <label className="text-sm">
                    Use TLS <span className="text-red-500">*</span>
                  </label>
                </div>
                <Radio
                  value={formik.values.use_tls}
                  onChange={(e) => {
                    formik.setFieldValue("use_tls", e);
                  }}
                  options={[
                    {
                      label: "Iya",
                      value: 1,
                    },
                    {
                      label: "Tidak",
                      value: 0,
                    },
                  ]}
                />
                {formik.errors.use_tls && formik.touched.use_tls && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.use_tls}
                  </div>
                )}
              </div>

              <div className="col-span-full md:col-span-3">
                <div>
                  <label className="text-sm">
                    Status <span className="text-red-500">*</span>
                  </label>
                </div>
                <Radio
                  value={formik.values.status}
                  onChange={(e) => {
                    formik.setFieldValue("status", e);
                  }}
                  options={[
                    {
                      label: "Active",
                      value: "Y",
                    },
                    {
                      label: "Not Active",
                      value: "N",
                    },
                  ]}
                />
                {formik.errors.status && formik.touched.status && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.status}
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
              loading={getMasterEmailLoading}
            >
              Simpan
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FormMasterEmailPage;
