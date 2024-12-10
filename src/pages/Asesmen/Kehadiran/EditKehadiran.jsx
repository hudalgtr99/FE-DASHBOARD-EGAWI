import {
  Button,
  Container,
  TextField,
  Select,
} from "@/components";
import React from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { updateFormData } from "@/actions";
import { API_URL_createabsensi } from "@/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdReturnLeft } from "react-icons/io";
import { userReducer } from "@/reducers/authReducers";

const EditKehadiran = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik({
    initialValues: {
      tanggal: '',
      tipe_absen: '',
      latitude: '',
      longitude: '',
      gambar: '',
    },
    onSubmit: (values) => {
      const locationNow = {
        latitude: values.latitude,
        longitude: values.longitude,
      };

      const formData = {
        waktu: values.tanggal,
        tipe_absen: values.tipe_absen,
        lokasi: JSON.stringify(locationNow),
        image: values.gambar, // This is the base64 encoded string
      };

      updateFormData(
        { dispatch, redux: userReducer },
        formData,
        API_URL_createabsensi,
        "ADD_ABSENSI",
        location.state.user_id
      );
      navigate(-1); // Go back after submission
    },
  });

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      console.log("Uploaded file type:", file.type); 
      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue('gambar', reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      formik.setFieldValue('gambar', '');
    }
  };

  return (
    <Container>
      <div className='flex items-center gap-2 mb-4'>
        <button
          className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
          onClick={() => navigate(-1)}
        >
          <IoMdReturnLeft />
        </button>
        <h1>Edit Kehadiran</h1>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <TextField
          required
          label="Tanggal"
          name="tanggal"
          type="date"
          value={formik.values.tanggal}
          onChange={formik.handleChange}
          onBlur={(e) => formik.handleBlur}
          error={formik.touched.tanggal ? formik.errors.tanggal : ''}
        />
        <Select
          required
          label="Tipe Absen"
          name="tipe_absen"
          value={formik.values.tipe_absen ? { value: formik.values.tipe_absen, label: formik.values.tipe_absen } : null}
          onChange={(option) => formik.setFieldValue('tipe_absen', option ? option.value : '')}
          options={[
            { label: "Masuk", value: "masuk" },
            { label: "Keluar", value: "keluar" },
          ]}
          error={formik.touched.tipe_absen ? formik.errors.tipe_absen : ''}
        />
        <TextField
          required
          label="Latitude"
          name="latitude"
          value={formik.values.latitude}
          onChange={formik.handleChange}
          onBlur={(e) => formik.handleBlur}
          error={formik.touched.latitude ? formik.errors.latitude : ''}
        />
        <TextField
          required
          label="Longitude"
          name="longitude"
          value={formik.values.longitude}
          onChange={formik.handleChange}
          onBlur={(e) => formik.handleBlur}
          error={formik.touched.longitude ? formik.errors.longitude : ''}
        />
        <div>
          <label className="block text-sm font-normal mb-2">Gambar</label>
          <input
            name="gambar"
            type="file"
            accept="image/*" // You can limit the accepted file types here
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 
                      file:mr-4 file:py-2 file:px-4 
                      file:rounded-full file:border-0 
                      file:text-sm file:font-semibold 
                      file:bg-blue-500 file:text-white 
                      hover:file:bg-blue-600" // Styling the file input
          />
          {formik.touched.gambar && formik.errors.gambar ? (
            <div className="text-red-600 text-sm">{formik.errors.gambar}</div>
          ) : null}
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Simpan
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default EditKehadiran;
