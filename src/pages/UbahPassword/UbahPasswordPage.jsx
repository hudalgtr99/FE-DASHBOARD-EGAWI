import React, { useEffect } from "react";
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

const UbahPasswordPage = () => {
  const { addUserResult, addUserLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
      // Call the updateData function on form submit
      updateData(
        { dispatch, redux: userReducer },
        {
          pk: isAuthenticated().user_id,
          old_password: values.password,
          new_password: values.password_baru,
        },
        API_URL_changepassword,
        "ADD_USER"
      ).then(() => {
        if (addUserResult) {
          formik.resetForm(); // Reset form if update was successful
          Swal.fire({
            icon: "success",
            title: "Password changed successfully!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    },
  });

  useEffect(() => {
    if (addUserResult) {
      formik.resetForm(); // Reset form upon successful submission
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addUserResult, dispatch]);

  return (
    <div>
      <Container>
        <div className='font-semibold mb-4'>
          <h1>Ubah Password</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <TextField
            required
            label="Password Saat Ini"
            name="password"
            type="password" // Ensure this is a password field
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password ? formik.errors.password : ''}
          />
          <TextField
            required
            label="Password Baru"
            name="password_baru"
            type="password" // Ensure this is a password field
            value={formik.values.password_baru}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password_baru ? formik.errors.password_baru : ''}
          />
          <TextField
            required
            label="Konfirmasi Password Baru"
            name="konfirmasi_password_baru"
            type="password" // Ensure this is a password field
            value={formik.values.konfirmasi_password_baru}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.konfirmasi_password_baru ? formik.errors.konfirmasi_password_baru : ''}
          />
          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={addUserLoading}>Simpan</Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default UbahPasswordPage;
