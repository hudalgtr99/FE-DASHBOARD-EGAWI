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
      lainnya: state?.item?.datalainnya?.lainnya || [{ data: null, link: '' }],
    },
    validationSchema: Yup.object().shape({
      lainnya: Yup.array().of(
        Yup.object().shape({
          data: Yup.mixed()
            .nullable()
            .test(
              "fileType",
              "Only PDF files are allowed",
              (value) => !value || (value && value.type === "application/pdf")
            ),
          link: Yup.string().nullable(),
        })
      ),
    }),
    onSubmit: async (values) => {
      console.log("Submitting Values: ", values); // Log the values
      try {
        const formData = new FormData();
        formData.append("user_id", values.user_id);

        // Append files to FormData under 'datalainnya'
        values.lainnya.forEach((item) => {
          if (item.data) {
            formData.append(`datalainnya`, item.data); // Append files under the 'datalainnya' key
          }
        });

        // Prepare the 'lainnya' data
        const lainnyaData = values.lainnya.map(item => ({
          lainnya: item.data ? "" : item.link ? item.link : null,
        }));

        // Append the 'lainnya' JSON data
        formData.append("lainnya", JSON.stringify(lainnyaData));

        const payload = {
          pk: "datalainnya",
          user_id: values.user_id,
          datalainnya: formData, // Sending FormData
        };

        await updateData(
          { dispatch, redux: pegawaiReducer },
          payload,
          API_URL_edeluser,
          "ADD_PEGAWAI",
          "datalainnya"
        );

        navigate('/kepegawaian/pegawai'); // Navigate after successful submission
      } catch (error) {
        console.error('Error in form submission: ', error);
      }
    },
  });

  // Handle adding a new file input
  const handleAddFile = () => {
    const newLainnya = [...formik.values.lainnya, { data: null, link: '' }];
    formik.setFieldValue('lainnya', newLainnya);
  };

  // Handle removing a file input
  const handleRemoveFile = (index) => {
    const updatedLainnya = formik.values.lainnya.filter((_, i) => i !== index);
    formik.setFieldValue('lainnya', updatedLainnya);
  };

  // Handle file input change
  const handleFileChange = (index) => (event) => {
    const file = event.currentTarget.files[0]; // Correctly access the file
    console.log("Selected file: ", file); // Debugging file selection

    const updatedLainnya = formik.values.lainnya.map((item, i) =>
      i === index ? { ...item, data: file } : item
    );

    formik.setFieldValue('lainnya', updatedLainnya);
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
            <h3 className='font-medium'>Data lainnya</h3>
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
          {formik.values.lainnya.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <label htmlFor={`file-${index}`} className="block whitespace-nowrap">{`File Ke-${index + 1}`}</label>
              <input
                type="file"
                id={`file-${index}`}
                name={`lainnya[${index}].data`}
                accept="application/pdf" // Restrict to PDF files
                onChange={handleFileChange(index)} // Use a closure to pass the index
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
