import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, TextArea, Select } from "@/components";
import { useDispatch } from "react-redux";
import { addData, updateData } from "@/actions";
import { pegawaiReducer } from "@/reducers/kepegawaianReducers";
import {
  API_URL_createuser,
  API_URL_edeluser,
  API_URL_getperusahaan,
  API_URL_getlokasiabsen,
} from "@/constants";
import axiosAPI from "@/authentication/axiosApi";

const Pribadi = ({ onTabChange }) => {
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [perusahaanOptions, setPerusahaanOptions] = useState([]);
  const [lokasiOptions, setLokasiOptions] = useState([]);
  const [userId, setUserid] = useState("");

  const isEdit = pk && pk !== "add";

  // Retrieve user data from localStorage if not present in state
  const initialValuesFromLocalStorage = () => {
    const storedData = localStorage.getItem("editUserData");
    if (storedData) {
      return JSON.parse(storedData).datapribadi;
    }
    return {
      user_id: "",
      nama: "",
      username: "",
      email: "",
      password: "", // Add password field here
      pangkat_id: "",
      no_identitas: "",
      jenis_kelamin: "",
      no_telepon: "",
      tempat_lahir: "",
      tgl_lahir: "",
      agama: "",
      npwp: "",
      alamat_ktp: "",
      alamat_domisili: "",
      perusahaan_id: "",
      lokasi_absen: "",
    };
  };

  const formik = useFormik({
    initialValues: initialValuesFromLocalStorage(),
    validationSchema: Yup.object({
      // Add your validation schema here
    }),
    onSubmit: async (values) => {
      try {
        const updatedValues = {
          ...values,
          lokasi_absen_id: values.lokasi_absen.value,
        };

        // console.log("updatedValues:", updatedValues);

        // Remove password from payload during edit
        if (isEdit) {
          delete updatedValues.password;
          await updateData(
            { dispatch, redux: pegawaiReducer },
            { pk: "datapribadi", ...updatedValues },
            API_URL_edeluser,
            "UPDATE_PEGAWAI"
          );
        } else {
          // Handle create, including password in the payload
          const data = await addData(
            { dispatch, redux: pegawaiReducer },
            updatedValues,
            API_URL_createuser,
            "ADD_PEGAWAI"
          );

          setUserid(data.user_id);
          const storedData = localStorage.getItem("editUserData");
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            parsedData.datapribadi = { ...parsedData.datapribadi, ...values };
            parsedData.datapribadi.user_id = data.user_id;
            localStorage.setItem("editUserData", JSON.stringify(parsedData));
          }
        }

        navigate("/kepegawaian/pegawai");
      } catch (error) {
        console.error("Error in form submission: ", error);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosAPI.get(API_URL_getperusahaan);
      setPerusahaanOptions(
        response.data.map((item) => ({
          value: item.pk,
          label: item.nama,
        }))
      );
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosAPI.get(API_URL_getlokasiabsen);
      setLokasiOptions(
        response.data.map((item) => ({
          value: item.id,
          label: item.nama_lokasi,
        }))
      );
    };

    fetchData();
  }, []);

  const handleLanjut = () => {
    formik.handleSubmit();

    const storedData = localStorage.getItem("editUserData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      localStorage.setItem("editUserData", JSON.stringify(parsedData));
    }

    onTabChange("1");
  };

  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate("/kepegawaian/pegawai")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>{isEdit ? "Edit Data Pribadi" : "Tambah Data Pribadi"}</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
              <TextField
                required
                label="Nama"
                name="nama"
                value={formik.values.nama}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nama ? formik.errors.nama : ""}
              />
              <TextField
                required
                label="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={(e) => formik.handleBlur}
                error={formik.touched.username ? formik.errors.username : ""}
              />
              <TextField
                required
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={(e) => formik.handleBlur}
                error={formik.touched.email ? formik.errors.email : ""}
              />
            </div>
            <div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
              <TextField
                required
                label="No Identitas"
                name="no_identitas"
                value={formik.values.no_identitas}
                onChange={formik.handleChange}
                onBlur={(e) => formik.handleBlur}
                error={
                  formik.touched.no_identitas ? formik.errors.no_identitas : ""
                }
              />
              <Select
                required
                label="Jenis Kelamin"
                name="jenis_kelamin"
                value={
                  formik.values.jenis_kelamin
                    ? {
                        value: formik.values.jenis_kelamin,
                        label: formik.values.jenis_kelamin,
                      }
                    : null
                }
                onChange={(option) =>
                  formik.setFieldValue(
                    "jenis_kelamin",
                    option ? option.value : ""
                  )
                }
                options={[
                  { value: "Laki Laki", label: "Laki Laki" },
                  { value: "Perempuan", label: "Perempuan" },
                ]}
                error={
                  formik.touched.jenis_kelamin
                    ? formik.errors.jenis_kelamin
                    : ""
                }
              />
              <TextField
                required
                label="No Telepon"
                name="no_telepon"
                value={formik.values.no_telepon}
                onChange={formik.handleChange}
                onBlur={(e) => formik.handleBlur}
                error={
                  formik.touched.no_telepon ? formik.errors.no_telepon : ""
                }
              />
            </div>
            <div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
              <TextField
                required
                label="Tempat Lahir"
                name="tempat_lahir"
                value={formik.values.tempat_lahir}
                onChange={formik.handleChange}
                onBlur={(e) => formik.handleBlur}
                error={
                  formik.touched.tempat_lahir ? formik.errors.tempat_lahir : ""
                }
              />
              <TextField
                required
                label="Tanggal Lahir"
                name="tgl_lahir"
                type="date"
                value={formik.values.tgl_lahir}
                onChange={formik.handleChange}
                onBlur={(e) => formik.handleBlur}
                error={formik.touched.tgl_lahir ? formik.errors.tgl_lahir : ""}
              />
              <Select
                required
                label="Agama"
                name="agama"
                value={
                  formik.values.agama
                    ? { value: formik.values.agama, label: formik.values.agama }
                    : null
                }
                onChange={(option) =>
                  formik.setFieldValue("agama", option ? option.value : "")
                }
                options={[
                  { value: "Islam", label: "Islam" },
                  { value: "Kristen", label: "Kristen" },
                  { value: "Hindu", label: "Hindu" },
                  { value: "Buddha", label: "Buddha" },
                  { value: "Konghucu", label: "Konghucu" },
                ]}
                error={formik.touched.agama ? formik.errors.agama : ""}
              />
            </div>
            <div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
              <TextField
                label="Alamat KTP"
                name="alamat_ktp"
                value={formik.values.alamat_ktp}
                onChange={formik.handleChange}
                onBlur={(e) => formik.handleBlur}
                error={
                  formik.touched.alamat_ktp ? formik.errors.alamat_ktp : ""
                }
              />
              <TextField
                label="Alamat Domisili"
                name="alamat_domisili"
                value={formik.values.alamat_domisili}
                onChange={formik.handleChange}
                onBlur={(e) => formik.handleBlur}
                error={
                  formik.touched.alamat_domisili
                    ? formik.errors.alamat_domisili
                    : ""
                }
              />
              <TextField
                label="NPWP"
                name="npwp"
                value={formik.values.npwp}
                onChange={formik.handleChange}
                onBlur={(e) => formik.handleBlur}
                error={formik.touched.npwp ? formik.errors.npwp : ""}
              />
            </div>
            <div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
              <TextField
                label="NPWP"
                name="npwp"
                value={formik.values.npwp}
                onChange={formik.handleChange}
                onBlur={(e) => formik.handleBlur}
                error={formik.touched.npwp ? formik.errors.npwp : ""}
              />
              <Select
                required
                label="Perusahaan"
                name="perusahaan_id"
                value={
                  perusahaanOptions.find(
                    (option) =>
                      option.value === formik.values.perusahaan.id ||
                      formik.values.perusahaan_id
                  ) || null
                }
                onChange={(option) =>
                  formik.setFieldValue(
                    "perusahaan_id",
                    option ? option.value : ""
                  )
                }
                options={perusahaanOptions}
                error={
                  formik.touched.perusahaan_id
                    ? formik.errors.perusahaan_id
                    : ""
                }
              />
            </div>
            <div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
              <Select
                required
                label="Lokasi Absen"
                name="lokasi_absen"
                value={
                  lokasiOptions.find(
                    (option) =>
                      option.value === formik.values.lokasi_absen.value
                  ) || null
                }
                onChange={(option) =>
                  formik.setFieldValue("lokasi_absen", option ? option : "")
                } // Mengambil value dari option yang dipilih
                options={lokasiOptions} // Opsi lokasi absen diambil dari lokasiOptions
                error={
                  formik.touched.lokasi_absen ? formik.errors.lokasi_absen : ""
                }
              />
              {!isEdit && (
                <TextField
                  required
                  label="Password"
                  name="password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password ? formik.errors.password : ""}
                />
              )}
            </div>
            <div className="justify-end flex gap-3">
              {isEdit && <Button type="submit">Simpan</Button>}
              <Button type="button" onClick={handleLanjut}>
                Simpan dan lanjut
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Pribadi;
