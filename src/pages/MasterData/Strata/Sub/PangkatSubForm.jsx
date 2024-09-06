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
} from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { addData, updateData } from '@/actions';
import { pangkatReducers } from '@/reducers/strataReducers';
import { API_URL_createpangkat, API_URL_edelpangkat } from '@/constants';

const PangkatSubForm = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getPangkatResult } = useSelector(state => state.strata);
  const [initialValues, setInitialValues] = useState({
    nama: '',
    grade: '',
    level: '',
    keterangan: '',
  });
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object({
    nama: Yup.string().required('Nama Pangkat is required'),
    grade: Yup.string().required('Grade is required'),
    level: Yup.number()
      .typeError('Level must be a number')
      .required('Level is required')
      .positive('Level must be a positive number')
      .integer('Level must be an integer'),
    keterangan: Yup.string(),
  });

  const isEdit = pk && pk !== 'add';

  useEffect(() => {
    if (isEdit && getPangkatResult?.results) {
      const foundPangkat = getPangkatResult.results.find(item => item.pk === parseInt(pk, 10));
      if (foundPangkat) {
        setInitialValues({
          nama: foundPangkat.nama || '',
          grade: foundPangkat.grade || '',
          level: foundPangkat.level || '',
          keterangan: foundPangkat.keterangan || '',
        });
      }
    }
    setLoading(false); // Data fetching complete
  }, [isEdit, pk, getPangkatResult]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // This ensures formik will update when initialValues change
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateData(
            { dispatch, redux: pangkatReducers },
            { pk: pk, ...values },
            API_URL_edelpangkat,
            'UPDATE_PANGKAT'
          );
        } else {
          await addData(
            { dispatch, redux: pangkatReducers },
            values,
            API_URL_createpangkat,
            'ADD_PANGKAT'
          );
        }
        navigate('/masterdata/strata');
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
            onClick={() => navigate("/masterdata/strata")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>{isEdit ? 'Edit Pangkat' : 'Add Pangkat'}</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <TextField
              label="Nama Pangkat"
              name="nama"
              value={formik.values.nama}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nama ? formik.errors.nama : ''}
            />
            <TextField
              label="Grade"
              name="grade"
              value={formik.values.grade}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.grade ? formik.errors.grade : ''}
            />
            <TextField
              label="Level"
              name="level"
              value={formik.values.level}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.level ? formik.errors.level : ''}
            />
            <TextArea
              label="Keterangan"
              name="keterangan"
              value={formik.values.keterangan}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.keterangan ? formik.errors.keterangan : ''}
            />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default PangkatSubForm;
