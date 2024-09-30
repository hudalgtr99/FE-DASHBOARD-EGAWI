import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

// components
import {
  Button,
  Container,
  TextField,
} from "@/components";

// functions
import { updateAkun, updateProfile } from "@/actions/auth";
import { isAuthenticated } from "@/authentication/authenticationApi";
import {
  API_URL_updateakun,
  API_URL_updateprofile,
} from "@/constants";

const PengaturanAkunSub = () => {
  const { addUserResult, addUserLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState("");

  // Get initial values directly from isAuthenticated
  const auth = isAuthenticated();

  const formik = useFormik({
    initialValues: {
      username: auth.username || "",
      email: auth.email || "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Username is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      updateAkun(
        dispatch,
        "ADD_USER",
        formData,
        auth.user_id,
        API_URL_updateakun
      );
    },
    enableReinitialize: true,
  });

  const handleImageUpload = (file) => {
    const formData = new FormData();
    formData.append("image", file);
    updateProfile(
      dispatch,
      formData,
      API_URL_updateprofile,
      "UPDATE_PROFILE",
      auth.user_id
    );
    setImagePreview(URL.createObjectURL(file));
  };

  // Update form values manually after a successful update
  useEffect(() => {
    if (addUserResult) {
      const updatedAuth = isAuthenticated();
      const newUsername = updatedAuth.username || "";
      const newEmail = updatedAuth.email || "";

      // Check if the new values differ from current values
      if (formik.values.username !== newUsername || formik.values.email !== newEmail) {
        formik.setValues({
          username: newUsername,
          email: newEmail,
        });
      }
    }
  }, [addUserResult]); // Only depend on addUserResult

  return (
    <div>
      <Container>
        <div className="w-full flex justify-center my-4">
          <div className="w-28 h-28 relative">
            <img
              className="object-cover w-full h-full rounded-full border-2 border-grey-300"
              src={imagePreview ? imagePreview : "/assets/default.jpg"}
              alt="imgPreview"
            />
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
            label="Username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username ? formik.errors.username : ''}
          />
          <TextField
            required
            label="Email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email ? formik.errors.email : ''}
          />
          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={addUserLoading}>Simpan</Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default PengaturanAkunSub;
