import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, Select } from '@/components';
import { useDispatch } from 'react-redux';
import { addData, updateData } from '@/actions';
import { unitReducers } from '@/reducers/organReducers';
import { API_URL_createunit, API_URL_edelunit, API_URL_getmasterpegawai } from '@/constants';
import axiosAPI from "@/authentication/axiosApi";

const UnitSubForm = () => {
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [departemenOptions, setDepartemenOptions] = useState([]);
  const [divisiOptions, setDivisiOptions] = useState([]);

  const isEdit = pk && pk !== 'add';

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosAPI.get(API_URL_getmasterpegawai);
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
    };
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      nama: state?.item?.nama,
      divisi: state?.item?.divisi.id,
      departemen: state?.item?.divisi.departemen.id
    },
    validationSchema: Yup.object().shape({
      nama: Yup.string().required("Nama Unit is required"),
      divisi: Yup.string().required("Nama Divisi is required"),
      departemen: Yup.string().required('Nama Departemen is required'),
    }),
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateData(
            { dispatch, redux: unitReducers },
            {
              pk: pk, // Ensure pk is an integer
              nama: values.nama_unit, // Adjusted field name to match API expectations
              divisi_id: values.divisi,
              departemen_id: values.departemen // Ensure the field name matches what the API expects
            },
            API_URL_edelunit,
            'UPDATE_UNIT'
          );
        } else {
          await addData(
            { dispatch, redux: unitReducers },
            {
              nama: values.nama_unit, // Adjusted field name to match API expectations
              divisi_id: values.divisi,
              departemen_id: values.departemen // Ensure the field name matches what the API expects
            },
            API_URL_createunit,
            'ADD_UNIT'
          );
        }
        navigate('/masterdata/organ');
      } catch (error) {
        console.error('Error in form submission: ', error);
      }
    }
  });

  return (
    <div>
      <Container>
        <div className='flex items-center gap-2 mb-4'>
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#7367f0] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate("/masterdata/organ")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>{isEdit ? 'Edit Unit' : 'Tambah Unit'}</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <TextField
              required
              label="Nama Unit"
              name="nama"
              value={formik.values.nama}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nama ? formik.errors.nama : ''}
            />
            <Select
              required
              label="Nama Departemen"
              name="departemen"
              value={departemenOptions.find(option => option.value === formik.values.departemen) || null}
              onChange={(option) => formik.setFieldValue('departemen', option ? option.value : '')}
              options={departemenOptions}
              error={formik.touched.departemen ? formik.errors.departemen : ''}
            />
            <Select
              required
              label="Nama Divisi"
              name="divisi"
              value={divisiOptions.find(option => option.value === formik.values.divisi) || null}
              onChange={(option) => formik.setFieldValue('divisi', option ? option.value : '')}
              options={divisiOptions}
              error={formik.touched.divisi ? formik.errors.divisi : ''}
            />
            <div className="mt-6 flex justify-end">
              <Button type="submit">{isEdit ? "Simpan" : "Tambah"}</Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default UnitSubForm;
