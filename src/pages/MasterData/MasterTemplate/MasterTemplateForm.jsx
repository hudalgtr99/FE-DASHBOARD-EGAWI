import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import {
  Button,
  Container,
  TextField,
  PulseLoading,
  TextArea,
} from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { addData, updateData } from "@/actions";
import { penugasanReducer } from "@/reducers/penugasanReducers";
import {
  API_URL_createtemplatesurattugas,
  API_URL_edeltemplatesurattugas,
} from "@/constants";
import CKEditor from "../../../components/forms/CKEditor";

const MasterTemplateForm = () => {
  const { addTugasLoading } =
    useSelector((state) => state.tugas);
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [idTemplate, setIdTemplate] = useState(pk);

  const isEdit = pk && pk !== "add";

  const formik = useFormik({
    initialValues: {
      nama: state?.item?.nama || "",
      isi: state?.item?.isi || "",
    },
    validationSchema: Yup.object().shape({
      nama: Yup.string().required("Nama is required").max(255, "Nama template harus kurang dari 255 karakter"),
    }),

    onSubmit: async (values) => {
      values.isi = sessionStorage.getItem("ckeditor");
      if (isEdit) {
        if (idTemplate) {
          const data = await updateData(
            { dispatch, redux: penugasanReducer },
            { pk: idTemplate, data: values },
            API_URL_edeltemplatesurattugas,
            "ADD_TUGAS"
          );
          if(data && !addTugasLoading){
            navigate(`/masterdata/master-template`);
            sessionStorage.removeItem("ckeditor");
          }
        } else {
          console.error("ID is undefined for updating the task.");
        }
      } else {
        const data = await addData(
          { dispatch, redux: penugasanReducer },
          values,
          API_URL_createtemplatesurattugas,
          "ADD_TUGAS"
        );
        if(data && !addTugasLoading){
          navigate(`/masterdata/master-template`);
          sessionStorage.removeItem("ckeditor");
        }
      }
    },
  });

  return (
    <Container>
      <div className="flex items-center gap-2 mb-4">
        <button
          className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
          onClick={() => navigate("/kepegawaian/penugasan")}
        >
          <IoMdReturnLeft />
        </button>
        <h1>{isEdit ? "Edit Template" : "Tambah Template"}</h1>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <TextField
          required
          label="Nama Template"
          name="nama"
          value={formik.values.nama}
          onChange={formik.handleChange}
          onBlur={(e) => formik.handleBlur}
          error={formik.touched.nama && formik.errors.nama}
        />
        <div className="w-full">
          <CKEditor values={formik.values.isi} isEdit={isEdit}  />
        </div>

        <div className="mt-6 flex justify-end">
          <Button loading={addTugasLoading} type="submit">{isEdit ? "Update" : "Tambah"}</Button>
        </div>
      </form>
    </Container>
  );
};

export default MasterTemplateForm;