import { isAuthenticated } from "@/authentication/authenticationApi";
import { Button, Container, TextField, Select } from "@/components";
import { updateData, handleInputError } from "@/actions";
import { API_URL_edeluser, API_URL_getmasterpegawai } from "@/constants";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { pegawaiReducer } from "@/reducers/kepegawaianReducers";
import { useFormik } from "formik";
import { IoMdReturnLeft } from "react-icons/io";
import * as Yup from "yup";
import axiosAPI from "@/authentication/axiosApi";

const EditProfilePegawaiPage = () => {
  const { addPegawaiResult, addPegawaiLoading } = useSelector(
    (state) => state.kepegawaian
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [pangkatOptions, setPangkatOptions] = useState([]);
  const [jabatanOptions, setJabatanOptions] = useState([]);
  const [departemenOptions, setDepartemenOptions] = useState([]);
  const [divisiOptions, setDivisiOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosAPI.get(API_URL_getmasterpegawai);
      setPangkatOptions(
        response.data.pangkat.map((item) => ({
          value: item.pk,
          label: item.nama,
        }))
      );
      setJabatanOptions(
        response.data.jabatan.map((item) => ({
          value: item.pk,
          label: item.nama,
        }))
      );
      setDepartemenOptions(
        response.data.departemen.map((item) => ({
          value: item.pk,
          label: item.nama,
        }))
      );
      setDivisiOptions(
        response.data.divisi.map((item) => ({
          value: item.pk,
          label: item.nama,
        }))
      );
      setUnitOptions(
        response.data.unit.map((item) => ({
          value: item.pk,
          label: item.nama,
        }))
      );
    };
    fetchData();
  }, []);

  const handleInputError = (values) => {
    // Validate values and handle errors as needed
    // Example logic, replace with your own
    if (!values || typeof values !== 'object') {
      console.error("Invalid input values:", values);
      return {}; // Return an empty object or handle as needed
    }

    // Your processing logic here
    const processedValues = Object.entries(values).map(([key, value]) => {
      return { key, value }; // Adjust according to your needs
    });

    return processedValues; // Ensure you return a defined value
  };

  // Check if location.state and location.state.data exist, fallback to empty object if not
  const initialData = location.state?.data;

  // console.log(initialData)

  const formik = useFormik({
    initialValues: {
      pangkat_id: initialData.pangkat.id || "",
      jabatan_id: initialData.jabatan.id || "",
      departemen_id: initialData.departemen.id || "",
      divisi_id: initialData.divisi.id || "",
      unit_id: initialData.unit.id || "",
      tgl_bergabung: initialData.tgl_bergabung || "",
      tgl_resign: initialData.tgl_resign || "",
    },
    validationSchema: Yup.object({
      pangkat_id: Yup.string().required("Pangkat is required"),
      jabatan_id: Yup.string().required("Jabatan is required"),
      departemen_id: Yup.string().required("Departemen is required"),
      divisi_id: Yup.string().required("Divisi is required"),
      unit_id: Yup.string().required("Unit is required"),
      tgl_bergabung: Yup.date().required("Tanggal Bergabung is required"),
    }),
    onSubmit: (values) => {
      const newInput = handleInputError(values);

      if (isAuthenticated().user_id) {
        updateData(
          { dispatch, redux: pegawaiReducer },
          {
            pk: "datapegawai",
            user_id: isAuthenticated().user_id,
            ...newInput,
          },
          API_URL_edeluser,
          "ADD_PEGAWAI"
        );
      }
    },
  });

  useEffect(() => {
    if (addPegawaiResult) {
      dispatch(
        pegawaiReducer({
          type: "ADD_PEGAWAI",
          payload: {
            loading: false,
            data: false,
          },
        })
      );
      navigate("/profil");
    }
  }, [addPegawaiResult, dispatch, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate(-1)} // Go back to the previous page
          >
            <IoMdReturnLeft />
          </button>
          <h1>Edit Data Pegawai</h1>
        </div>
        <form onSubmit={formik.handleSubmit} >
          <div className="sm:grid sm:grid-cols-2 sm:gap-4 max-[640px]:space-y-4">
            <Select
              required
              label="Pangkat"
              name="pangkat_id"
              value={pangkatOptions.find(option => option.value === formik.values.pangkat_id) || null}
              onChange={(option) => formik.setFieldValue('pangkat_id', option ? option.value : '')}
              options={pangkatOptions}
              error={formik.touched.pangkat_id ? formik.errors.pangkat_id : ''}
            />
            <Select
              required
              label="Jabatan"
              name="jabatan_id"
              value={jabatanOptions.find(option => option.value === formik.values.jabatan_id) || null}
              onChange={(option) => formik.setFieldValue('jabatan_id', option ? option.value : '')}
              options={jabatanOptions}
              error={formik.touched.jabatan_id ? formik.errors.jabatan_id : ''}
            />
            <Select
              required
              label="Departemen"
              name="departemen_id"
              value={departemenOptions.find(option => option.value === formik.values.departemen_id) || null}
              onChange={(option) => formik.setFieldValue('departemen_id', option ? option.value : '')}
              options={departemenOptions}
              error={formik.touched.departemen_id ? formik.errors.departemen_id : ''}
            />
            <Select
              required
              label="Divisi"
              name="divisi_id"
              value={divisiOptions.find(option => option.value === formik.values.divisi_id) || null}
              onChange={(option) => formik.setFieldValue('divisi_id', option ? option.value : '')}
              options={divisiOptions}
              error={formik.touched.divisi_id ? formik.errors.divisi_id : ''}
            />
            <Select
              required
              label="Unit"
              name="unit_id"
              value={unitOptions.find(option => option.value === formik.values.unit_id) || null}
              onChange={(option) => formik.setFieldValue('unit_id', option ? option.value : '')}
              options={unitOptions}
              error={formik.touched.unit_id ? formik.errors.unit_id : ''}
            />
            <TextField
              required
              label="Tanggal Bergabung"
              name="tgl_bergabung"
              type="date"
              value={formik.values.tgl_bergabung}
              onChange={formik.handleChange}
              onBlur={(e) => formik.handleBlur}
              error={formik.touched.tgl_bergabung ? formik.errors.tgl_bergabung : ''}
            />
            <TextField
              label="Tanggal Resign"
              name="tgl_resign"
              type="date"
              value={formik.values.tgl_resign}
              onChange={formik.handleChange}
              onBlur={(e) => formik.handleBlur}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={addPegawaiLoading}>
              Simpan
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default EditProfilePegawaiPage;
