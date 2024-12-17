import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axiosAPI from "@/authentication/axiosApi";
import { useDispatch } from "react-redux";
import { perusahaanReducer } from "@/reducers/perusahaanReducers";
import {
  API_URL_getperusahaan,
  API_URL_edelperusahaan,
  API_URL_updateprofileperusahaan,
} from "@/constants";
import { Button, Container, TextField } from "@/components";
import { updateData } from "@/actions";
import { updateProfile } from "@/actions/auth";
import { Avatar } from "../../../components";

const PerusahaanPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [item, setItem] = useState([]);
  const [cordinate, setCordinate] = useState({});
  const [jadwal, setJadwal] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch perusahaan data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAPI.get(API_URL_getperusahaan);
        const perusahaanData = response.data;

        // Ambil perusahaan index pertama
        if (perusahaanData.length > 0) {
          setItem(perusahaanData[0]);
          setCordinate(JSON.parse(perusahaanData[0].cordinate));
          setJadwal(JSON.parse(perusahaanData[0].jadwal));
        }
      } catch (error) {
        console.error("Error fetching perusahaan data:", error);
      }
    };

    fetchData();
  }, []);

  // Formik untuk menangani form
  const formik = useFormik({
    initialValues: {
      nama: item?.nama || "",
      namaSingkatan: item?.nama_singkatan || "",
      no_telepon: item?.no_telepon || "",
      latitude: cordinate?.latitude || "",
      longitude: cordinate?.longitude || "",
      radius: item?.radius || 25,
      image: item?.image || "",
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
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      nama: Yup.string()
        .required("Nama wajib diisi")
        .max(255, "Nama harus kurang dari 255 karakter"),
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

        console.log("item", item);
        // Update existing perusahaan
        await updateData(
          { dispatch, redux: perusahaanReducer },
          { pk: item.slug, ...data },
          API_URL_edelperusahaan,
          "ADD_perusahaan"
        );

        // Upload the image if selected
        if (selectedImage) {
          const formData = new FormData();
          formData.append("perusahaan_id", item.pk);
          formData.append("image", selectedImage);

          await updateProfile(
            dispatch,
            formData,
            API_URL_updateprofileperusahaan,
            "UPDATE_PROFILE",
            "profile"
          );
        }
      } catch (error) {
        console.error("Error in form submission: ", error);
      }
    },
  });

  const handleImageUpload = (file) => {
    if (file) {
      setSelectedImage(file);

      // Buat URL baru untuk preview
      const newPreview = URL.createObjectURL(file);
      setImagePreview(newPreview);
    }
  };

  return (
    <div>
      <Container>
        {item && (
          <>
            <div className="w-full flex justify-center my-4">
              <div className="w-28 h-28 relative">
                {imagePreview || item?.image ? (
                  <img
                    className="object-cover w-full h-full rounded-full border-2 border-grey-300 dark:border-base-200"
                    src={imagePreview || item?.image}
                    alt="imgPreview"
                  />
                ) : (
                  <Avatar className="w-28 h-28 text-xl" color="primary">
                    {item?.nama?.substring(0, 2).toUpperCase()}
                  </Avatar>
                )}
                <div className="absolute right-0 bottom-0">
                  <div className="h-8 w-8 rounded-full relative">
                    <img src={"/assets/imgPreview.png"} alt="" />
                    <input
                      className="form-control absolute top-0 left-0 h-full w-full rounded-full opacity-0 cursor-pointer"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                    />
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <TextField
                required
                label="Nama Perusahaan"
                name="nama"
                value={formik.values.nama}
                onChange={formik.handleChange}
                error={formik.touched.nama && formik.errors.nama}
              />
              <TextField
                required
                label="Nama Singkatan"
                name="namaSingkatan"
                value={formik.values.namaSingkatan}
                onChange={formik.handleChange}
              />
              <TextField
                label="No Telepon"
                name="no_telepon"
                value={formik.values.no_telepon}
                onChange={formik.handleChange}
                error={formik.touched.no_telepon && formik.errors.no_telepon}
              />
              <TextField
                required
                label="Latitude"
                name="latitude"
                value={formik.values.latitude}
                onChange={formik.handleChange}
                error={formik.touched.latitude && formik.errors.latitude}
              />
              <TextField
                required
                label="Longitude"
                name="longitude"
                value={formik.values.longitude}
                onChange={formik.handleChange}
                error={formik.touched.longitude && formik.errors.longitude}
              />
              <TextField
                label="Radius (m)"
                name="radius"
                type="number"
                value={formik.values.radius}
                onChange={formik.handleChange}
                error={formik.touched.radius && formik.errors.radius}
              />
              <div className="mt-6 flex justify-end">
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </>
        )}
      </Container>
    </div>
  );
};

export default PerusahaanPage;
