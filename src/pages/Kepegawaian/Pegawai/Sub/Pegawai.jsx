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
import { updateData } from '@/actions';
import { pegawaiReducer } from '@/reducers/kepegawaianReducers';
import {
  API_URL_edeluser,
  API_URL_getmasterpegawai,
} from '@/constants';
import axiosAPI from "@/authentication/axiosApi";

const Pegawai = () => {
  const { pk } = useParams(); // primary key of the employee (if editing)
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pangkatOptions, setPangkatOptions] = useState([]);
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [departemenOptions, setDepartemenOptions] = useState([]);
  const [divisiOptions, setDivisiOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  // console.log(state)

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

  // Formik setup for form handling and validation
  const formik = useFormik({
    initialValues: {
      user_id: state?.item?.datapribadi.user_id || '',
      id_pegawai: state?.item?.datapegawai?.id_pegawai || '',
      pangkat_id: state?.item?.datapegawai?.pangkat.id || '',
      jabatan_id: state?.item?.datapegawai?.jabatan.id || '',
      departemen_id: state?.item?.datapegawai?.departemen.id || '',
      divisi_id: state?.item?.datapegawai?.divisi.id || '',
      unit_id: state?.item?.datapegawai?.unit.id || '',
      tgl_bergabung: state?.item?.datapegawai?.tgl_bergabung || '',
      tgl_resign: state?.item?.datapegawai?.tgl_resign || '',
    },
    validationSchema: Yup.object().shape({
      id_pegawai: Yup.string().required("ID Pegawai is required"),
      pangkat_id: Yup.string().required("Pangkat is required"),
      jabatan_id: Yup.string().required("Jabatan is required"),
      departemen_id: Yup.string().required("Departemen is required"),
      divisi_id: Yup.string().required("Divisi is required"),
      unit_id: Yup.string().required("Unit is required"),
      tgl_bergabung: Yup.date().required("Tanggal Bergabung is required"),
    }),
    onSubmit: async (values) => {
      try {
        await updateData(
          { dispatch, redux: pegawaiReducer },
          {
            pk: "datapegawai", // Only send `pk` if it's an edit
            ...values,
          },
          API_URL_edeluser, // Single API URL used for both add and update
          'ADD_PEGAWAI' // Unified action for add/update
        );
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
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate("/kepegawaian/pegawai")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>Data Pegawai</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4'>
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
                name="pangkat_id"
                value={pangkatOptions.find(option => option.value === formik.values.pangkat_id) || null}
                onChange={(option) => formik.setFieldValue('pangkat_id', option ? option.value : '')}
                options={pangkatOptions}
                error={formik.touched.pangkat_id ? formik.errors.pangkat_id : ''}
              />
            </div>
            <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4'>
              <Select
                required
                label="Jabatan"
                name="jabatan_id"
                value={jabatanOptions.find(option => option.value === formik.values.jabatan_id) || null}
                onChange={(option) => formik.setFieldValue('jabatan_id', option ? option.value : '')}
                options={jabatanOptions}
                error={formik.touched.jabatan_id ? formik.errors.jabatan_id : ''}
              />
              <Select
                required
                label="Departemen"
                name="departemen_id"
                value={departemenOptions.find(option => option.value === formik.values.departemen_id) || null}
                onChange={(option) => formik.setFieldValue('departemen_id', option ? option.value : '')}
                options={departemenOptions}
                error={formik.touched.departemen_id ? formik.errors.departemen_id : ''}
              />
            </div>
            <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4'>
              <Select
                required
                label="Divisi"
                name="divisi_id"
                value={divisiOptions.find(option => option.value === formik.values.divisi_id) || null}
                onChange={(option) => formik.setFieldValue('divisi_id', option ? option.value : '')}
                options={divisiOptions}
                error={formik.touched.divisi_id ? formik.errors.divisi_id : ''}
              />
              <Select
                required
                label="Unit"
                name="unit_id"
                value={unitOptions.find(option => option.value === formik.values.unit_id) || null}
                onChange={(option) => formik.setFieldValue('unit_id', option ? option.value : '')}
                options={unitOptions}
                error={formik.touched.unit_id ? formik.errors.unit_id : ''}
              />
            </div>
            <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4'>
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
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Pegawai;
