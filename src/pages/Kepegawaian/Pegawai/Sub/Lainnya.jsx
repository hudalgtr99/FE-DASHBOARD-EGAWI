import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container } from '@/components';
import { useDispatch } from 'react-redux';
import { updateData } from '@/actions';
import { pegawaiReducer } from '@/reducers/kepegawaianReducers';
import { API_URL_edeluser } from '@/constants';
import { FaTimes, FaPlus } from "react-icons/fa";

const Lainnya = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      user_id: state?.item?.datapribadi.user_id || '',
      lainnya: state?.item?.lainnya || [], // Initialized as an array
    },
    validationSchema: Yup.object().shape({
      user_id: Yup.number()
        .required("User ID is required")
        .positive("User ID must be a positive number")
        .integer("User ID must be an integer"),
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
      if (!values.user_id) {
        console.error('User ID is invalid or missing.');
        return; // Prevent submission if user_id is invalid
      }

      const payload = {
        pk: "datalainnya", // Primary key for the API
        user_id: values.user_id,
        lainnya: JSON.stringify(values.lainnya), // Convert array to JSON string
      };

      console.log("Payload being sent to API: ", payload); // Debugging payload

      try {
        await updateData(
          { dispatch, redux: pegawaiReducer },
          payload,
          API_URL_edeluser, // Single API URL for both add and update
          'ADD_PEGAWAI', // Unified action for add/update
          'datalainnya'
        );
        navigate('/kepegawaian/pegawai'); // Navigate after successful submission
      } catch (error) {
        console.error('Error in form submission: ', error);
      }
    },
  });

  // Handle adding a new file input
  const handleAddFile = () => {
    const newDataLainnya = [...formik.values.lainnya, { data: null }];
    formik.setFieldValue('lainnya', newDataLainnya);
  };

  // Handle removing a file input
  const handleRemoveFile = (index) => {
    const updatedDataLainnya = formik.values.lainnya.filter((_, i) => i !== index);
    formik.setFieldValue('lainnya', updatedDataLainnya);
  };

  // Handle file input change
  const handleFileChange = (event, index) => {
    const file = event.currentTarget.files[0];
    console.log("Selected file: ", file); // Debugging file selection

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
          <div className='flex justify-between'>
            <h3 className='font-medium'>Pendidikan lainnya</h3>
            <div className='flex gap-2 items-center cursor-pointer'>
              {formik.values.lainnya.length > 0 && (
                <div>
                  {formik.values.lainnya.length > 1 && (
                    <button
                      type="button"
                      className='bg-gray-200 p-1 rounded-lg'
                      onClick={() => handleRemoveFile(formik.values.lainnya.length - 1)}
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              )}
              <div>
                <button type="button" className='bg-gray-200 p-1 rounded-lg' onClick={handleAddFile}>
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
          <div className="hidden">
            <input
              type="text"
              name="user_id"
              value={formik.values.user_id || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.values.lainnya.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <label htmlFor={`file-${index}`} className="block whitespace-nowrap">{`File Ke-${index + 1}`}</label>
              <input
                type="file"
                id={`file-${index}`}
                name={`lainnya[${index}].data`}
                accept="application/pdf" // Restrict to PDF files
                onChange={(event) => handleFileChange(event, index)}
                onBlur={formik.handleBlur}
                className="block w-full border p-2 rounded-lg text-sm text-gray-500 
                      file:mr-4 file:py-2 file:px-4 
                      file:rounded-full file:border-0 
                      file:text-sm file:font-semibold 
                      file:bg-blue-500 file:text-white 
                      hover:file:bg-blue-600"
              />
              {formik.touched.lainnya?.[index]?.data && formik.errors.lainnya?.[index]?.data && (
                <span className="text-red-500">
                  {formik.errors.lainnya[index].data}
                </span>
              )}
            </div>
          ))}
          <div className="mt-6 flex justify-end">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default Lainnya;
