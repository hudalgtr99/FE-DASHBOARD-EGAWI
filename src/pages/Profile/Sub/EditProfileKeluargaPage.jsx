import { isAuthenticated } from "@/authentication/authenticationApi";
import { Button, Container, TextField, Select } from "@/components";
import { updateData, handleInputError } from "@/actions";
import { API_URL_edeluser, API_URL_getmasterpegawai } from "@/constants";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { pegawaiReducer } from "@/reducers/kepegawaianReducers";
import { useFormik } from "formik";
import { IoMdReturnLeft } from "react-icons/io";
import * as Yup from "yup";
import { FaTimes, FaPlus } from "react-icons/fa";
import Swal from 'sweetalert2';

const EditProfileKeluargaPage = () => {
  const { addPegawaiResult, addPegawaiLoading } = useSelector(
    (state) => state.kepegawaian
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const handleInputError = (values) => {
    // Validate values and handle errors as needed
    // Example logic, replace with your own
    if (!values || typeof values !== 'object') {
      console.error("Invalid input values:", values);
      return {}; // Return an empty object or handle as needed
    }

    // Your processing logic here
    const processedValues = Object.entries(values).map(([key, value]) => {
      return { key, value }; // Adjust according to your needs
    });

    return processedValues; // Ensure you return a defined value
  };

  // Check if location.state and location.state.data exist, fallback to empty object if not
  const initialData = location.state?.data;

  // console.log(initialData)

  const formik = useFormik({
    initialValues: {
      nama_ayah: initialData.nama_ayah || "",
      nama_ibu: initialData.nama_ibu || "",
      status_pernikahan: initialData.status_pernikahan || "",
      nama_pasangan: initialData.nama_pasangan || "",
      anak: initialData.anak || "",
      nama_anak: Array.isArray(initialData.nama_anak) ? initialData.nama_anak : [],
      nama_kontak_emergency: initialData.nama_kontak_emergency || "",
      no_telepon_emergency: initialData.no_telepon_emergency || "",
    },
    validationSchema: Yup.object({
      nama_ayah: Yup.string().required('Nama Ayah is required'),
      nama_ibu: Yup.string().required('Nama Ibu is required'),
      status_pernikahan: Yup.string().required('Status Pernikahan is required'),
      nama_kontak_emergency: Yup.string().required('Nama Kontak is required'),
      no_telepon_emergency: Yup.string().required('Nomor Telepon is required'),
      anak: Yup.number().min(0, 'Jumlah Anak must be 0 or more').required('Jumlah Anak is required'),
    }),
    onSubmit: (values) => {
      const newInput = handleInputError(values);
      console.log("New Input:", newInput); // Check this output

      if (isAuthenticated().user_id) {
        updateData(
          { dispatch, redux: pegawaiReducer },
          {
            pk: "datakeluarga",
            user_id: isAuthenticated().user_id,
            ...newInput,
          },
          API_URL_edeluser,
          "ADD_PEGAWAI"
        );
      }
    },
  });

  useEffect(() => {
    if (addPegawaiResult) {
      dispatch(
        pegawaiReducer({
          type: "ADD_PEGAWAI",
          payload: {
            loading: false,
            data: false,
          },
        })
      );
      navigate("/profil");
    }
  }, [addPegawaiResult, dispatch, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddChild = () => {
    if (formik.values.nama_anak.length < formik.values.anak) {
      formik.setFieldValue('nama_anak', [...formik.values.nama_anak, '']);
    } else {
      Toast.fire({
        icon: "error",
        title: "Jumlah anak sudah sesuai!"
      });
    }
  };

  const handleRemoveChild = (index) => {
    const updatedAnak = formik.values.nama_anak.filter((_, i) => i !== index);
    formik.setFieldValue('nama_anak', updatedAnak);
  };

  const handleChangeChildName = (index, event) => {
    const updatedAnak = formik.values.nama_anak.map((name, i) =>
      i === index ? event.target.value : name
    );
    formik.setFieldValue('nama_anak', updatedAnak);
  };


  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate(-1)} // Go back to the previous page
          >
            <IoMdReturnLeft />
          </button>
          <h1>Edit Data Keluarga</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className="sm:grid sm:grid-cols-2 sm:gap-4 max-[640px]:space-y-4">
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
          <Select
            required
            label="Status Pernikahan"
            name="status_pernikahan"
            value={
              formik.values.status_pernikahan
                ? { value: formik.values.status_pernikahan, label: formik.values.status_pernikahan }
                : null
            }
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
          <TextField
            type="number"
            label="Jumlah Anak"
            name="anak"
            value={formik.values.anak}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.anak ? formik.errors.anak : ''}
          />
          {Number(formik.values.anak) > 0 && (
            <div>
              <div className='flex justify-between'>
                <label className="text-sm font-medium">Nama Anak</label>
                <div className='flex gap-2 items-center cursor-pointer'>
                  {formik.values.nama_anak.length > 0 && (
                    <div>
                      {formik.values.nama_anak.length > 1 && (
                        <button
                          type="button"
                          className='bg-gray-200 p-1 rounded-lg'
                          onClick={() => handleRemoveChild(formik.values.nama_anak.length - 1)}
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  )}
                  <div>
                    <button type="button" className='bg-gray-200 p-1 rounded-lg' onClick={handleAddChild}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
              <div>
                {formik.values.nama_anak.map((name, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-2">
                    <TextField
                      label={`Anak Ke-${index + 1}`}
                      name={`nama_anak_${index}`}
                      value={name}
                      onChange={(e) => handleChangeChildName(index, e)}
                      onBlur={formik.handleBlur}
                      error={formik.touched.nama_anak ? formik.errors.nama_anak?.[index] : ''}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
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
          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={addPegawaiLoading}>
              Simpan
            </Button>
          </div>
        </form>
      </Container>
    </div >
  );
};

export default EditProfileKeluargaPage;
