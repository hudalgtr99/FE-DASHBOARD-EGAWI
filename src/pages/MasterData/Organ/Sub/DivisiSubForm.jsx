import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, Select } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { addData, updateData } from '@/actions';
import { divisiReducers } from '@/reducers/organReducers';
import { API_URL_createdivisi, API_URL_edeldivisi, API_URL_getspesifikdepartemen } from '@/constants';
import axiosAPI from "@/authentication/axiosApi";

const DivisiSubForm = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [departemenOptions, setDepartemenOptions] = useState([]);
  const { getDivisiResult } = useSelector(state => state.organ);
  const [initialValues, setInitialValues] = useState({
    nama: '',
    departemen: '',
  });
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object().shape({
    nama: Yup.string().required("Nama Divisi is required"),
    departemen: Yup.string().required("Nama Departemen is required"),
  });

  const isEdit = pk && pk !== 'add';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAPI.get(API_URL_getspesifikdepartemen);
        setDepartemenOptions(response.data.map((item) => ({
          value: String(item.pk), // Convert pk to a string
          label: item.nama,
        })));
      } catch (error) {
        console.error('Error fetching departemen options: ', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isEdit && getDivisiResult?.results) {
      const foundDivisi = getDivisiResult.results.find(item => item.pk === parseInt(pk, 10));
      if (foundDivisi) {
        setInitialValues({
          nama: foundDivisi.nama || '',
          departemen: foundDivisi.departemen || '',
        });
      }
    }
    setLoading(false); // Data fetching complete
  }, [isEdit, pk, getDivisiResult]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // This ensures formik will update when initialValues change
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateData(
            { dispatch, redux: divisiReducers },
            {
              pk: pk, // Ensure pk is an integer
              nama: values.nama,
              departemen_id: values.departemen,
            },
            API_URL_edeldivisi,
            'UPDATE_DIVISI'
          );
        } else {
          await addData(
            { dispatch, redux: divisiReducers },
            { nama: values.nama, departemen_id: values.departemen },
            API_URL_createdivisi,
            'ADD_DIVISI'
          );
        }
        navigate('/masterdata/organ');
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
            onClick={() => navigate("/masterdata/organ")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>{isEdit ? 'Edit Divisi' : 'Tambah Divisi'}</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <TextField
              required
              label="Nama Divisi"
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
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default DivisiSubForm;
