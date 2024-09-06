import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, Select } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { addData, updateData } from '@/actions';
import { unitReducers } from '@/reducers/organReducers';
import { API_URL_createunit, API_URL_edelunit, API_URL_getmasterpegawai } from '@/constants';
import axiosAPI from "@/authentication/axiosApi";

const UnitSubForm = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [departemenOptions, setDepartemenOptions] = useState([]);
  const [divisiOptions, setDivisiOptions] = useState([]);
  const { getUnitResult } = useSelector(state => state.organ);
  const [initialValues, setInitialValues] = useState({
    nama_unit: '',
    divisi: '',
    departemen: '',
  });
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object().shape({
    nama_unit: Yup.string().required("Nama Unit is required"),
    divisi: Yup.string().required("Nama Departemen is required"),
    departemen: Yup.string().required('Departemen is required'),
  });

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

  useEffect(() => {
    if (isEdit && getUnitResult?.results) {
      const foundUnit = getUnitResult.results.find(item => item.pk === parseInt(pk, 10));
      if (foundUnit) {
        setInitialValues({
          nama_unit: foundUnit.nama_unit || '',
          divisi: foundUnit.divisi || '',
          departemen: foundUnit.departemen || '',
        });
      }
    }
    setLoading(false); // Data fetching complete
  }, [isEdit, pk, getUnitResult]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // This ensures formik will update when initialValues change
    validationSchema,
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
          <h1>{isEdit ? 'Edit Unit' : 'Add Unit'}</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <TextField
              label="Nama Unit"
              name="nama_unit"
              value={formik.values.nama_unit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nama_unit ? formik.errors.nama_unit : ''}
            />
            <Select
              label="Nama Departemen"
              name="departemen"
              value={departemenOptions.find(option => option.value === formik.values.departemen) || null}
              onChange={(option) => formik.setFieldValue('departemen', option ? option.value : '')}
              options={departemenOptions}
              error={formik.touched.departemen ? formik.errors.departemen : ''}
            />
            <Select
              label="Nama Divisi"
              name="divisi"
              value={divisiOptions.find(option => option.value === formik.values.divisi) || null}
              onChange={(option) => formik.setFieldValue('divisi', option ? option.value : '')}
              options={divisiOptions}
              error={formik.touched.divisi ? formik.errors.divisi : ''}
            />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default UnitSubForm;
