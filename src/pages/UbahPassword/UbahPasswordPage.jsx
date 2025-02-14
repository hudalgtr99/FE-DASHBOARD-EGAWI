import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup"; // Optional: for validation

// plugins
import Swal from "sweetalert2";

// components
import { Button, Container, TextField } from "@/components";

// functions
import { updateFormData } from "@/actions";
import { API_URL_changepassworduser } from "@/constants";
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
      old_password: "",
      password_baru: "",
      konfirmasi_password_baru: "",
    },
    validationSchema: Yup.object({
      old_password: Yup.string().required("Password lama wajib diisi"),
      password_baru: Yup.string()
        .min(8, "Password baru minimal 8 karakter")
        .required("Password baru wajib diisi"),
      konfirmasi_password_baru: Yup.string()
        .oneOf(
          [Yup.ref("password_baru"), null],
          "Password baru dan konfirmasi password tidak cocok"
        )
        .required("Konfirmasi password wajib diisi"),
    }),
    onSubmit: (values) => {
      const formdata = new FormData();

      formdata.append("old_password", values.old_password);
      formdata.append("new_password", values.password_baru);

      updateFormData(
        { dispatch, redux: userReducer },
        formdata,
        API_URL_changepassworduser,
        "ADD_USER",
        ""
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
            text: error.message?.messages,
          });
        });
    },
  });

  return (
    <div>
      <Container>
        <div className="font-semibold mb-4">
          <h1>Ganti Password</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="relative">
            <TextField
              required
              label="Password Lama"
              name="old_password"
              type={visibleOldPassword ? "text" : "password"}
              value={formik.values.old_password}
              onChange={formik.handleChange}
              onBlur={(e) => formik.handleBlur}
              error={
                formik.touched.old_password ? formik.errors.old_password : ""
              }
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
              onBlur={(e) => formik.handleBlur}
              error={
                formik.touched.password_baru ? formik.errors.password_baru : ""
              }
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
              onBlur={(e) => formik.handleBlur}
              error={
                formik.touched.konfirmasi_password_baru
                  ? formik.errors.konfirmasi_password_baru
                  : ""
              }
            />
            <div
              className="absolute text-gray-400 top-[44px] right-4 transform -translate-y-2/4 text-2xl cursor-pointer"
              onClick={() => setVisibleConfirmPassword(!visibleConfirmPassword)}
            >
              {visibleConfirmPassword
                ? icons.aifilleyeinvisible
                : icons.aifilleye}
            </div>
          </div>
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

export default UbahPasswordPage;
