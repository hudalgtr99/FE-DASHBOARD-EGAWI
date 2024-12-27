import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import {
  Button,
  Container,
  TextField,
  TextArea,
  Select,
  PulseLoading,
} from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { addData, updateData } from "@/actions";
import { penugasanReducer } from "@/reducers/penugasanReducers";
import {
  API_URL_createtugas,
  API_URL_edeltugas,
  API_URL_getpegawai,
  API_URL_getperusahaan,
} from "@/constants";
import axiosAPI from "@/authentication/axiosApi";
import { formatISO, parseISO } from "date-fns";
import { fetchUserDetails } from "@/constants/user";
import { FileInput } from "../../../components";
import { updateFormData } from "../../../actions";

const PenugasanForm = () => {
  const { addTugasLoading } = useSelector((state) => state.tugas);
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pegawaiOptions, setPegawaiOptions] = useState([]);
  const [perusahaanOptions, setperusahaanOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const userData = await fetchUserDetails();
      setUser(userData.datapribadi);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isEdit = id && id !== "add";

  useEffect(() => {
    const fetchPegawaiData = async () => {
      const response = await axiosAPI.get(`${API_URL_getpegawai}?nama=`);
      setPegawaiOptions(
        response.data.map((item) => ({
          value: item.id,
          label: item.nama,
        }))
      );
    };

    const fetchperusahaanData = async () => {
      try {
        const response = await axiosAPI.get(API_URL_getperusahaan);
        const options = response.data.map((item) => ({
          value: item.pk,
          label: item.nama,
          slug: item.slug,
        }));
        setperusahaanOptions(options);
        if (options.length === 1 || state?.item?.perusahaan) {
          const perusahaanSlug = state?.item?.perusahaan?.slug;
          const perusahaanId =
            perusahaanSlug && options.find((opt) => opt.slug === perusahaanSlug)
              ? options.find((opt) => opt.slug === perusahaanSlug).value
              : state?.item?.perusahaan?.id || options[0].value;
          console.log("perusahaanSlug", perusahaanSlug)
          formik.setFieldValue("perusahaan", perusahaanId);
        }
      } catch (error) {
        console.error("Error fetching perusahaan data:", error);
      }
    };

    fetchPegawaiData();
    fetchperusahaanData();
    setIsLoading(false);
  }, []);

  const formik = useFormik({
    initialValues: {
      judul: state?.item?.judul || "",
      prioritas: state?.item?.prioritas || "",
      deskripsi: state?.item?.deskripsi || "",
      penerima:
        state?.item?.penerima?.map((item) => ({
          value: item.id,
          label: item.nama,
        })) || [],
      perusahaan: state?.item?.perusahaan || "",
      file_pendukung: state?.item?.file || "",
      start_date: state?.item?.start_date
        ? formatISO(parseISO(state.item.start_date), { representation: "date" })
        : "",
      end_date: state?.item?.end_date
        ? formatISO(parseISO(state.item.end_date), { representation: "date" })
        : "",
    },
    validationSchema: Yup.object().shape({
      judul: Yup.string()
        .required("Judul wajib diisi")
        .max(255, "Judul harus kurang dari 255 karakter"),
      prioritas: Yup.string().required("Prioritas wajib diisi"),
      deskripsi: Yup.string().required("Deskripsi wajib diisi"),
      penerima: Yup.array().min(1, "Penerima wajib diisi"),
      perusahaan: Yup.mixed().required("perusahaan wajib diisi"),
      start_date: Yup.date().required("Tanggal Mulai wajib diisi"),
      end_date: Yup.date()
        .required("Tanggal Selesai wajib diisi")
        .min(
          Yup.ref("start_date"),
          "Tanggal Selesai harus diisi setelah Tanggal Mulai"
        ),
    }),
    onSubmit: async (values) => {

      // Create FormData and append values
      const formData = new FormData();
      formData.append("judul", values.judul);
      formData.append("prioritas", values.prioritas);
      formData.append("deskripsi", values.deskripsi);
      formData.append(
        "penerima",
        JSON.stringify(values.penerima.map((option) => option.value))
      );
      formData.append("perusahaan", values.perusahaan);
      formData.append("start_date", values.start_date);
      formData.append("end_date", values.end_date);
      formData.append("pengirim", user?.user_id);

      // Append file if it exists
      if (values.file_pendukung) {
        formData.append("file_pendukung", values.file_pendukung);
      }

      // Use the appropriate API URL and action
      if (isEdit) {
        if (id) {
          const data = await updateFormData(
            { dispatch, redux: penugasanReducer },
            formData, // Tetap gunakan FormData
            API_URL_edeltugas,
            "ADD_TUGAS",
            id,
            { headers: { "Content-Type": "multipart/form-data" } } // Tambahkan header di sini
          );
          if (data && !addTugasLoading) {
            navigate("/kepegawaian/penugasan");
          }
        } else {
          console.error("ID is undefined for updating the task.");
        }
      } else {
        const data = await addData(
          { dispatch, redux: penugasanReducer },
          formData,
          API_URL_createtugas,
          "ADD_TUGAS",
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (data && !addTugasLoading) {
          navigate("/kepegawaian/penugasan");
        }
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-4 h-[80vh] items-center">
        <PulseLoading />
      </div>
    );
  }

  return (
    <Container>
      <div className="flex items-center gap-2 mb-4">
        <button
          className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
          onClick={() => navigate("/kepegawaian/penugasan")}
        >
          <IoMdReturnLeft />
        </button>
        <h1>{isEdit ? "Edit Tugas" : "Tambah Tugas"}</h1>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Select
          required
          label="perusahaan"
          name="perusahaan"
          value={
            perusahaanOptions.find(
              (option) => option.value === formik.values.perusahaan
            ) || null
          }
          onChange={(option) => {
            formik.setFieldValue("perusahaan", option ? option.value : "");
          }}
          options={perusahaanOptions}
          error={formik.touched.perusahaan && formik.errors.perusahaan}
          disabled={perusahaanOptions.length === 1}
        />

        <TextField
          required
          label="Judul"
          name="judul"
          value={formik.values.judul}
          onChange={formik.handleChange}
          onBlur={(e) => formik.handleBlur}
          error={formik.touched.judul && formik.errors.judul}
        />
        <Select
          required
          label="Prioritas"
          name="prioritas"
          value={
            formik.values.prioritas
              ? {
                  value: formik.values.prioritas,
                  label: (() => {
                    const option = [
                      { value: "1", label: "Tinggi" },
                      { value: "2", label: "Sedang" },
                      { value: "3", label: "Rendah" },
                    ].find(
                      (option) => option.value === formik.values.prioritas
                    );
                    return option ? option.label : "Tidak Diketahui"; // Fallback label jika tidak ditemukan
                  })(),
                }
              : null
          }
          onChange={(option) =>
            formik.setFieldValue("prioritas", option ? option.value : "")
          } // Set the field value as the ID
          options={[
            { value: "1", label: "Tinggi" },
            { value: "2", label: "Sedang" },
            { value: "3", label: "Rendah" },
          ]}
          error={formik.touched.prioritas && formik.errors.prioritas}
        />

        <TextArea
          required
          label="Deskripsi Tugas"
          name="deskripsi"
          value={formik.values.deskripsi}
          onChange={formik.handleChange}
          onBlur={(e) => formik.handleBlur}
          error={formik.touched.deskripsi && formik.errors.deskripsi}
        />
        <Select
          required
          multi
          label="Penerima"
          name="penerima"
          value={formik.values.penerima}
          onChange={(options) => formik.setFieldValue("penerima", options)}
          options={pegawaiOptions}
          error={formik.touched.penerima && formik.errors.penerima}
        />

        {/* <TextField
          label="File Pendukung"
          name="file_pendukung"
          type="file"
          onChange={(event) => {
            formik.setFieldValue(
              "file_pendukung",
              event.currentTarget.files[0]
            );
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.file_pendukung && formik.errors.file_pendukung}
        /> */}
        <div className="">
          <label
            style={{
              fontSize: "14px",
            }}
            className={`mb-2 font-[400]`}
          >
            File tugas {"(opsional)"}
          </label>
          <FileInput
            height={70}
            accept={{ "application/pdf": [] }}
            maxFiles={1}
            minSize={0}
            maxSize={2097152}
            multiple={false}
            value={
              formik.values.file_pendukung ? [formik.values.file_pendukung] : []
            }
            setValue={(files) => {
              formik.setFieldValue("file_pendukung", files[0] || null);
            }}
          />
        </div>

        <TextField
          required
          label="Tanggal Mulai"
          name="start_date"
          type="date"
          value={formik.values.start_date}
          onChange={formik.handleChange}
          onBlur={(e) => formik.handleBlur}
          error={formik.touched.start_date && formik.errors.start_date}
        />
        <TextField
          required
          label="Tanggal Selesai"
          name="end_date"
          type="date"
          value={formik.values.end_date}
          onChange={formik.handleChange}
          onBlur={(e) => formik.handleBlur}
          error={formik.touched.end_date && formik.errors.end_date}
        />
        <div className="mt-6 flex justify-end">
          <Button loading={addTugasLoading} type="submit">
            {isEdit ? "Update" : "Tambah"}
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default PenugasanForm;
