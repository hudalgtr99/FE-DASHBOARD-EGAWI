import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import { BsQuestionLg } from "react-icons/bs";
import {
  Button,
  Container,
  Select,
  Modal,
  Tables,
  Tooltip,
} from "@/components";
import { useDispatch } from "react-redux";
import { addData } from "@/actions";
import { pegawaiReducer } from "@/reducers/kepegawaianReducers";
import {
  API_URL_importdatapribadipegawai,
  API_URL_getperusahaan,
  API_URL_getlokasiabsen,
} from "@/constants";
import axiosAPI from "@/authentication/axiosApi";
import { FileInput } from "../../../components";
import * as XLSX from "xlsx";

const ImportPegawai = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [perusahaanOptions, setPerusahaanOptions] = useState([]);
  const [lokasiOptions, setLokasiOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jsonData, setJsonData] = useState([]);
  const [excelModal, setExcelModal] = useState(false);
  const [importedDataLoading, setImportedDataLoading] = useState(true);
  const exampleTableJson = [
    {
      nama: "John Doe",
      email: "johndoe@gmail.com",
      no_identitas: 1222255,
      jenis_kelamin: "Laki laki",
      no_telepon: "081234567890",
      tempat_lahir: "Lampung",
      tanggal_lahir: "1990-01-01",
      agama: "Islam",
      npwp: 1234567890,
      alamat_ktp: "Lampung",
      alamat_domisili: "Lampung",
      perusahaan: 1,
      example: true,
      lokasi_absen: { value: 1, label: "Qnn office" },
    },
    {
      nama: "Jane Smith",
      email: "janesmith@gmail.com",
      no_identitas: 1222256,
      jenis_kelamin: "Perempuan",
      no_telepon: "082345678901",
      tempat_lahir: "Jakarta",
      tanggal_lahir: "1985-05-15",
      agama: "Kristen",
      npwp: 1234567891,
      alamat_ktp: "Jakarta",
      alamat_domisili: "Jakarta",
      perusahaan: 2,
      example: true,
      lokasi_absen: { value: 2, label: "Jakarta office" },
    },
    {
      nama: "Michael Johnson",
      email: "michaelj@gmail.com",
      no_identitas: 1222257,
      jenis_kelamin: "Laki laki",
      no_telepon: "083456789012",
      tempat_lahir: "Surabaya",
      tanggal_lahir: "1988-08-20",
      agama: "Hindu",
      npwp: 1234567892,
      alamat_ktp: "Surabaya",
      alamat_domisili: "Surabaya",
      perusahaan: 3,
      example: true,
      lokasi_absen: { value: 3, label: "Surabaya office" },
    },
    {
      nama: "Emma White",
      email: "emmawhite@gmail.com",
      no_identitas: 1222258,
      jenis_kelamin: "Perempuan",
      no_telepon: "084567890123",
      tempat_lahir: "Bali",
      tanggal_lahir: "1992-02-25",
      agama: "Buddha",
      npwp: 1234567893,
      alamat_ktp: "Bali",
      alamat_domisili: "Bali",
      perusahaan: 4,
      example: true,
      lokasi_absen: { value: 4, label: "Bali office" },
    },
    {
      nama: "Chris Green",
      email: "chrisgreen@gmail.com",
      no_identitas: 1222259,
      jenis_kelamin: "Laki laki",
      no_telepon: "085678901234",
      tempat_lahir: "Bandung",
      tanggal_lahir: "1994-09-10",
      agama: "Islam",
      npwp: 1234567894,
      alamat_ktp: "Bandung",
      alamat_domisili: "Bandung",
      perusahaan: 5,
      example: true,
      lokasi_absen: { value: 5, label: "Bandung office" },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAPI.get(API_URL_getperusahaan);
        const options = response.data.map((item) => ({
          value: item.pk,
          label: item.nama,
        }));
        setPerusahaanOptions(options);

        if (options.length === 1 || state?.item?.perusahaan) {
          const perusahaanId = state?.item?.perusahaan?.id || options[0].value;
          formik.setFieldValue("perusahaan", perusahaanId);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching perusahaan data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const initialValues = {
    perusahaan: state?.item?.perusahaan?.id || "",
    lokasi_absen: state?.item?.lokasi_absen || [],
    excel: null,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      perusahaan: Yup.number().required("Perusahaan wajib diisi"),
      excel: Yup.mixed()
        .required("File Excel wajib diisi")
        .test(
          "fileType",
          "Hanya file excel yang diizinkan",
          (value) =>
            !value ||
            (value &&
              (value.type === "application/vnd.ms-excel" ||
                value.type ===
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
        ),
      lokasi_absen: Yup.array().required("Lokasi Absen wajib diisi"),
    }),
    onSubmit: async (values) => {
      setImportedDataLoading(false);
      const formData = new FormData();
      formData.append("perusahaan_id", values.perusahaan);
      formData.append(
        "lokasi_absen_ids",
        JSON.stringify(values.lokasi_absen.map((option) => option.value))
      );
      formData.append("excel", values.excel);

      try {
        await addData(
          { dispatch, redux: pegawaiReducer },
          formData,
          API_URL_importdatapribadipegawai,
          "ADD_PEGAWAI",
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        navigate("/kepegawaian/pegawai");
      } catch (error) {
        console.error("Error in form submission: ", error);
      } finally {
        setExcelModal(false);
        setImportedDataLoading(true);
      }
    },
  });

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

  function handleTableExcel(e) {
    e.preventDefault();
    formik.setTouched({
      perusahaan: true,
      lokasi_absen: true,
      excel: true,
    });

    if (formik.isValid) {
      console.log(formik.values);
      setExcelModal(true);
      const file = formik.values.excel;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);

          const updatedJson = json.map((item) => {
            const renamedItem = {};
            Object.keys(item).forEach((key) => {
              const newKey = key.toLowerCase().replace(/\s+/g, "_");
              renamedItem[newKey] = item[key];
            });

            return {
              ...renamedItem,
              perusahaan: formik.values.perusahaan,
              lokasi_absen: formik.values.lokasi_absen,
            };
          });

          setJsonData(updatedJson);
        };
        reader.readAsBinaryString(file);
      }
    }
  }

  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4 justify-between">
          <div className="flex items-center gap-2">
            <button
              className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
              onClick={() => navigate("/kepegawaian/pegawai")}
            >
              <IoMdReturnLeft />
            </button>
            <h1>Import Data Pribadi Pegawai</h1>
          </div>
          <Tooltip placement="left" tooltip="Contoh table yang diizinkan">
            <button
              className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
              onClick={() => {
                setJsonData(exampleTableJson), setExcelModal(true);
              }}
            >
              <BsQuestionLg className="text-base" />
            </button>
          </Tooltip>
        </div>
        <div>
          <form onSubmit={handleTableExcel} className="space-y-6">
            <div className="flex flex-col">
              <div className="">
                <label
                  style={{
                    fontSize: "14px",
                  }}
                  className={`mb-2 font-[400]`}
                >
                  File Excel
                </label>
                <FileInput
                  text={"Drag 'n' drop some Excel file here."}
                  height={70}
                  accept={{
                    "application/vnd.ms-excel": [],
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                      [],
                  }}
                  maxFiles={1}
                  minSize={0}
                  maxSi ze={2097152} // 2 MB
                  multiple={false}
                  value={formik.values.excel ? [formik.values.excel] : []}
                  setValue={(files) => {
                    formik.setFieldValue("excel", files[0] || null);
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "11px",
                }}
                className="leading-none tracking-wide mt-1 text-danger-500"
              >
                {formik.touched.excel ? formik.errors.excel : ""}
              </div>
            </div>
            <div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
              <Select
                required
                label="Perusahaan"
                name="perusahaan_id"
                value={
                  perusahaanOptions.find(
                    (option) => option.value === formik.values.perusahaan
                  ) || null
                }
                onChange={(option) =>
                  formik.setFieldValue("perusahaan", option.value || "")
                }
                options={perusahaanOptions}
                error={
                  formik.touched.perusahaan ? formik.errors.perusahaan : ""
                }
                disabled={perusahaanOptions.length === 1}
              />
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
                  formik.setFieldValue("lokasi_absen", option || "")
                }
                options={lokasiOptions}
                error={
                  formik.touched.lokasi_absen ? formik.errors.lokasi_absen : ""
                }
              />
            </div>
            <div className="justify-end flex gap-3">
              <Button type="submit">Preview table</Button>
            </div>
          </form>
        </div>
      </Container>
      <Modal show={excelModal} setShow={setExcelModal} width="full" persistent>
        <div className="text-lg font-normal p-5">
          <div className="mb-3">
            {jsonData.find((data) => data.example === true)
              ? "Contoh"
              : "Preview"}{" "}
            Table
          </div>
          <Tables>
            <Tables.Head>
              <tr>
                <Tables.Header>Nama</Tables.Header>
                <Tables.Header>Email</Tables.Header>
                <Tables.Header>No Identitas</Tables.Header>
                <Tables.Header>Jenis Kelamin</Tables.Header>
                <Tables.Header>No Telepon</Tables.Header>
                <Tables.Header>Tempat Lahir</Tables.Header>
                <Tables.Header>Tanggal Lahir</Tables.Header>
                <Tables.Header>Agama</Tables.Header>
                <Tables.Header>NPWP</Tables.Header>
                <Tables.Header>Alamat KTP</Tables.Header>
                <Tables.Header>Alamat Domisili</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {jsonData.map((item, index) => (
                <tr key={index}>
                  <Tables.Data>{item?.nama || "-"}</Tables.Data>
                  <Tables.Data>{item?.email || "-"}</Tables.Data>
                  <Tables.Data>{item?.no_identitas || "-"}</Tables.Data>
                  <Tables.Data>{item?.jenis_kelamin || "-"}</Tables.Data>
                  <Tables.Data>{item?.no_telepon || "-"}</Tables.Data>
                  <Tables.Data>{item?.tempat_lahir || "-"}</Tables.Data>
                  <Tables.Data>{item?.tanggal_lahir || "-"}</Tables.Data>
                  <Tables.Data>{item?.agama || "-"}</Tables.Data>
                  <Tables.Data>{item?.npwp || "-"}</Tables.Data>
                  <Tables.Data>{item?.alamat_ktp || "-"}</Tables.Data>
                  <Tables.Data>{item?.alamat_domisili || "-"}</Tables.Data>
                </tr>
              ))}
            </Tables.Body>
          </Tables>

          {jsonData.find((data) => data.example === true) ? null : (
            <div className="mt-14">
              <div className="text-sm flex justify-end gap-2 absolute bottom-5 right-5">
                <Button
                  onClick={() => setExcelModal(false)}
                  variant="tonal"
                  color="base"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => formik.handleSubmit()}
                  variant="flat"
                  color="primary"
                  loading={!importedDataLoading}
                  disabled={!importedDataLoading}
                >
                  Import
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ImportPegawai;
