import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosAPI from '@/authentication/axiosApi';
import moment from 'moment';
import {
  API_URL_exportexcelkehadiran
} from '@/constants';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
} from '@/components';
import { IoMdReturnLeft } from 'react-icons/io';

const ExportKehadiran = () => {
  const navigate = useNavigate();

  // Formik initial values and validation schema
  const formik = useFormik({
    initialValues: {
      start_date: '',
      end_date: ''
    },
    validationSchema: Yup.object({
      start_date: Yup.date().required('Dari Tanggal harus diisi'),
      end_date: Yup.date().required('Sampai Tanggal harus diisi')
    }),
    onSubmit: (values, { setSubmitting }) => {
      const start = moment(values.start_date).format('DD-MM-YYYY');
      const end = moment(values.end_date).format('DD-MM-YYYY');

      axiosAPI({
        url: API_URL_exportexcelkehadiran,
        method: 'POST',
        data: values,
        responseType: 'blob'
      })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `Data Absensi Pegawai QNN ${start} - ${end}.xls`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          navigate('/asesmen/kehadiran');  // Redirect back to the main page after download
        })
        .finally(() => setSubmitting(false));
    }
  });

  return (
    <div>
      <Container>
        <div className='flex items-center gap-2 mb-4'>
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate("/asesmen/kehadiran")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>Export Excel Kehadiran</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className='space-y-6'>
          <TextField
            required
            label="Dari Tanggal"
            name="start_date"
            type="date"
            value={formik.values.start_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.start_date ? formik.errors.start_date : ''}
          />
          <TextField
            required
            label="Sampai Tanggal"
            name="end_date"
            type="date"
            value={formik.values.end_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.end_date ? formik.errors.end_date : ''}
          />
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Processing...' : 'Submit'}
            </Button >
          </div>
        </form>
      </Container>
    </div>
  );
};

export default ExportKehadiran;
