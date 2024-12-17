import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import {
  Button,
  Container,
  TextField,
  Select,
  PulseLoading,
  Checkbox,
} from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { addData, updateData } from "@/actions";
import { penugasanReducer } from "@/reducers/penugasanReducers";
import {
  API_URL_createsurattugas,
  API_URL_edelsurattugas,
  API_URL_getpegawai,
  API_URL_getperusahaan,
  API_URL_getjumlahsurattugas,
  API_URL_getalltemplatesurattugas,
} from "@/constants";
import axiosAPI from "@/authentication/axiosApi";
import { fetchUserDetails } from "@/constants/user";
import CKEditor from "../../../components/forms/CKEditor";

const SuratPenugasanSlug = () => {
  const { addTugasLoading } =
    useSelector((state) => state.tugas);
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pegawaiOptions, setPegawaiOptions] = useState([]);
  const [perusahaanOptions, setPerusahaanOptions] = useState([]);
  const [templatesOptions, setTemplatesOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [jumlahSurat, setJumlahSurat] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const userData = await fetchUserDetails();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isEdit = id && id !== "add";

  const formik = useFormik({
    initialValues: {
      perusahaan: state?.item?.perusahaan || "",
      nama: state?.item?.nama || "",
      pemohon: state?.item?.pemohon?.id || state?.item?.pemohon || "",
      penerima:
        state?.item?.penerima?.map((item) => ({
          value: item.id,
          label: item.nama,
        })) || [],
      template: state?.item?.template || "",
      noSurat: "",
      isi: state?.item?.isi || "",
    },
    validationSchema: Yup.object().shape({
      nama: Yup.string().required("Nama wajib diisi").max(255, "Nama harus kurang dari 255 karakter"),
      pemohon: Yup.string().required("Pemohon wajib diisi"),
      penerima: Yup.array().min(1, "Penerima wajib diisi"),
      perusahaan: Yup.mixed().required("Perusahaan wajib diisi"),
    }),

    onSubmit: async (values) => {
      const payload = {
        ...values,
        penerima: JSON.stringify(values.penerima.map((option) => option.value)),
        pemohon: values.pemohon,
        template: values.template,
        isi: sessionStorage.getItem("ckeditor"),
        no_surat: formik.values.noSurat
      };

      if (isEdit) {
        if (id) {
          const data = await updateData(
            { dispatch, redux: penugasanReducer },
            { pk: id, data: payload },
            API_URL_edelsurattugas,
            "ADD_TUGAS"
          );
          if(data && !addTugasLoading){
            navigate("/kepegawaian/surat-penugasan")
          }
        } else {
          console.error("ID is undefined for updating the task.");
        }
      } else {
        const data = await addData(
          { dispatch, redux: penugasanReducer },
          payload,
          API_URL_createsurattugas,
          "ADD_TUGAS"
        );
        if(data && !addTugasLoading){
          navigate("/kepegawaian/surat-penugasan")
        }
      }
    },
  });


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [
          pegawaiResponse,
          perusahaanResponse,
          jumlahSuratResponse,
          templatesResponse,
        ] = await Promise.all([
          axiosAPI.get(`${API_URL_getpegawai}?nama=`),
          axiosAPI.get(API_URL_getperusahaan),
          axiosAPI.get(API_URL_getjumlahsurattugas),
          axiosAPI.get(API_URL_getalltemplatesurattugas),
        ]);

        setPegawaiOptions(
          pegawaiResponse.data.map((item) => ({
            value: item.id,
            label: item.nama,
            jabatan: item.datapegawai.jabatan.nama,
            departemen: item.datapegawai.departemen.nama,
            divisi: item.datapegawai.divisi.nama,
            unit: item.datapegawai.unit.nama,
          }))
        );

        setTemplatesOptions(
          templatesResponse.data.map((item) => ({
            value: item.id,
            label: item.nama,
          }))
        );

        const options = perusahaanResponse.data.map((item) => ({
          value: item.pk,
          label: item.nama,
        }));
        setPerusahaanOptions(options);

        if (options.length === 1) {
          formik.setFieldValue("perusahaan", options[0].value);
        }

        setJumlahSurat(jumlahSuratResponse.data.count);
        if (jumlahSurat >= 0) {
          const id_template = formik.values.template
            .toString()
            .padStart(2, "0");
          const id_templateEdit = isEdit ? formik.values.template.id : {}
            .toString()
            .padStart(2, "0");
          const suratCount = (jumlahSurat + 1).toString().padStart(2, "0");
          const perusahaanSingkatan = user.datapribadi.perusahaan
            ? user.datapribadi.perusahaan.nama_singkatan
            : "QNN";
          const departemenSingkatan = user.datapegawai
            ? user.datapegawai.departemen.nama_singkatan
            : "SDM";
          const currentMonth = (new Date().getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const currentYear = new Date().getFullYear();
          console.log("id_template", id_template)

          const generatedNoSurat = `${isEdit ? id_templateEdit : id_template}·${suratCount}/${perusahaanSingkatan}-${departemenSingkatan}/${currentMonth}/${currentYear}`;
          formik.setFieldValue("noSurat", generatedNoSurat);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [user, jumlahSurat, formik.values.template]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4 h-[80vh] items-center">
        <PulseLoading />
      </div>
    );
  }

  const handleHtmlChange = (newHtml) => {
    formik.setFieldValue("isi", newHtml);
  };

  return (
    <Container>
      <div className="flex items-center gap-2 mb-4">
        <button
          className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
          onClick={() => navigate("/kepegawaian/penugasan")}
        >
          <IoMdReturnLeft />
        </button>
        <h1>{isEdit ? "Edit Surat" : "Tambah Surat"}</h1>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Select
          required
          label="Perusahaan"
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
          label="Nomor Surat"
          name="noSurat"
          value={formik.values.noSurat}
          disabled
        />
        <TextField
          required
          label="Nama Surat"
          name="nama"
          value={formik.values.nama}
          onChange={formik.handleChange}
          error={formik.touched.nama && formik.errors.nama}
        />
        <Select
          required
          label="Pemohon"
          name="pemohon"
          value={
            pegawaiOptions.find(
              (option) => option.value === formik.values.pemohon.id ||
                          option.value === formik.values.pemohon
            ) || null
          }
          onChange={(option) => {
            formik.setFieldValue("pemohon", option ? option.value : "");
          }}
          options={pegawaiOptions}
          error={formik.touched.pemohon && formik.errors.pemohon}
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
        <Select
          required
          label="Template"
          name="template"
          value={
            templatesOptions.find(
              (option) => option.value === formik.values.template.id ||
                          option.value === formik.values.template
            )
          }
          onChange={(option) => {
            formik.setFieldValue("template", option ? option.value : "");
          }}
          options={templatesOptions}
          error={formik.touched.template && formik.errors.template}
          disabled={isEdit}
        />
        <CKEditor
          type={!isEdit && Number(formik.values.template)}
          user={user.datapribadi}
          noSurat={formik.values.noSurat}
          pemohon={pegawaiOptions.find(
            (option) => option.value === formik.values.pemohon
          )}
          penerima={pegawaiOptions.filter((option) =>
            formik.values.penerima.some(
              (penerimaItem) => penerimaItem.value === option.value
            )
          )}
          values={formik.values.isi}
          onChange={handleHtmlChange}
          isEdit={isEdit}
        />
        <div className="flex justify-end mt-8">
          <Button
            loading={addTugasLoading}
            type="submit"
            color="primary"
            className="shadow-md hover:shadow-lg"
          >
            {isEdit ? "Update" : "Tambah"}
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default SuratPenugasanSlug;
