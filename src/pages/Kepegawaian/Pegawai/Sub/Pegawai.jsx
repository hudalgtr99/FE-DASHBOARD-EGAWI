import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoMdReturnLeft } from "react-icons/io";
import {
  Button,
  Container,
  TextField,
  Select,
} from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { addData, updateData } from '@/actions';
import { pegawaiReducer } from '@/reducers/kepegawaianReducers';
import {
  API_URL_createuser,
  API_URL_edeluser,
  API_URL_getcabang,
  API_URL_getdatapegawai,
  API_URL_getmasterpegawai,
} from '@/constants';
import axiosAPI from "@/authentication/axiosApi";

const Pegawai = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pangkatOptions, setPangkatOptions] = useState([]);
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [departemenOptions, setDepartemenOptions] = useState([]);
  const [divisiOptions, setDivisiOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  const { getPegawaiResult } = useSelector(state => state.kepegawaian);
  const [initialValues, setInitialValues] = useState({
    nama: "",
    pangkat: "",
    jabatan: "",
    departemen: "",
    divisi: "",
    unit: "",
    tgl_bergabung: "",
    tgl_resign: "",
  });
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object({
    nama: Yup.string().required("Nama is required"),
    pangkat: Yup.string().required("Pangkat is required"),
    jabatan: Yup.string().required("Jabatan is required"),
    departemen: Yup.string().required("Departemen is required"),
    divisi: Yup.string().required("Divisi is required"),
    unit: Yup.string().required("Unit is required"),
    tgl_bergabung: Yup.date().required("Tanggal Bergabung is required"),
  });

  const isEdit = pk && pk !== 'add';

  useEffect(() => {
    if (isEdit && getPegawaiResult?.results) {
      const foundPegawai = getPegawaiResult.results.find(item => item.pk === parseInt(pk, 10));
      if (foundPegawai) {
        setInitialValues({
          id_pegawai: foundPegawai.id_pegawai || "",
          nama: foundPegawai.nama || "",
          pangkat: foundPegawai.pangkat?.id || "",
          jabatan: foundPegawai.jabatan?.id || "",
          departemen: foundPegawai.departemen?.id || "",
          divisi: foundPegawai.divisi?.id || "",
          unit: foundPegawai.unit?.id || "",
          tgl_bergabung: foundPegawai.tgl_bergabung || "",
          tgl_resign: foundPegawai.tgl_resign || "",
        });
      }
    }
    setLoading(false);
  }, [isEdit, pk, getPegawaiResult]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
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

  if (loading) {
    return <div>Loading...</div>;
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
          <h1>{isEdit ? 'Edit Data Pegawai' : 'Add Data Pegawai'}</h1>
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
            <Select
              label="Pangkat"
              name="pangkat"
              value={formik.values.pangkat}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.pangkat ? formik.errors.pangkat : ''}
              options={pangkatOptions.map(option => ({ value: option.id, label: option.nama }))}
            />
            <Select
              label="Jabatan"
              name="jabatan"
              value={formik.values.jabatan}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.jabatan ? formik.errors.jabatan : ''}
              options={jabatanOptions.map(option => ({ value: option.id, label: option.nama }))}
            />
            <Select
              label="Departemen"
              name="departemen"
              value={formik.values.departemen}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.departemen ? formik.errors.departemen : ''}
              options={departemenOptions.map(option => ({ value: option.id, label: option.nama }))}
            />
            <Select
              label="Divisi"
              name="divisi"
              value={formik.values.divisi}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.divisi ? formik.errors.divisi : ''}
              options={divisiOptions.map(option => ({ value: option.id, label: option.nama }))}
            />
            <Select
              label="Unit"
              name="unit"
              value={formik.values.unit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.unit ? formik.errors.unit : ''}
              options={unitOptions.map(option => ({ value: option.id, label: option.nama }))}
            />
            <TextField
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
              error={formik.touched.tgl_resign ? formik.errors.tgl_resign : ''}
            />
            <Button type="submit" text="Submit" className="bg-[#7367f0] text-white rounded-md p-2 shadow-lg" />
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Pegawai;
