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
import { useDispatch } from "react-redux";
import { addData, updateData } from "@/actions";
import { penugasanReducer } from "@/reducers/penugasanReducers";
import {
  API_URL_createtemplatesurattugas,
  API_URL_edeltemplatesurattugas,
} from "@/constants";
import { fetchUserDetails } from "@/constants/user";
import CKEditor from "../../../components/forms/CKEditor";

const MasterTemplateForm = () => {
  const { id, pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [noSurat, setNoSurat] = useState("");
  const [idTemplate, setIdTemplate] = useState(pk);

  const fetchData = useCallback(async () => {
    try {
      const userData = await fetchUserDetails();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    setIsLoading(false);
  }, [fetchData]);

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
          await updateData(
            { dispatch, redux: penugasanReducer },
            { pk: idTemplate, data: values },
            API_URL_edeltemplatesurattugas,
            "UPDATE_TUGAS"
          );
        } else {
          console.error("ID is undefined for updating the task.");
        }
      } else {
        await addData(
          { dispatch, redux: penugasanReducer },
          values,
          API_URL_createtemplatesurattugas,
          "ADD_TUGAS"
        );
      }
      navigate(`/masterdata/master-template`);
      sessionStorage.removeItem("ckeditor");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-4 h-[80vh] items-center">
        <PulseLoading />
      </div>
    );
  }

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
          <Button type="submit">{isEdit ? "Simpan" : "Tambah"}</Button>
        </div>
      </form>
    </Container>
  );
};

export default MasterTemplateForm;