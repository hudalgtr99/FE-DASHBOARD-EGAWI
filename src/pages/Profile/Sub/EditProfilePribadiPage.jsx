import { isAuthenticated } from "@/authentication/authenticationApi";
import { Button, Container, TextField, Select } from "@/components";
import { updateData, handleInputError } from "@/actions";
import { API_URL_edeluser, API_URL_getcabang } from "@/constants";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { pegawaiReducer } from "@/reducers/kepegawaianReducers";
import { useFormik } from "formik";
import { IoMdReturnLeft } from "react-icons/io";
import * as Yup from "yup";
import axiosAPI from "@/authentication/axiosApi";

const EditProfilePribadiPage = () => {
  const { addPegawaiResult, addPegawaiLoading } = useSelector(
    (state) => state.kepegawaian
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [cabangOptions, setCabangOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosAPI.get(API_URL_getcabang);
      setCabangOptions(response.data.map((item) => ({
        value: item.pk,
        label: item.nama,
      })));
    };

    fetchData();
  }, []);

  const handleInputError = (values) => {
    // Validate values and handle errors as needed
    // Example logic, replace with your own
    if (!values || typeof values !== 'object') {
      console.error("Invalid input values:", values);
      return {}; // Return an empty object or handle as needed
    }

    // Your processing logic here
    const processedValues = Object.entries(values).map(([key, value]) => {
      return { key, value }; // Adjust according to your needs
    });

    return processedValues; // Ensure you return a defined value
  };

  // Check if location.state and location.state.data exist, fallback to empty object if not
  const initialData = location.state?.data;

  // console.log(initialData)

  const formik = useFormik({
    initialValues: {
      nama: initialData.nama || "",
      username: initialData.username || "",
      email: initialData.email || "",
      no_identitas: initialData.no_identitas || "",
      jenis_kelamin: initialData.jenis_kelamin || "",
      no_telepon: initialData.no_telepon || "",
      tempat_lahir: initialData.tempat_lahir || "",
      tgl_lahir: initialData.tgl_lahir || "",
      agama: initialData.agama || "",
      npwp: initialData.npwp || "",
      alamat_ktp: initialData.alamat_ktp || "",
      alamat_domisili: initialData.alamat_domisili || "",
      cabang_id: initialData.cabang.id || "",
    },
    validationSchema: Yup.object({
      nama: Yup.string().required("Nama is required"),
      username: Yup.string().required("Username is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      no_identitas: Yup.string().required("No Identitas is required"),
      jenis_kelamin: Yup.string().required("Jenis Kelamin is required"),
      no_telepon: Yup.string().required("No Telepon is required"),
      tempat_lahir: Yup.string().required("Tempat Lahir is required"),
      tgl_lahir: Yup.date().required("Tanggal Lahir is required"),
      agama: Yup.string().required("Agama is required"),
      npwp: Yup.string().required("NPWP is required"),
      alamat_ktp: Yup.string().required("Alamat KTP is required"),
      alamat_domisili: Yup.string().required("Alamat Domisili is required"),
      cabang_id: Yup.string().required("Cabang is required"),
    }),
    onSubmit: (values) => {
      const newInput = handleInputError(values);
      console.log("New Input:", newInput); // Check this output

      if (isAuthenticated().user_id) {
        updateData(
          { dispatch, redux: pegawaiReducer },
          {
            pk: "datapribadi",
            user_id: isAuthenticated().user_id,
            ...newInput,
          },
          API_URL_edeluser,
          "ADD_PEGAWAI"
        );
      }
    },
  });

  useEffect(() => {
    if (addPegawaiResult) {
      dispatch(
        pegawaiReducer({
          type: "ADD_PEGAWAI",
          payload: {
            loading: false,
            data: false,
          },
        })
      );
      navigate("/profil");
    }
  }, [addPegawaiResult, dispatch, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate(-1)} // Go back to the previous page
          >
            <IoMdReturnLeft />
          </button>
          <h1>Edit Data Pribadi</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className="sm:grid sm:grid-cols-2 sm:gap-4 max-[640px]:space-y-4">
          <TextField
            required
            label="Nama"
            name="nama"
            value={formik.values.nama}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nama && formik.errors.nama}
          />
          <TextField
            required
            label="Username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && formik.errors.username}
          />
          <TextField
            required
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
          />
          <TextField
            required
            label="No Identitas"
            name="no_identitas"
            value={formik.values.no_identitas}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.no_identitas && formik.errors.no_identitas}
          />
          <Select
            required
            label="Jenis Kelamin"
            name="jenis_kelamin"
            value={formik.values.jenis_kelamin ? { value: formik.values.jenis_kelamin, label: formik.values.jenis_kelamin } : null}
            onChange={(option) => formik.setFieldValue('jenis_kelamin', option ? option.value : '')}
            options={[
              { value: 'Laki Laki', label: 'Laki Laki' },
              { value: 'Perempuan', label: 'Perempuan' },
            ]}
            error={formik.touched.jenis_kelamin && formik.errors.jenis_kelamin}
          />
          <TextField
            required
            label="No Telepon"
            name="no_telepon"
            value={formik.values.no_telepon}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.no_telepon && formik.errors.no_telepon}
          />
          <TextField
            required
            label="Tempat Lahir"
            name="tempat_lahir"
            value={formik.values.tempat_lahir}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.tempat_lahir && formik.errors.tempat_lahir}
          />
          <TextField
            required
            label="Tanggal Lahir"
            name="tgl_lahir"
            type="date"
            value={formik.values.tgl_lahir}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.tgl_lahir && formik.errors.tgl_lahir}
          />
          <Select
            required
            label="Agama"
            name="agama"
            value={formik.values.agama ? { value: formik.values.agama, label: formik.values.agama } : null}
            onChange={(option) => formik.setFieldValue('agama', option ? option.value : '')}
            options={[
              { label: "Islam", value: "Islam" },
              { label: "Protestan", value: "Protestan" },
              { label: "Katolik", value: "Katolik" },
              { label: "Hindu", value: "Hindu" },
              { label: "Buddha", value: "Buddha" },
              { label: "Khonghucu", value: "Khonghucu" },
            ]}
            error={formik.touched.agama && formik.errors.agama}
          />
          <TextField
            required
            label="NPWP"
            name="npwp"
            value={formik.values.npwp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.npwp && formik.errors.npwp}
          />
          <TextField
            required
            label="Alamat KTP"
            name="alamat_ktp"
            value={formik.values.alamat_ktp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.alamat_ktp && formik.errors.alamat_ktp}
          />
          <TextField
            required
            label="Alamat Domisili"
            name="alamat_domisili"
            value={formik.values.alamat_domisili}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.alamat_domisili && formik.errors.alamat_domisili}
          />
          <Select
            required
            label="Cabang ID"
            name="cabang_id"
            value={cabangOptions.find(option => option.value === formik.values.cabang_id) || null}
            onChange={(option) => formik.setFieldValue('cabang_id', option ? option.value : '')}
            options={cabangOptions}
            error={formik.touched.cabang_id && formik.errors.cabang_id}
          />
          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={addPegawaiLoading}>
              Simpan
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default EditProfilePribadiPage;
