import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, Select } from "@/components";
import { useDispatch } from "react-redux";
import { addData, updateData } from "@/actions";
import { departemenReducers } from "@/reducers/organReducers";
import axiosAPI from "@/authentication/axiosApi";
import {
  API_URL_createdepartemen,
  API_URL_edeldepartemen,
  API_URL_getperusahaan,
} from "@/constants";
import { fetchUserDetails } from "@/constants/user";

const DepartemenSubForm = () => {
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [perusahaanOptions, setperusahaanOptions] = useState([]);
  const [user, setUser] = useState([]);

  const fetchData = useCallback(async () => {
    const userData = await fetchUserDetails();
    if (userData) {
      setUser(userData.datapribadi);
      // console.log(userData);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAPI.get(API_URL_getperusahaan);
        const options = response.data.map((item) => ({
          value: item.pk,
          label: item.nama,
        }));
        setperusahaanOptions(options);

        // Set default value if there's only one perusahaan option
        if (options.length === 1) {
          formik.setFieldValue("perusahaan", options[0].value);
        }
      } catch (error) {
        console.error("Error fetching perusahaan data:", error);
      }
    };

    fetchData();
  }, []);

  const isEdit = pk && pk !== "add";
  const formik = useFormik({
    initialValues: {
      nama: state?.item?.nama || "",
      nama_singkatan: state?.item?.nama_singkatan || "",
      perusahaan: state?.item?.perusahaan || "", 
    },
    validationSchema: Yup.object().shape({
      nama: Yup.string().required("Nama Departemen wajib diisi").max(255, "Nama Departemen harus kurang dari 255 karakter"),
      nama_singkatan: Yup.string().required("Nama Singkatan wajib diisi").max(5, "Nama Singkatan harus kurang dari 6 karakter"),
      perusahaan: Yup.mixed().required("perusahaan wajib diisi"), // Accept any type, including numbers
    }),
    onSubmit: async (values) => {
      perusahaanOptions.length === 1
        ? (values.perusahaan = perusahaanOptions[0].value)
        : (values.perusahaan = values.perusahaan);
      try {
        if (isEdit) {
          await updateData(
            { dispatch, redux: departemenReducers },
            { pk: pk, ...values },
            API_URL_edeldepartemen,
            "UPDATE_DEPARTEMEN"
          );
        } else {
          await addData(
            { dispatch, redux: departemenReducers },
            values,
            API_URL_createdepartemen,
            "ADD_DEPARTEMEN"
          );
        }
        navigate("/masterdata/organization");
      } catch (error) {
        console.error("Error in form submission: ", error);
      }
    },
    
  });

  console.log(formik.values);

  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate("/masterdata/organization")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>{isEdit ? "Edit Departemen" : "Tambah Departemen"}</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Select
              label="Perusahaan"
              name="perusahaan"
              value={
                perusahaanOptions.find(
                  (option) => option.value === formik.values.perusahaan
                ) || null
              }
              onChange={(option) => {
                formik.setFieldValue("perusahaan", option ? option.value : "");
              }}
              options={perusahaanOptions}
              error={formik.touched.perusahaan ? formik.errors.perusahaan : ""}
              disabled={perusahaanOptions.length === 1}
            />
            <div className="flex gap-4">
              <TextField
                required
                label="Nama Departemen"
                name="nama"
                value={formik.values.nama}
                onChange={formik.handleChange}
                onBlur={(e) => formik.handleBlur}
                error={formik.touched.nama ? formik.errors.nama : ""}
                />
              <TextField
                required
                label="Nama Singkatan"
                name="nama_singkatan"
                value={formik.values.nama_singkatan}
                onChange={formik.handleChange}
                onBlur={(e) => formik.handleBlur}
                error={formik.touched.nama_singkatan ? formik.errors.nama_singkatan : ""}
                />
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit">{isEdit ? "Simpan" : "Tambah"}</Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default DepartemenSubForm;
