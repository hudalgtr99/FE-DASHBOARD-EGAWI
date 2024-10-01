import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoMdReturnLeft } from "react-icons/io";
import {
  Button,
  Container,
  Tooltip,
  TextField,
} from '@/components';
import { useDispatch } from 'react-redux';
import { updateData } from '@/actions';
import { pegawaiReducer } from '@/reducers/kepegawaianReducers';
import { API_URL_edeluser } from '@/constants';
import { CiTrash } from 'react-icons/ci';

const Lainnya = () => {
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      user_id: state?.item?.datapribadi.user_id || '',
      lainnya: state?.item?.lainnya || [{ data: null }],
    },
    validationSchema: Yup.object().shape({
      lainnya: Yup.array().of(
        Yup.object().shape({
          data: Yup.mixed()
            .nullable() // Allow null values
            .test(
              "fileType",
              "Only PDF files are allowed",
              (value) => !value || (value && value.type === "application/pdf")
            ),
        })
      ),
    }),
    onSubmit: async (values) => {
      console.log("Submitted values: ", values); // Log the values to inspect
      try {
        await updateData(
          { dispatch, redux: pegawaiReducer },
          {
            pk: "datalainnya", // Only send `pk` if it's an edit
            ...values,
          },
          API_URL_edeluser, // Single API URL used for both add and update
          'ADD_PEGAWAI' // Unified action for add/update
        );
        navigate('/kepegawaian/pegawai');
      } catch (error) {
        console.error('Error in form submission: ', error);
      }
    },
  });

  const handleAddFile = () => {
    const newDataLainnya = [...formik.values.lainnya, { data: null }];
    formik.setFieldValue('lainnya', newDataLainnya);
  };

  const handleRemoveFile = (index) => {
    const updatedDataLainnya = formik.values.lainnya.filter((_, i) => i !== index);
    formik.setFieldValue('lainnya', updatedDataLainnya);
  };

  const handleFileChange = (event, index) => {
    const file = event.currentTarget.files[0];
    console.log("Selected file: ", file); // Log the file to check if it's captured

    const updatedDataLainnya = formik.values.lainnya.map((item, i) =>
      i === index ? { data: file } : item
    );

    formik.setFieldValue('lainnya', updatedDataLainnya);
  };


  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate("/kepegawaian/pegawai")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>Data Lainnya</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {formik.values.lainnya.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <label htmlFor={`file-${index}`} className="block whitespace-nowrap">{`File Ke-${index + 1}`}</label>
              <input
                type="file"
                id={`file-${index}`}
                name={`lainnya[${index}].data`}
                accept="application/pdf" // Restrict to PDF files
                onChange={(event) => handleFileChange(event, index)} // Handle file change
                onBlur={formik.handleBlur}
                className="w-full border border-gray-300 rounded-md p-2 text-gray-700 file:bg-gray-200 file:border-0 file:text-sm file:font-semibold file:text-gray-600 hover:file:bg-gray-300"
              />
              {formik.touched.lainnya?.[index]?.data && formik.errors.lainnya?.[index]?.data && (
                <span className="text-red-500">
                  {formik.errors.lainnya[index].data}
                </span>
              )}
              <Tooltip tooltip="Hapus">
                <button
                  type="button"
                  className="text-red-500 cursor-pointer sm:block hidden"
                  onClick={() => handleRemoveFile(index)}
                >
                  <CiTrash />
                </button>
              </Tooltip>
            </div>
          ))}

          <div>
            <Button type="button" onClick={handleAddFile}>
              Tambah Data
            </Button>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default Lainnya;
