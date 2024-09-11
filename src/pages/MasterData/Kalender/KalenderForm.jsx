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
} from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { addData, updateData } from '@/actions';
import { API_URL_createdepartemen, API_URL_edeldepartemen } from '@/constants';

const KalenderForm = () => {
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isEdit = pk && pk !== 'add';

  const formik = useFormik({
    initialValues: {
      nama: state?.item?.nama,
    },
    validationSchema: Yup.object().shape({
      nama: Yup.string().required("Nama Departemen is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateData(
            { dispatch, redux: departemenReducers },
            { pk: pk, ...values },
            API_URL_edeldepartemen,
            'UPDATE_DEPARTEMEN'
          );
        } else {
          await addData(
            { dispatch, redux: departemenReducers },
            values,
            API_URL_createdepartemen,
            'ADD_DEPARTEMEN'
          );
        }
        navigate('/masterdata/kalender');
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
            onClick={() => navigate("/masterdata/kalender")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>{isEdit ? 'Edit Departemen' : 'Tambah Departemen'}</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <TextField
              required
              label="Nama Departemen"
              name="nama"
              value={formik.values.nama}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nama ? formik.errors.nama : ''}
            />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default KalenderForm;
