import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { useDispatch } from 'react-redux';
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
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cabangOptions, setCabangOptions] = useState([]);
  const [lokasiOptions, setLokasiOptions] = useState([]);

  const isEdit = pk && pk !== 'add';

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosAPI.get(API_URL_getcabang);
      setCabangOptions(response.data.map((item) => ({
        value: item.pk,
        label: item.nama,
      })));
      setLokasiOptions(response.data.map((item) => ({
        value: item.pk,
        label: item.nama,
      })));
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      nama: state?.item?.nama || '',
      username: state?.item?.username || '',
      email: state?.item?.email || '',
      no_identitas: state?.item?.no_identitas || '',
      jenis_kelamin: state?.item?.jenis_kelamin || '',
      no_telepon: state?.item?.no_telepon || '',
      tempat_lahir: state?.item?.tempat_lahir || '',
      tgl_lahir: state?.item?.tgl_lahir || '',
      agama: state?.item?.agama || '',
      npwp: state?.item?.npwp || '',
      alamat_ktp: state?.item?.alamat_ktp || '',
      alamat_domisili: state?.item?.alamat_domisili || '',
      cabang_id: state?.item?.cabang_id || '',
      titik_lokasi: state?.item?.titik_lokasi || [], // Ensure this is an array
    },
    validationSchema: Yup.object().shape({
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
      titik_lokasi: Yup.array().min(1, "At least one location must be selected").required("Titik Lokasi is required"),
    }),
    onSubmit: async (values) => {
      try {
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
          <h1>{isEdit ? 'Edit Data Pribadi' : 'Tambah Data Pribadi'}</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4'>
              <TextField
                required
                label="Nama"
                name="nama"
                value={formik.values.nama}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nama ? formik.errors.nama : ''}
              />
              <TextField
                required
                label="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username ? formik.errors.username : ''}
              />
              <TextField
                required
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email ? formik.errors.email : ''}
              />
            </div>
            <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4'>
              <TextField
                required
                label="No Identitas"
                name="no_identitas"
                value={formik.values.no_identitas}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.no_identitas ? formik.errors.no_identitas : ''}
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
                error={formik.touched.jenis_kelamin ? formik.errors.jenis_kelamin : ''}
              />
              <TextField
                required
                label="No Telepon"
                name="no_telepon"
                value={formik.values.no_telepon}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.no_telepon ? formik.errors.no_telepon : ''}
              />
            </div>
            <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4'>
              <TextField
                required
                label="Tempat Lahir"
                name="tempat_lahir"
                value={formik.values.tempat_lahir}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.tempat_lahir ? formik.errors.tempat_lahir : ''}
              />
              <TextField
                required
                label="Tanggal Lahir"
                name="tgl_lahir"
                type="date"
                value={formik.values.tgl_lahir}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.tgl_lahir ? formik.errors.tgl_lahir : ''}
              />
            </div>
            <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4'>
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
                error={formik.touched.agama ? formik.errors.agama : ''}
              />
              <TextField
                required
                label="NPWP"
                name="npwp"
                value={formik.values.npwp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.npwp ? formik.errors.npwp : ''}
              />
            </div>
            <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4'>
              <TextArea
                required
                label="Alamat KTP"
                name="alamat_ktp"
                value={formik.values.alamat_ktp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.alamat_ktp ? formik.errors.alamat_ktp : ''}
              />
              <TextArea
                required
                label="Alamat Domisili"
                name="alamat_domisili"
                value={formik.values.alamat_domisili}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.alamat_domisili ? formik.errors.alamat_domisili : ''}
              />
            </div>
            <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4'>
              <Select
                required
                label="Cabang ID"
                name="cabang_id"
                value={cabangOptions.find(option => option.value === formik.values.cabang_id) || null}
                onChange={(option) => formik.setFieldValue('cabang_id', option ? option.value : '')}
                options={cabangOptions}
                error={formik.touched.cabang_id ? formik.errors.cabang_id : ''}
              />
              <Select
                required
                multi
                label="Titik Lokasi"
                name="titik_lokasi"
                value={formik.values.titik_lokasi}
                onChange={(options) => formik.setFieldValue('titik_lokasi', options)}
                options={lokasiOptions}
                error={formik.touched.titik_lokasi ? formik.errors.titik_lokasi : ''}
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit">{isEdit ? "Simpan" : "Tambah"}</Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Pribadi;
