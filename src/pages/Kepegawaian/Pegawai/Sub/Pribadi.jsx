import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoMdReturnLeft } from "react-icons/io";
import {
  Button,
  Container,
  TextField,
  TextArea,
  Select,
} from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { addData, updateData } from '@/actions';
import { pegawaiReducer } from '@/reducers/kepegawaianReducers';
import {
  API_URL_createuser,
  API_URL_edeluser,
  API_URL_getcabang,
} from '@/constants';
import axiosAPI from "@/authentication/axiosApi";

const Pribadi = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cabangOptions, setCabangOptions] = useState([]);
  const [lokasiOptions, setLokasiOptions] = useState([]);
  const { getPegawaiResult } = useSelector(state => state.kepegawaian);
  const [initialValues, setInitialValues] = useState({
    nama: "",
    username: "",
    email: "",
    no_identitas: "",
    jenis_kelamin: "",
    no_telepon: "",
    tempat_lahir: "",
    tgl_lahir: "",
    agama: "",
    npwp: "",
    alamat_ktp: "",
    alamat_domisili: "",
    cabang_id: "",
    titik_lokasi: "",
  });
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object({
    nama: Yup.string().required("Nama is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
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
    titik_lokasi: Yup.string().required("Titik Lokasi is required"),
  });

  const isEdit = pk && pk !== 'add';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAPI.get(API_URL_getcabang);
        setCabangOptions(response.data.map((item) => ({
          value: String(item.pk), // Convert pk to a string
          label: item.nama,
        })));
        setLokasiOptions(response.data.map((item) => ({
          value: String(item.pk), // Convert pk to a string
          label: item.nama,
        })));
      } catch (error) {
        console.error('Error fetching cabang options: ', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isEdit && getPegawaiResult?.results) {
      const foundPegawai = getPegawaiResult.results.find(item => item.pk === parseInt(pk, 10));
      if (foundPegawai) {
        setInitialValues({
          nama: foundPegawai.nama || '',
          username: foundPegawai.username || '',
          email: foundPegawai.email || '',
          no_identitas: foundPegawai.no_identitas || '',
          jenis_kelamin: foundPegawai.jenis_kelamin || '',
          no_telepon: foundPegawai.no_telepon || '',
          tempat_lahir: foundPegawai.tempat_lahir || '',
          tgl_lahir: foundPegawai.tgl_lahir || '',
          agama: foundPegawai.agama || '',
          npwp: foundPegawai.npwp || '',
          alamat_ktp: foundPegawai.alamat_ktp || '',
          alamat_domisili: foundPegawai.alamat_domisili || '',
          cabang_id: foundPegawai.cabang_id || '',
          titik_lokasi: foundPegawai.titik_lokasi || '',
        });
      }
    }
    setLoading(false); // Data fetching complete
  }, [isEdit, pk, getPegawaiResult]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // This ensures formik will update when initialValues change
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Convert titik_lokasi to a JSON string
        const updatedValues = {
          ...values,
          titik_lokasi: JSON.stringify(values.titik_lokasi),
        };

        if (isEdit) {
          await updateData(
            { dispatch, redux: pegawaiReducer },
            { pk: pk, ...updatedValues },
            API_URL_edeluser,
            'UPDATE_PEGAWAI'
          );
        } else {
          await addData(
            { dispatch, redux: pegawaiReducer },
            updatedValues,
            API_URL_createuser,
            'ADD_PEGAWAI'
          );
        }
        navigate('/kepegawaian/pegawai');
      } catch (error) {
        console.error('Error in form submission: ', error);
      }
    },
  });


  if (loading) {
    return <div>Loading...</div>; // Show loading indicator until data is ready
  }

  return (
    <div>
      <Container>
        <div className='flex items-center gap-2 mb-4'>
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#7367f0] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate("/kepegawaian/pegawai")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>{isEdit ? 'Edit Data Pribadi' : 'Add Data Pribadi'}</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <TextField
              label="Nama"
              name="nama"
              value={formik.values.nama}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nama ? formik.errors.nama : ''}
            />
            <TextField
              label="Username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username ? formik.errors.username : ''}
            />
            <TextField
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email ? formik.errors.email : ''}
            />
            <TextField
              label="No Identitas"
              name="no_identitas"
              value={formik.values.no_identitas}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.no_identitas ? formik.errors.no_identitas : ''}
            />
            <Select
              label="Jenis Kelamin"
              name="jenis_kelamin"
              value={formik.values.jenis_kelamin ? { value: formik.values.jenis_kelamin, label: formik.values.jenis_kelamin } : null}
              onChange={(option) => formik.setFieldValue('jenis_kelamin', option ? option.value : '')}
              options={[
                { value: 'Laki Laki', label: 'Laki Laki' },
                { value: 'Perempuan', label: 'Perempuan' },
              ]}
              error={formik.touched.jenis_kelamin ? formik.errors.jenis_kelamin : ''}
            />
            <TextField
              label="No Telepon"
              name="no_telepon"
              value={formik.values.no_telepon}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.no_telepon ? formik.errors.no_telepon : ''}
            />
            <TextField
              label="Tempat Lahir"
              name="tempat_lahir"
              value={formik.values.tempat_lahir}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tempat_lahir ? formik.errors.tempat_lahir : ''}
            />
            <TextField
              label="Tanggal Lahir"
              name="tgl_lahir"
              type="date"
              value={formik.values.tgl_lahir}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tgl_lahir ? formik.errors.tgl_lahir : ''}
            />
            <Select
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
              error={formik.touched.agama ? formik.errors.agama : ''}
            />
            <TextField
              label="NPWP"
              name="npwp"
              value={formik.values.npwp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.npwp ? formik.errors.npwp : ''}
            />
            <TextArea
              label="Alamat KTP"
              name="alamat_ktp"
              value={formik.values.alamat_ktp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.alamat_ktp ? formik.errors.alamat_ktp : ''}
            />
            <TextArea
              label="Alamat Domisili"
              name="alamat_domisili"
              value={formik.values.alamat_domisili}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.alamat_domisili ? formik.errors.alamat_domisili : ''}
            />
            <Select
              label="Cabang ID"
              name="cabang_id"
              value={cabangOptions.find(option => option.value === String(formik.values.cabang_id)) || null}
              onChange={(option) => formik.setFieldValue('cabang_id', option ? option.value : '')}
              options={cabangOptions}
              error={formik.touched.cabang_id ? formik.errors.cabang_id : ''}
            />
            <Select
              label="Titik Lokasi"
              name="titik_lokasi"
              value={lokasiOptions.find(option => option.value === String(formik.values.titik_lokasi)) || null}
              onChange={(option) => formik.setFieldValue('titik_lokasi', option ? option.value : '')}
              options={lokasiOptions}
              error={formik.touched.titik_lokasi ? formik.errors.titik_lokasi : ''}
            />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default Pribadi;
