import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

// components
import { Button, Container, TextField } from "@/components";

import { updateData } from "@/actions";
import { API_URL_changepassword } from "@/constants";
import { userReducer } from "@/reducers/authReducers";
import { TbEye, TbEyeOff } from "react-icons/tb";
import { useParams } from "react-router-dom";
const UbahPasswordPage = () => {

  const { addUserLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [visibleNewPassword, setVisibleNewPassword] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      password_baru: "",
      konfirmasi_password_baru: "",
    },
    validationSchema: Yup.object({
      password_baru: Yup.string().required("Password baru wajib diisi"),
      konfirmasi_password_baru: Yup.string()
        .required("Konfirmasi password wajib diisi")
        .oneOf([Yup.ref("password_baru"), null], "Password tidak cocok"),
    }),
    onSubmit: (values) => {
      updateData(
        { dispatch, redux: userReducer },
        {
          pk: id,
          new_password: values.password_baru,
        },
        API_URL_changepassword,
        "ADD_USER"
      )
        .then(() => {
          formik.resetForm(); 
        })
    },
  });

  return (
    <Container>
      <h1 className="text-lg font-semibold mb-4">Ubah Password</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="relative">
          <TextField
            label="Password Baru"
            type={visibleNewPassword ? "text" : "password"}
            name="password_baru"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password_baru}
            suffix={
              visibleNewPassword ? (
                <TbEyeOff
                  className="cursor-pointer"
                  size={20}
                  onClick={() => setVisibleNewPassword(false)}
                />
              ) : (
                <TbEye
                  className="cursor-pointer"
                  size={20}
                  onClick={() => setVisibleNewPassword(true)}
                />
              )
            }
          />
          {formik.touched.password_baru && formik.errors.password_baru && (
            <p className="text-red-500 text-sm">
              {formik.errors.password_baru}
            </p>
          )}
        </div>

        <div className="relative">
          <TextField
            label="Konfirmasi Password Baru"
            type={visibleConfirmPassword ? "text" : "password"}
            name="konfirmasi_password_baru"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.konfirmasi_password_baru}
            suffix={
                visibleConfirmPassword ? (
                  <TbEyeOff
                    className="cursor-pointer"
                    size={20}
                    onClick={() => setVisibleConfirmPassword(false)}
                  />
                ) : (
                  <TbEye
                    className="cursor-pointer"
                    size={20}
                    onClick={() => setVisibleConfirmPassword(true)}
                  />
                )
              }
          />
          {formik.touched.konfirmasi_password_baru &&
            formik.errors.konfirmasi_password_baru && (
              <p className="text-red-500 text-sm">
                {formik.errors.konfirmasi_password_baru}
              </p>
            )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={addUserLoading}>
            {addUserLoading ? "Mengirim..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default UbahPasswordPage;
