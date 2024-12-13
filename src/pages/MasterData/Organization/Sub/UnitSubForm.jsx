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
  const [divisiAll, setDivisiAll] = useState([]);
  const [selectedDepartemen, setSelectedDepartemen] = useState(null); // State untuk menyimpan departemen yang dipilih

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
          departemenId: item.departemen.pk, // Simpan id departemen untuk digunakan nanti
        }))
      );
      setDivisiAll(
        response.data.divisi.map((item) => ({
          value: item.pk,
          label: item.nama,
          departemenId: item.departemen.pk, // Simpan id departemen untuk digunakan nanti
        }))
      );
    };
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      nama: state?.item?.nama,
      divisi: state?.item?.divisi?.pk || '', // Pastikan untuk menyesuaikan dengan format state
      departemen: state?.item?.divisi?.departemen?.pk || ''
    },
    validationSchema: Yup.object().shape({
      nama: Yup.string().required("Nama Unit wajib diisi").max(255, "Nama Unit harus kurang dari 255 karakter"),
      divisi: Yup.string().required("Nama Divisi wajib diisi"),
      departemen: Yup.string().required('Nama Departemen wajib diisi'),
    }),
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await updateData(
            { dispatch, redux: unitReducers },
            {
              pk: pk,
              nama: values.nama,
              divisi_id: values.divisi,
              departemen_id: values.departemen
            },
            API_URL_edelunit,
            'UPDATE_UNIT'
          );
        } else {
          await addData(
            { dispatch, redux: unitReducers },
            {
              nama: values.nama,
              divisi_id: values.divisi,
              departemen_id: values.departemen
            },
            API_URL_createunit,
            'ADD_UNIT'
          );
        }
        navigate("/masterdata/organization");
      } catch (error) {
        console.error('Error in form submission: ', error);
      }
    }
  });

  // Handler untuk mengubah departemen
  const handleDepartemenChange = (option) => {
    setSelectedDepartemen(option ? option.value : null); // Simpan departemen yang dipilih
    formik.setFieldValue('departemen', option ? option.value : '');
    formik.setFieldValue('divisi', ''); // Reset divisi saat departemen berubah
  };

  // Filter divisi berdasarkan departemen yang dipilih
  const filteredDivisiOptions = selectedDepartemen 
  ? (divisiOptions || []).filter(divisi => divisi.departemenId === selectedDepartemen) 
  : (formik.values.divisi 
      ? (divisiOptions || []).filter(divisi => divisi.value === formik.values.divisi)
      : []);

  console.log("divisi:", divisiOptions);

  return (
    <div>
      <Container>
        <div className='flex items-center gap-2 mb-4'>
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate("/masterdata/organization")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>{isEdit ? 'Edit Unit' : 'Tambah Unit'}</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <Select
              required
              label="Nama Departemen"
              name="departemen"
              value={departemenOptions.find(option => option.value === formik.values.departemen) || null}
              onChange={handleDepartemenChange} // Update handler untuk departemen
              options={departemenOptions}
              error={formik.touched.departemen ? formik.errors.departemen : ''}
            />
            <Select
              required
              label="Nama Divisi"
              name="divisi"
              value={filteredDivisiOptions.find(option => option.value === formik.values.divisi) || null}
              onChange={(option) => formik.setFieldValue('divisi', option ? option.value : '')}
              options={filteredDivisiOptions}
              error={formik.touched.divisi ? formik.errors.divisi : ''}
            />
            <TextField
              required
              label="Nama Unit"
              name="nama"
              value={formik.values.nama}
              onChange={formik.handleChange}
              onBlur={(e) => formik.handleBlur}
              error={formik.touched.nama ? formik.errors.nama : ''}
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
