import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { perusahaanReducer } from "@/reducers/perusahaanReducers";
import { addData, updateData } from "@/actions";
import {
  API_URL_createperusahaan,
  API_URL_edelperusahaan,
  API_URL_updateprofileperusahaan,
} from "@/constants";
import { Container, TextField, Button } from "@/components";
import { IoMdReturnLeft } from "react-icons/io";
import { updateProfile } from "@/actions/auth";
import { TbBuilding, TbPhotoPlus } from "react-icons/tb";
import { Avatar } from "../../../components";

const perusahaanForm = () => {
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const coordinates = JSON.parse(state?.item?.cordinate || "{}");
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const isEdit = pk && pk !== "add";
  const jadwal = isEdit ? JSON.parse(state?.item?.jadwal || "{}") : {};

  const formik = useFormik({
    initialValues: {
      nama: state?.item?.nama || "",
      namaSingkatan: state?.item?.nama_singkatan || "",
      no_telepon: state?.item?.no_telepon || "",
      latitude: coordinates.latitude || "",
      longitude: coordinates.longitude || "",
      radius: state?.item?.radius || 25,
      image: state?.item?.image || "",
      senin_masuk: jadwal?.senin?.masuk || "08:00",
      senin_keluar: jadwal?.senin?.keluar || "17:00",
      selasa_masuk: jadwal?.selasa?.masuk || "08:00",
      selasa_keluar: jadwal?.selasa?.keluar || "17:00",
      rabu_masuk: jadwal?.rabu?.masuk || "08:00",
      rabu_keluar: jadwal?.rabu?.keluar || "17:00",
      kamis_masuk: jadwal?.kamis?.masuk || "08:00",
      kamis_keluar: jadwal?.kamis?.keluar || "17:00",
      jumat_masuk: jadwal?.jumat?.masuk || "08:00",
      jumat_keluar: jadwal?.jumat?.keluar || "17:00",
      sabtu_masuk: jadwal?.sabtu?.masuk || "00:00",
      sabtu_keluar: jadwal?.sabtu?.keluar || "00:00",
      minggu_masuk: jadwal?.minggu?.masuk || "00:00",
      minggu_keluar: jadwal?.minggu?.keluar || "00:00",
    },
    validationSchema: Yup.object().shape({
      nama: Yup.string()
        .required("Nama wajib diisi")
        .max(255, "Nama lokasi harus kurang dari 255 karakter"),
      no_telepon: Yup.string()
        .required("Nomor telepon wajib diisi")
        .matches(/^[0-9]+$/, "Nomor telepon hanya boleh mengandung angka")
        .min(11, "Nomor telepon harus lebih dari 10 karakter")
        .max(13, "Nomor telepon harus kurang dari 14 karakter"),
      latitude: Yup.string()
        .required("Latitude wajib diisi")
        .matches(/^[-+]?\d*\.?\d+$/, "Latitude hanya boleh berisi angka"),
      longitude: Yup.string()
        .required("Longitude wajib diisi")
        .matches(/^[-+]?\d*\.?\d+$/, "Longitude hanya boleh berisi angka"),
      radius: Yup.number().required("Radius wajib diisi"),
      senin_masuk: Yup.string().required("Senin Masuk wajib diisi"),
      senin_keluar: Yup.string().required("Senin Keluar wajib diisi"),
      selasa_masuk: Yup.string().required("Selasa Masuk wajib diisi"),
      selasa_keluar: Yup.string().required("Selasa Keluar wajib diisi"),
      rabu_masuk: Yup.string().required("Rabu Masuk wajib diisi"),
      rabu_keluar: Yup.string().required("Rabu Keluar wajib diisi"),
      kamis_masuk: Yup.string().required("Kamis Masuk wajib diisi"),
      kamis_keluar: Yup.string().required("Kamis Keluar wajib diisi"),
      jumat_masuk: Yup.string().required("Jumat Masuk wajib diisi"),
      jumat_keluar: Yup.string().required("Jumat Keluar wajib diisi"),
      sabtu_masuk: Yup.string().required("Sabtu Masuk wajib diisi"),
      sabtu_keluar: Yup.string().required("Sabtu Keluar wajib diisi"),
      minggu_masuk: Yup.string().required("Minggu Masuk wajib diisi"),
      minggu_keluar: Yup.string().required("Minggu Keluar wajib diisi"),
    }),
    onSubmit: async (values) => {
      try {
        const jadwal = JSON.stringify({
          senin: {
            masuk: values.senin_masuk,
            keluar: values.senin_keluar,
          },
          selasa: {
            masuk: values.selasa_masuk,
            keluar: values.selasa_keluar,
          },
          rabu: {
            masuk: values.rabu_masuk,
            keluar: values.rabu_keluar,
          },
          kamis: {
            masuk: values.kamis_masuk,
            keluar: values.kamis_keluar,
          },
          jumat: {
            masuk: values.jumat_masuk,
            keluar: values.jumat_keluar,
          },
          sabtu: {
            masuk: values.sabtu_masuk,
            keluar: values.sabtu_keluar,
          },
          minggu: {
            masuk: values.minggu_masuk,
            keluar: values.minggu_keluar,
          },
        });

        const data = { ...values, jadwal };

        let response;

        if (isEdit) {
          response = await updateData(
            { dispatch, redux: perusahaanReducer },
            { pk: pk, ...data },
            API_URL_edelperusahaan,
            "UPDATE_perusahaan"
          );
        } else {
          response = await addData(
            { dispatch, redux: perusahaanReducer },
            data,
            API_URL_createperusahaan,
            "ADD_perusahaan"
          );
          console.log(response);
        }

        // Upload the image if selected
        if (selectedImage) {
          const formData = new FormData();
          formData.append("image", selectedImage);
          formData.append("perusahaan_id", response.perusahaan_id);

          await updateProfile(
            dispatch,
            formData,
            API_URL_updateprofileperusahaan,
            "UPDATE_PROFILE",
            "profile"
          );
          setImagePreview(URL.createObjectURL(selectedImage));
        }

        navigate("/masterdata/data-perusahaan");
      } catch (error) {
        console.error("Error in form submission: ", error);
      }
    },
  });

  useEffect(() => {
    if (formik.values.image) {
      setImagePreview(formik.values.image);
    }
  }, [formik.values.image]);

  const handleImageUpload = (file) => {
    if (file) {
      setSelectedImage(file);

      // Buat URL baru untuk preview
      const newPreview = URL.createObjectURL(file);
      setImagePreview(newPreview);
    }
  };

  // console.log(formik.values)

  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate("/masterdata/perusahaan")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>{isEdit ? "Edit perusahaan" : "Tambah perusahaan"}</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="w-28 h-28 relative mx-auto">
              {/* profile perusahaan */}

              {imagePreview ? (
                <img
                  className="object-cover w-full h-full rounded-full border-2 border-grey-300"
                  src={imagePreview}
                  alt="imgPreview"
                />
              ) : isEdit ? (
                <Avatar className="w-28 h-28 text-xl" color="primary">
                  {formik.values.nama.substring(0, 2).toUpperCase()}
                </Avatar>
              ) : (
                <Avatar className="w-28 h-28 text-xl" color="primary">
                  <TbBuilding className="text-6xl" />
                </Avatar>
              )}
              <div className="absolute right-0 bottom-0">
                <div className="h-8 w-8 rounded-full relative bg-white dark:bg-base-600 flex items-center justify-center">
                  <TbPhotoPlus className="text-xl" />
                  <input
                    className="form-control absolute top-0 left-0 h-full w-full rounded-full opacity-0 cursor-pointer"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <TextField
                required
                label="Nama Perusahaan"
                name="nama"
                value={formik.values.nama}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nama ? formik.errors.nama : ""}
              />
              <TextField
                required
                label="Nama Singkatan"
                name="namaSingkatan"
                value={formik.values.namaSingkatan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.namaSingkatan
                    ? formik.errors.namaSingkatan
                    : ""
                }
              />
            </div>
            <div className="flex gap-4">
              <TextField
                label="No Telepon"
                name="no_telepon"
                value={formik.values.no_telepon}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.no_telepon ? formik.errors.no_telepon : ""
                }
              />
              <TextField
                required
                label="Latitude"
                name="latitude"
                value={formik.values.latitude}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.latitude ? formik.errors.latitude : ""}
              />
            </div>
            <div className="flex gap-4">
              <TextField
                required
                label="Longitude"
                name="longitude"
                value={formik.values.longitude}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.longitude ? formik.errors.longitude : ""}
              />
              <TextField
                label="Radius (m)"
                name="radius"
                type="number"
                value={formik.values.radius}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.radius ? formik.errors.radius : ""}
              />
            </div>
            {[
              "senin",
              "selasa",
              "rabu",
              "kamis",
              "jumat",
              "sabtu",
              "minggu",
            ].map((day) => (
              <div key={day} className="flex gap-4">
                <TextField
                  required
                  label={`${day.charAt(0).toUpperCase() + day.slice(1)} Masuk`}
                  name={`${day}_masuk`}
                  type="time"
                  value={formik.values[`${day}_masuk`]}
                  onChange={formik.handleChange}
                  onBlur={(e) => formik.handleBlur}
                  error={
                    formik.touched[`${day}_masuk`]
                      ? formik.errors[`${day}_masuk`]
                      : ""
                  }
                />
                <TextField
                  required
                  label={`${day.charAt(0).toUpperCase() + day.slice(1)} Keluar`}
                  name={`${day}_keluar`}
                  type="time"
                  value={formik.values[`${day}_keluar`]}
                  onChange={formik.handleChange}
                  onBlur={(e) => formik.handleBlur}
                  error={
                    formik.touched[`${day}_keluar`]
                      ? formik.errors[`${day}_keluar`]
                      : ""
                  }
                />
              </div>
            ))}
            <div className="flex justify-end">
              <Button type="submit">{isEdit ? "Update" : "Simpan"}</Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default perusahaanForm;
