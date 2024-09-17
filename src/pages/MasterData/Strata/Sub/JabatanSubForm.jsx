import React from 'react';
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
import { useDispatch } from 'react-redux';
import { addData, updateData } from '@/actions';
import { jabatanReducers } from '@/reducers/strataReducers';
import { API_URL_createjabatan, API_URL_edeljabatan } from '@/constants';

const JabatanSubForm = () => {
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isEdit = pk && pk !== 'add';

  const formik = useFormik({
    initialValues: {
      nama: state?.item?.nama,
      keterangan: state?.item?.keterangan,
    },
    validationSchema: Yup.object().shape({
      nama: Yup.string().required("Nama Jabatan is required"),
    }),
    onSubmit: async (values) => {
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
    },
  });

  return (
    <div>
      <Container>
        <div className='flex items-center gap-2 mb-4'>
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-blue-500 text-white rounded-full shadow hover:shadow-lg transition-all"
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
            <div className="mt-6 flex justify-end">
              <Button type="submit">{isEdit ? "Simpan" : "Tambah"}</Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default JabatanSubForm;
