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
import { jabatanReducers } from '@/reducers/strataReducers';
import { API_URL_createjabatan, API_URL_edeljabatan } from '@/constants';

const JabatanSubForm = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getJabatanResult } = useSelector(state => state.strata);
  const [initialValues, setInitialValues] = useState({
    nama: '',
    keterangan: '',
  });
  const [loading, setLoading] = useState(true);

  const validationSchema = Yup.object().shape({
    nama: Yup.string().required("Nama Jabatan is required"),
    keterangan: Yup.string(),
  });

  const isEdit = pk && pk !== 'add';

  useEffect(() => {
    if (isEdit && getJabatanResult?.results) {
      const foundJabatan = getJabatanResult.results.find(item => item.pk === parseInt(pk, 10));
      if (foundJabatan) {
        setInitialValues({
          nama: foundJabatan.nama || '',
          keterangan: foundJabatan.keterangan || '',
        });
      }
    }
    setLoading(false); // Data fetching complete
  }, [isEdit, pk, getJabatanResult]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // This ensures formik will update when initialValues change
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateData(
            { dispatch, redux: jabatanReducers },
            { pk: pk, ...values },
            API_URL_edeljabatan,
            'UPDATE_JABATAN'
          );
        } else {
          await addData(
            { dispatch, redux: jabatanReducers },
            values,
            API_URL_createjabatan,
            'ADD_JABATAN'
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
          <h1>{isEdit ? 'Edit Jabatan' : 'Tambah Jabatan'}</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <TextField
              required
              label="Nama Jabatan"
              name="nama"
              value={formik.values.nama}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nama ? formik.errors.nama : ''}
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

export default JabatanSubForm;
