import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { addData } from '@/actions';
import { kalenderReducer } from '@/reducers/kalenderReducers';
import { API_URL_createkalender } from '@/constants';

const KalenderForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      nama_event: "",
      tgl_mulai: "",
      tgl_berakhir: "",
      type_event: "",
    },
    validationSchema: Yup.object().shape({
      nama_event: Yup.string().required("Nama Event is required"),
      tgl_mulai: Yup.date().required("Tanggal Mulai is required"),
      tgl_berakhir: Yup.date().required("Tanggal Berakhir is required"),
      type_event: Yup.string().required("Type Event is required"),
    }),
    onSubmit: async (values) => {
      // Creating the payload as requested
      const payload = {
        title: values.nama_event,
        start_date: values.tgl_mulai,
        end_date: values.tgl_berakhir,
        is_national_holiday: Boolean(values.type_event === 'Libur'),
      };

      // Use the payload in the addData function
      await addData(
        { dispatch, redux: kalenderReducer },
        payload,
        API_URL_createkalender,
        'ADD_KALENDER'
      );
      navigate('/masterdata/kalender');
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
          <h1>Tambah Event</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <TextField
              required
              label="Nama Event"
              name="nama_event"
              value={formik.values.nama_event}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nama_event ? formik.errors.nama_event : ''}
            />
            <TextField
              required
              type="date"
              label="Tanggal Mulai"
              name="tgl_mulai"
              value={formik.values.tgl_mulai}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tgl_mulai ? formik.errors.tgl_mulai : ''}
            />
            <TextField
              required
              type="date"
              label="Tanggal Berakhir"
              name="tgl_berakhir"
              value={formik.values.tgl_berakhir}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.tgl_berakhir ? formik.errors.tgl_berakhir : ''}
            />
            <Select
              required
              label="Type Event"
              name="type_event"
              value={formik.values.type_event ? { value: formik.values.type_event, label: formik.values.type_event } : null}
              onChange={(option) => formik.setFieldValue('type_event', option ? option.value : '')}
              options={[
                { value: 'Libur', label: 'Libur' },
                { value: 'Event', label: 'Event' },
              ]}
              error={formik.touched.type_event ? formik.errors.type_event : ''}
            />
            <Button type="submit">Submit</Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default KalenderForm;
