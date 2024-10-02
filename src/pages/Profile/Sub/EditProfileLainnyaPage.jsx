import { isAuthenticated } from "@/authentication/authenticationApi";
import { Button, Container, TextField, Select } from "@/components";
import { updateData, handleInputError } from "@/actions";
import { API_URL_edeluser } from "@/constants";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { pegawaiReducer } from "@/reducers/kepegawaianReducers";
import { useFormik } from "formik";
import { IoMdReturnLeft } from "react-icons/io";
import * as Yup from "yup";
import { FaPlus, FaTimes } from "react-icons/fa";

const EditProfileLainnyaPage = () => {
  const { addPegawaiResult, addPegawaiLoading } = useSelector(
    (state) => state.kepegawaian
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

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
      data_lainnya: initialData?.data_lainnya || [{ data: null, link: '' }],
    },
    validationSchema: Yup.object().shape({
      data_lainnya: Yup.array().of(
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
    onSubmit: (values) => {
      const newInput = handleInputError(values);
      console.log("New Input:", newInput); // Check this output

      const formData = new FormData();
      formData.append("user_id", values.user_id);

      // Append files to FormData under 'datalainnya'
      values.data_lainnya.forEach((item) => {
        if (item.data) {
          formData.append(`datalainnya`, item.data); // Append files under the 'datalainnya' key
        }
      });

      // Prepare the 'lainnya' data
      const lainnyaData = values.data_lainnya.map(item => ({
        lainnya: item.data ? "" : item.link ? item.link : null,
      }));

      // Append the 'lainnya' JSON data
      formData.append("lainnya", JSON.stringify(lainnyaData));

      const payload = {
        pk: "datalainnya",
        user_id: isAuthenticated().user_id,
        datalainnya: formData, // Sending FormData
      };

      if (isAuthenticated().user_id) {
        updateData(
          { dispatch, redux: pegawaiReducer },
          payload,
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

  // Handle adding a new file input
  const handleAddFile = () => {
    const newDataLainnya = [...formik.values.data_lainnya, { data: null, link: '' }];
    formik.setFieldValue('data_lainnya', newDataLainnya);
  };

  // Handle removing a file input
  const handleRemoveFile = (index) => {
    const updatedDataLainnya = formik.values.data_lainnya.filter((_, i) => i !== index);
    formik.setFieldValue('data_lainnya', updatedDataLainnya);
  };

  // Handle file input change
  const handleFileChange = (index) => (event) => {
    const file = event.currentTarget.files[0]; // Correctly access the file
    console.log("Selected file: ", file); // Debugging file selection

    const updatedDataLainnya = formik.values.data_lainnya.map((item, i) =>
      i === index ? { ...item, data: file } : item
    );

    formik.setFieldValue('data_lainnya', updatedDataLainnya);
  };

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
          <h1>Edit Data Lainnya</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className='flex justify-between'>
            <h3 className='font-medium'>Data lainnya</h3>
            <div className='flex gap-2 items-center cursor-pointer'>
              {formik.values.data_lainnya.length > 0 && (
                <div>
                  {formik.values.data_lainnya.length > 1 && (
                    <button
                      type="button"
                      className='bg-gray-200 p-1 rounded-lg'
                      onClick={() => handleRemoveFile(formik.values.data_lainnya.length - 1)}
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
          {formik.values.data_lainnya.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <label htmlFor={`file-${index}`} className="block whitespace-nowrap">{`File Ke-${index + 1}`}</label>
              <input
                type="file"
                id={`file-${index}`}
                name={`data_lainnya[${index}].data`}
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
              {formik.touched.data_lainnya?.[index]?.data && formik.errors.data_lainnya?.[index]?.data && (
                <span className="text-red-500">
                  {formik.errors.data_lainnya[index].data}
                </span>
              )}
            </div>
          ))}
          <div className="mt-6 flex justify-end">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Container>
    </div >
  );
};

export default EditProfileLainnyaPage;
