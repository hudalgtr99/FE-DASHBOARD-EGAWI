import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, TextArea, Select } from "@/components";
import { useDispatch } from "react-redux";
import { addData, updateData } from "@/actions";
import { jabatanReducers } from "@/reducers/strataReducers";
import {
  API_URL_createjabatan,
  API_URL_edeljabatan,
  API_URL_getperusahaan,
} from "@/constants";
import axiosAPI from "@/authentication/axiosApi";

const JabatanSubForm = () => {
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [perusahaanOptions, setPerusahaanOptions] = useState([]);
  const isEdit = pk && pk !== "add";

  useEffect(() => {
    const fetchPerusahaanOptions = async () => {
      try {
        const response = await axiosAPI.get(API_URL_getperusahaan);
        const options = response.data.map((item) => ({
          value: item.pk,
          label: item.nama,
        }));
        setPerusahaanOptions(options);

        if (options.length === 1 || state?.item?.perusahaan) {
          const perusahaanId = state?.item?.perusahaan?.id || options[0].value;
          formik.setFieldValue("perusahaan", perusahaanId);
        }

        // Set default value for perusahaan if editing
        if (isEdit && state?.item?.perusahaan) {
          formik.setFieldValue("perusahaan", state.item.perusahaan.id);
        }
      } catch (error) {
        console.error("Error fetching perusahaan data:", error);
      }
    };

    fetchPerusahaanOptions();
  }, [isEdit, state]);

  const formik = useFormik({
    initialValues: {
      nama: state?.item?.nama || "",
      keterangan: state?.item?.keterangan || "",
      perusahaan: state?.item?.perusahaan?.id || "", // Set initial value for perusahaan
    },
    validationSchema: Yup.object().shape({
      nama: Yup.string()
        .required("Nama Jabatan wajib diisi")
        .max(255, "Nama Jabatan harus kurang dari 255 karakter"),
      perusahaan: Yup.mixed().required("Perusahaan wajib diisi"),
    }),
    onSubmit: async (values) => {
      if (isEdit) {
        await updateData(
          { dispatch, redux: jabatanReducers },
          { pk: pk, ...values },
          API_URL_edeljabatan,
          "UPDATE_JABATAN"
        );
      } else {
        await addData(
          { dispatch, redux: jabatanReducers },
          values,
          API_URL_createjabatan,
          "ADD_JABATAN"
        );
      }
      navigate("/masterdata/jabatan");
    },
  });

  console.log(formik.values);

  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate("/masterdata/jabatan")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>{isEdit ? "Edit Jabatan" : "Tambah Jabatan"}</h1>
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
            <TextField
              required
              label="Nama Jabatan"
              name="nama"
              value={formik.values.nama}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nama ? formik.errors.nama : ""}
            />
            <TextArea
              label="Keterangan"
              name="keterangan"
              value={formik.values.keterangan}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.keterangan ? formik.errors.keterangan : ""}
            />
            <div className="mt-6 flex justify-end">
              <Button type="submit">{isEdit ? "Simpan" : "Tambah"}</Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default JabatanSubForm;
