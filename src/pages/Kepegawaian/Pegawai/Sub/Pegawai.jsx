import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoMdReturnLeft } from "react-icons/io";
import {
  Button,
  Container,
  TextField,
  Select,
} from '@/components';
import { useDispatch } from 'react-redux';
import { addData, updateData } from '@/actions';
import { pegawaiReducer } from '@/reducers/kepegawaianReducers';
import {
  API_URL_createuser,
  API_URL_edeluser,
  API_URL_getmasterpegawai,
} from '@/constants';
import axiosAPI from "@/authentication/axiosApi";

const Pegawai = () => {
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pangkatOptions, setPangkatOptions] = useState([]);
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [departemenOptions, setDepartemenOptions] = useState([]);
  const [divisiOptions, setDivisiOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  const isEdit = pk && pk !== 'add';

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosAPI.get(API_URL_getmasterpegawai);
      setPangkatOptions(
        response.data.pangkat.map((item) => ({
          value: item.pk,
          label: item.nama,
        }))
      );
      setJabatanOptions(
        response.data.jabatan.map((item) => ({
          value: item.pk,
          label: item.nama,
        }))
      );
      setDepartemenOptions(
        response.data.departemen.map((item) => ({
          value: item.pk,
          label: item.nama,
        }))
      );
      setDivisiOptions(
        response.data.divisi.map((item) => ({
          value: item.pk,
          label: item.nama,
        }))
      );
      setUnitOptions(
        response.data.unit.map((item) => ({
          value: item.pk,
          label: item.nama,
        }))
      );
    };
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      id_pegawai: state?.item?.id_pegawai,
      pangkat: state?.item?.pangkat,
      jabatan: state?.item?.jabatan,
      departemen: state?.item?.departemen,
      divisi: state?.item?.divisi,
      unit: state?.item?.unit,
      tgl_bergabung: state?.item?.tgl_bergabung,
    },
    validationSchema: Yup.object().shape({
      id_pegawai: Yup.string().required("ID Pegawai is required"),
      pangkat: Yup.string().required("Pangkat is required"),
      jabatan: Yup.string().required("Jabatan is required"),
      departemen: Yup.string().required("Departemen is required"),
      divisi: Yup.string().required("Divisi is required"),
      unit: Yup.string().required("Unit is required"),
      tgl_bergabung: Yup.date().required("Tanggal Bergabung is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateData(
            { dispatch, redux: pegawaiReducer },
            { pk: pk, ...values },
            API_URL_edeluser,
            'UPDATE_PEGAWAI'
          );
        } else {
          await addData(
            { dispatch, redux: pegawaiReducer },
            values,
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
          <h1>{isEdit ? 'Edit Data Pegawai' : 'Tambah Data Pegawai'}</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <div className='flex gap-4'>
              <TextField
                required
                label="ID Pegawai"
                name="id_pegawai"
                value={formik.values.id_pegawai}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.id_pegawai ? formik.errors.id_pegawai : ''}
              />
              <Select
                required
                label="Pangkat"
                name="pangkat"
                value={pangkatOptions.find(option => option.value === formik.values.pangkat) || null}
                onChange={(option) => formik.setFieldValue('pangkat', option ? option.value : '')}
                options={pangkatOptions}
                error={formik.touched.pangkat ? formik.errors.pangkat : ''}
              />
            </div>
            <div className='flex gap-4'>
              <Select
                required
                label="Jabatan"
                name="jabatan"
                value={jabatanOptions.find(option => option.value === formik.values.jabatan) || null}
                onChange={(option) => formik.setFieldValue('jabatan', option ? option.value : '')}
                options={jabatanOptions}
                error={formik.touched.jabatan ? formik.errors.jabatan : ''}
              />
              <Select
                required
                label="Departemen"
                name="departemen"
                value={departemenOptions.find(option => option.value === formik.values.departemen) || null}
                onChange={(option) => formik.setFieldValue('departemen', option ? option.value : '')}
                options={departemenOptions}
                error={formik.touched.departemen ? formik.errors.departemen : ''}
              />
            </div>
            <div className='flex gap-4'>
              <Select
                required
                label="Divisi"
                name="divisi"
                value={divisiOptions.find(option => option.value === formik.values.divisi) || null}
                onChange={(option) => formik.setFieldValue('divisi', option ? option.value : '')}
                options={divisiOptions}
                error={formik.touched.divisi ? formik.errors.divisi : ''}
              />
              <Select
                required
                label="Unit"
                name="unit"
                value={unitOptions.find(option => option.value === formik.values.unit) || null}
                onChange={(option) => formik.setFieldValue('unit', option ? option.value : '')}
                options={unitOptions}
                error={formik.touched.unit ? formik.errors.unit : ''}
              />
            </div>
            <div className='flex gap-4'>
              <TextField
                required
                label="Tanggal Bergabung"
                name="tgl_bergabung"
                type="date"
                value={formik.values.tgl_bergabung}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.tgl_bergabung ? formik.errors.tgl_bergabung : ''}
              />
              <TextField
                label="Tanggal Resign"
                name="tgl_resign"
                type="date"
                value={formik.values.tgl_resign}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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

export default Pegawai;
