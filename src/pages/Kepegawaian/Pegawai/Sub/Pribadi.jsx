import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, TextArea, Select } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { addData, updateData } from "@/actions";
import { pegawaiReducer } from "@/reducers/kepegawaianReducers";
import {
  API_URL_createuser,
  API_URL_edeluser,
  API_URL_getperusahaan,
  API_URL_getlokasiabsen,
  API_URL_getroles,
} from "@/constants";
import axiosAPI from "@/authentication/axiosApi";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";

const Pribadi = ({ onTabChange }) => {
  const { pk } = useParams();
  const { addPegawaiResult, addPegawaiLoading } = useSelector(
    (state) => state.kepegawaian
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [perusahaanOptions, setPerusahaanOptions] = useState([]);
  const [isLanjut, setIsLanjut] = useState(false);
  const [lokasiOptions, setLokasiOptions] = useState([]);
  const [userId, setUserid] = useState("");
  const [roles, setRoles] = useState([]);

  const [jwt, setJwt] = useState({}); // Initialize jwt variable

  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, []);

  // console.log(JSON.stringify(jwt));

  // Retrieve user data from localStorage if not present in state
  const initialValuesFromLocalStorage = () => {
    const storedData = localStorage.getItem("editUserData");
    if (storedData) {
      return JSON.parse(storedData).datapribadi;
    }
    return {
      user_id: "",
      nama: "",
      email: "",
      password: "",
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
      perusahaan: "",
      lokasi_absen: [],
      groups: "",
    };
  };

  const formik = useFormik({
    initialValues: initialValuesFromLocalStorage(),
    validationSchema: Yup.object().shape({
      nama: Yup.string()
        .required("Nama wajib diisi")
        .max(255, "Nama harus kurang dari 255 karakter"),
      email: Yup.string()
        .required("Email wajib diisi")
        .email("Email tidak valid"),
      no_identitas: Yup.number()
        .required("No Identitas wajib diisi")
        .min(16, "No Identitas harus lebih dari 15 karakter"),
      jenis_kelamin: Yup.string().required("Jenis Kelamin wajib diisi"),
      no_telepon: Yup.string()
        .required("Nomor telepon wajib diisi")
        .matches(/^[0-9]+$/, "Nomor telepon hanya boleh mengandung angka")
        .min(11, "Nomor telepon harus lebih dari 10 karakter")
        .max(13, "Nomor telepon harus kurang dari 14 karakter"),
      tgl_lahir: Yup.date().required("Tanggal Lahir wajib diisi"),
      agama: Yup.string().required("Agama wajib diisi"),
      perusahaan: Yup.object().required("Perusahaan wajib diisi"),
      // lokasi_absen: Yup.object().required("Aokasi Absen wajib diisi"),
      lokasi_absen: Yup.array()
        .min(1, "Lokasi absen wajib dipilih") // Minimal 1 lokasi harus dipilih
        .of(
          Yup.object().shape({
            value: Yup.string().required("Value harus ada"),
            label: Yup.string().required("Label harus ada"),
          })
        ),
      // roles: Yup.object().required("Roles wajib diisi"),
    }),
    onSubmit: async (values) => {
      try {
        const updatedValues = {
          ...values,
          lokasi_absen_ids: JSON.stringify(
            values.lokasi_absen.map((option) => option.value)
          ),
          groups: values.groups.value || values.groups.pk,
          perusahaan_id: values.perusahaan.id || values.perusahaan.value,
        };

        if (sessionStorage.getItem("isEdit") === "true") {
          delete updatedValues.password;

          const data = await updateData(
            { dispatch, redux: pegawaiReducer },
            { pk: "datapribadi", ...updatedValues },
            API_URL_edeluser,
            "ADD_PEGAWAI"
          );

          if (data && !addPegawaiLoading) {
            // Update localStorage with the updated values
            const storedData = localStorage.getItem("editUserData");
            if (storedData) {
              const parsedData = JSON.parse(storedData);
              parsedData.datapribadi = { ...parsedData.datapribadi, ...values };
              parsedData.datapribadi.user_id = data.user_id;
              localStorage.setItem("editUserData", JSON.stringify(parsedData));
            }

            isLanjut
              ? onTabChange("1")
              : (sessionStorage.getItem("url")
                  ? (navigate(sessionStorage.getItem("url"), {
                      state: {
                        activeTab: ["0", "1"].includes(
                          sessionStorage.getItem("activeTab")
                        )
                          ? sessionStorage.getItem("activeTab")
                          : "0",
                      },
                    }),
                    sessionStorage.removeItem("url"),
                    sessionStorage.removeItem("activeTab"),
                    sessionStorage.removeItem("activeTab"))
                  : navigate("/kepegawaian/pegawai"),
                localStorage.removeItem("editUserData"));
          }
        } else {
          const data = await addData(
            { dispatch, redux: pegawaiReducer },
            updatedValues,
            API_URL_createuser,
            "ADD_PEGAWAI"
          );

          if (data && !addPegawaiLoading) {
            setUserid(data.user_id);
            const storedData = localStorage.getItem("editUserData");
            if (storedData) {
              const parsedData = JSON.parse(storedData);
              parsedData.datapribadi = { ...parsedData.datapribadi, ...values };
              parsedData.datapribadi.user_id = data.user_id;
              localStorage.setItem("editUserData", JSON.stringify(parsedData));
            }

            if (isLanjut) {
              sessionStorage.setItem("Pribadi", true);
              sessionStorage.setItem("Pegawai", true);
            }

            isLanjut
              ? onTabChange("1")
              : (sessionStorage.getItem("url")
                  ? (navigate(sessionStorage.getItem("url"), {
                      state: {
                        activeTab: ["0", "1"].includes(
                          sessionStorage.getItem("activeTab")
                        )
                          ? sessionStorage.getItem("activeTab")
                          : "0",
                      },
                    }),
                    sessionStorage.removeItem("url"),
                    sessionStorage.removeItem("activeTab"))
                  : navigate("/akun"),
                localStorage.removeItem("editUserData"));
          }
        }
      } catch (error) {
        // console.error("Error in form submission: ", error);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosAPI.get(API_URL_getperusahaan);
      const options = response.data.map((item) => ({
        value: item.pk,
        label: item.nama,
      }));

      setPerusahaanOptions(options);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosAPI.get(API_URL_getroles);
      let roles2 = {};
      setRoles(
        response.data.map((item) => ({
          value: item.pk,
          label: item.name,
        }))
      );

      roles2 = response.data.map((item) => ({
        pk: item.pk,
        name: item.name,
      }));

      const storedData = localStorage.getItem("editUserData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Object.keys(parsedData.datapribadi.groups).length === 0) {
          parsedData.datapribadi.groups = roles2.find(
            (roles) => roles.name === "Pegawai"
          );
          localStorage.setItem("editUserData", JSON.stringify(parsedData));
        }
      }
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
    try {
      setIsLanjut(true);
      formik.handleSubmit();
      if (formik.isValid) {
        const storedData = localStorage.getItem("editUserData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          localStorage.setItem("editUserData", JSON.stringify(parsedData));
        }
      }
    } catch (error) {
      console.error("Error in form submission: ", error);
    }
  };

  // console.log(formik.values.lokasi_absen)

  // console.log("roles", JSON.stringify(roles));
  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => (
              sessionStorage.getItem("url")
                ? (navigate(sessionStorage.getItem("url"), {
                    state: {
                      activeTab: ["0", "1"].includes(
                        sessionStorage.getItem("activeTab")
                      )
                        ? sessionStorage.getItem("activeTab")
                        : "0",
                    },
                  }),
                  sessionStorage.removeItem("url"),
                  sessionStorage.removeItem("activeTab"))
                : navigate("/kepegawaian/pegawai"),
              localStorage.removeItem("editUserData")
            )}
          >
            <IoMdReturnLeft />
          </button>
          <h1>
            {sessionStorage.getItem("isEdit") === "true"
              ? "Edit Data Pribadi"
              : "Tambah Data Pribadi"}
          </h1>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLanjut();
            }}
            className="space-y-6"
          >
            <div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
              <Select
                required
                label="Perusahaan"
                name="perusahaan_id"
                value={
                  perusahaanOptions.find(
                    (option) =>
                      option.value === formik.values.perusahaan.value ||
                      option.value === formik.values.perusahaan.id
                  ) || null
                }
                onChange={(option) =>
                  formik.setFieldValue("perusahaan", option ? option : "")
                }
                options={perusahaanOptions}
                error={
                  formik.touched.perusahaan ? formik.errors.perusahaan : ""
                }
                disabled={perusahaanOptions.length === 1}
              />
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
              <Select
                required
                label="Role"
                name="role"
                value={
                  roles.find(
                    (option) =>
                      option.value === formik.values.groups.pk ||
                      option.value === formik.values.groups.value
                  ) || null
                }
                onChange={(option) => {
                  formik.setFieldValue("groups", option ? option : "");
                }}
                onBlur={formik.handleBlur}
                options={roles}
                error={formik.touched.roles ? formik.errors.roles : ""}
              ></Select>
              <Select
                required
                multi
                label="Lokasi Absen"
                name="lokasi_absen"
                value={
                  formik.values.lokasi_absen.map((item) => ({
                    value: item.value,
                    label: item.label,
                  })) || []
                }
                onChange={(option) =>
                  formik.setFieldValue("lokasi_absen", option ? option : "")
                } // Mengambil value dari option yang dipilih
                options={lokasiOptions} // Opsi lokasi absen diambil dari lokasiOptions
                error={
                  formik.touched.lokasi_absen ? formik.errors.lokasi_absen : ""
                }
              />
              {/* <Select
                required
                label="Penerima"
                name="penerima"
                value={formik.values.penerima}
                onChange={(options) =>
                  formik.setFieldValue("penerima", options)
                }
                options={pegawaiOptions}
                error={formik.touched.penerima && formik.errors.penerima}
              /> */}
            </div>
            <div className="justify-end flex gap-3">
              {sessionStorage.getItem("isEdit") === "true" && (
                <Button
                  onClick={() => formik.handleSubmit()}
                  loading={addPegawaiLoading}
                >
                  Simpan
                </Button>
              )}
              <Button
                loading={addPegawaiLoading}
                type="submit"
                onClick={handleLanjut}
              >
                Lanjut
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Pribadi;
