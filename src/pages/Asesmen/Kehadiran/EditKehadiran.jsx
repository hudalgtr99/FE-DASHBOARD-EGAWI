import {
  Button,
  Container,
} from "@/components";
import React from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { updateFormData } from "@/actions";
import { API_URL_createabsensi } from "@/constants";
import { useNavigate } from "react-router-dom";

const EditKehadiran = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

      const formData = new FormData();
      formData.append("waktu", values.tanggal);
      formData.append("tipe_absen", values.tipe_absen);
      formData.append("lokasi", JSON.stringify(locationNow));
      formData.append("image", values.gambar);

      updateFormData(
        { dispatch },
        formData,
        API_URL_createabsensi,
        "ADD_ABSENSI",
        user_id // Pass user ID if needed
      );
      navigate(-1); // Go back after submission
    },
  });

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue('gambar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Kehadiran</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Tanggal</label>
          <input
            type="date"
            name="tanggal"
            value={formik.values.tanggal}
            onChange={formik.handleChange}
            className="input mb-4 border rounded-lg p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Tipe Absen</label>
          <input
            type="text"
            name="tipe_absen"
            value={formik.values.tipe_absen}
            onChange={formik.handleChange}
            className="input mb-4 border rounded-lg p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Latitude</label>
          <input
            type="text"
            name="latitude"
            value={formik.values.latitude}
            onChange={formik.handleChange}
            className="input mb-4 border rounded-lg p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Longitude</label>
          <input
            type="text"
            name="longitude"
            value={formik.values.longitude}
            onChange={formik.handleChange}
            className="input mb-4 border rounded-lg p-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Gambar</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="input mb-4 border rounded-lg p-2 w-full"
          />
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
