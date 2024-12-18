import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

// components
import { Button, Container, TextField } from "@/components";

// functions
import { updateAkun, updateProfile } from "@/actions/auth";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { API_URL_updateakun, API_URL_updateprofile } from "@/constants";
import { fetchUserDetails } from "@/constants/user";
import { Avatar, PulseLoading } from "../../../components";
import { TbPhotoPlus } from "react-icons/tb";
import {jwtDecode} from "jwt-decode";

const PengaturanAkunSub = () => {
  const { addUserResult, addUserLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [isFormikInitialized, setIsFormikInitialized] = useState(false); // Untuk memastikan formik tidak diinisialisasi sebelum data

  const auth = isAuthenticated();
  const jwt = jwtDecode(auth);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await fetchUserDetails();
      // localStorage.setItem("userEditData", userData)
      setUser(userData.datapribadi);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formik = useFormik({
    initialValues: {
      photo: "",
      nama: "",
      email: "",
    },
    validationSchema: Yup.object().shape({
      nama: Yup.string().required("Nama wajib diisi"),
      email: Yup.string().email("Invalid email").required("Email wajib diisi"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("nama", values.nama);
      formData.append("email", values.email);
      try {
        updateAkun(
          dispatch,
          "ADD_USER",
          formData,
          jwt.user_id,
          API_URL_updateakun
        );
      } catch (error) {
        console.error("Error updating account:", error);
      }
    },
  });

  useEffect(() => {
    if (!loading && user && !isFormikInitialized) {
      formik.setValues({
        photo: user.photo || "",
        nama: user.nama || "",
        email: user.email || "",
      });
      setIsFormikInitialized(true);
    }
  }, [loading, user, isFormikInitialized, formik]);

  const handleImageUpload = (file) => {
    const formData = new FormData();
    formData.append("image", file);
    updateProfile(
      dispatch,
      formData,
      API_URL_updateprofile,
      "UPDATE_PROFILE",
      jwt.user_id
    );
    formik.setFieldValue("photo", URL.createObjectURL(file));
  };

  if (loading || !isFormikInitialized) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <PulseLoading />
      </div>
    );
  }

  return (
    <div>
      <Container>
        <div className="w-full flex justify-center my-4">
          <div className="w-28 h-28 relative">
            {formik.values.photo ? (
              <img
                className="object-cover w-full h-full rounded-full border-2 border-grey-300 dark:border-base-200"
                src={formik.values.photo}
                alt="imgPreview"
              />
            ) : (
              <Avatar className="w-28 h-28 text-xl" color="primary">
                {formik.values.nama.substring(0, 2).toUpperCase()}
              </Avatar>
            )}
            <div className="absolute right-0 bottom-0">
              <div className="h-8 w-8 rounded-full relative bg-white dark:bg-base-600 flex items-center justify-center">
                <TbPhotoPlus className="text-xl cursor-pointer" />
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
            label="Nama"
            name="nama"
            value={formik.values.nama}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nama ? formik.errors.nama : ""}
          />
          <TextField
            required
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email ? formik.errors.email : ""}
          />
          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={addUserLoading}>
              Simpan
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default PengaturanAkunSub;
