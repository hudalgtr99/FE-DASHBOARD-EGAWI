import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup"; // Optional: for validation

// plugins
import Swal from "sweetalert2";

// components
import { Button, Container, TextField } from "@/components";

// functions
import { isAuthenticated } from "@/authentication/authenticationApi";
import { updateData } from "@/actions";
import { API_URL_changepassword } from "@/constants";
import { userReducer } from "@/reducers/authReducers";
import { icons } from "../../../public/icons";

const UbahPasswordPage = () => {
  const { addUserLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [visibleOldPassword, setVisibleOldPassword] = useState(false);
  const [visibleNewPassword, setVisibleNewPassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      password: "",
      password_baru: "",
      konfirmasi_password_baru: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Password Saat Ini is required"),
      password_baru: Yup.string().required("Password Baru is required"),
      konfirmasi_password_baru: Yup.string()
        .required("Konfirmasi Password Baru is required")
        .oneOf([Yup.ref('password_baru'), null], "Passwords must match"),
    }),
    onSubmit: (values) => {
      updateData(
        { dispatch, redux: userReducer },
        {
          pk: isAuthenticated().user_id,
          old_password: values.password,
          new_password: values.password_baru,
        },
        API_URL_changepassword,
        "ADD_USER"
      )
        .then(() => {
          formik.resetForm(); // Reset form if update was successful
          Swal.fire({
            icon: "success",
            title: "Password changed successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error changing password!",
            text: error.message,
          });
        });
    },
  });

  return (
    <div>
      <Container>
        <div className='font-semibold mb-4'>
          <h1>Ubah Password</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="relative">
            <TextField
              required
              label="Password Saat Ini"
              name="password"
              type={visibleOldPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div
              className="absolute text-gray-400 top-[44px] right-4 transform -translate-y-2/4 text-2xl cursor-pointer"
              onClick={() => setVisibleOldPassword(!visibleOldPassword)}
            >
              {visibleOldPassword ? icons.aifilleyeinvisible : icons.aifilleye}
            </div>
          </div>
          <div className="relative">
            <TextField
              required
              label="Password Baru"
              name="password_baru"
              type={visibleNewPassword ? "text" : "password"}
              value={formik.values.password_baru}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div
              className="absolute text-gray-400 top-[44px] right-4 transform -translate-y-2/4 text-2xl cursor-pointer"
              onClick={() => setVisibleNewPassword(!visibleNewPassword)}
            >
              {visibleNewPassword ? icons.aifilleyeinvisible : icons.aifilleye}
            </div>
          </div>
          <div className="relative">
            <TextField
              required
              label="Konfirmasi Password Baru"
              name="konfirmasi_password_baru"
              type={visibleConfirmPassword ? "text" : "password"}
              value={formik.values.konfirmasi_password_baru}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div
              className="absolute text-gray-400 top-[44px] right-4 transform -translate-y-2/4 text-2xl cursor-pointer"
              onClick={() => setVisibleConfirmPassword(!visibleConfirmPassword)}
            >
              {visibleConfirmPassword ? icons.aifilleyeinvisible : icons.aifilleye}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={addUserLoading}>Simpan</Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default UbahPasswordPage;
