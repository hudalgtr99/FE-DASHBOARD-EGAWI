import React from 'react';
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
} from '@/constants';

const Keluarga = () => {
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isEdit = pk && pk !== 'add';

  const formik = useFormik({
    initialValues: {
      nama_ayah: state?.item?.nama_ayah,
      nama_ibu: state?.item?.nama_ibu,
      status_pernikahan: state?.item?.status_pernikahan,
      nama_pasangan: state?.item?.nama_pasangan,
      jumlah_anak: state?.item?.jumlah_anak,
      nama_anak: state?.item?.nama_anak,
      nama_kontak_emergency: state?.item?.nama_kontak_emergency,
      no_telepon_emergency: state?.item?.no_telepon_emergency,
    },
    validationSchema: Yup.object().shape({
      nama_ayah: Yup.string().required('Nama Ayah is required'),
      nama_ibu: Yup.string().required('Nama Ibu is required'),
      status_pernikahan: Yup.string().required('Status Pernikahan is required'),
      nama_kontak_emergency: Yup.string().required('Nama Kontak is required'),
      no_telepon_emergency: Yup.string().required('Nomor Telepon is required'),
    }),
    onSubmit: async (values) => {
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
          <h1>{isEdit ? 'Edit Data Keluarga' : 'Tambah Data Keluarga'}</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <div className='flex gap-4'>
              <TextField
                required
                label="Nama Ayah"
                name="nama_ayah"
                value={formik.values.nama_ayah}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nama_ayah ? formik.errors.nama_ayah : ''}
              />
              <TextField
                required
                label="Nama Ibu"
                name="nama_ibu"
                value={formik.values.nama_ibu}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nama_ibu ? formik.errors.nama_ibu : ''}
              />
            </div>
            <div className='flex gap-4'>
              <Select
                required
                label="Status Pernikahan"
                name="status_pernikahan"
                value={formik.values.status_pernikahan ? { value: formik.values.status_pernikahan, label: formik.values.status_pernikahan } : null}
                onChange={(option) => formik.setFieldValue('status_pernikahan', option ? option.value : '')}
                options={[
                  { value: 'belum menikah', label: 'Belum Menikah' },
                  { value: 'menikah', label: 'Menikah' },
                  { value: 'cerai hidup', label: 'Cerai Hidup' },
                  { value: 'cerai meninggal', label: 'Cerai Meninggal' },
                ]}
                error={formik.touched.status_pernikahan ? formik.errors.status_pernikahan : ''}
              />
              {formik.values.status_pernikahan === 'menikah' && (
                <TextField
                  label="Nama Pasangan"
                  name="nama_pasangan"
                  value={formik.values.nama_pasangan}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nama_pasangan ? formik.errors.nama_pasangan : ''}
                />
              )}
            </div>
            <div className='flex gap-4'>
              <TextField
                type="number" // Ensure input is treated as a number
                label="Jumlah Anak"
                name="jumlah_anak"
                value={formik.values.jumlah_anak}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.jumlah_anak ? formik.errors.jumlah_anak : ''}
              />
              {Number(formik.values.jumlah_anak) > 0 && (
                <TextField
                  label="Nama Anak"
                  name="nama_anak"
                  value={formik.values.nama_anak}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.nama_anak ? formik.errors.nama_anak : ''}
                />
              )}
            </div>
            <div className='flex gap-4'>
              <TextField
                required
                label="Nama Kontak Darurat"
                name="nama_kontak_emergency"
                value={formik.values.nama_kontak_emergency}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nama_kontak_emergency ? formik.errors.nama_kontak_emergency : ''}
              />
              <TextField
                required
                label="Nomor Telepon Darurat"
                name="no_telepon_emergency"
                value={formik.values.no_telepon_emergency}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.no_telepon_emergency ? formik.errors.no_telepon_emergency : ''}
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

export default Keluarga;
