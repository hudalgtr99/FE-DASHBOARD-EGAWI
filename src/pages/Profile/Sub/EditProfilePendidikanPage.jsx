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

const EditProfilePendidikanPage = () => {
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

  // Parse the formal and non_formal fields
  const formalData = JSON.parse(location.state?.data.formal || '[]');
  const nonFormalData = JSON.parse(location.state?.data.non_formal || '[]');

  const initialData = {
    formal: formalData.length > 0 ? formalData : [
      { asal_sekolah: '', masa_waktu: '', keterangan_pendidikan: '' },
    ],
    non_formal: nonFormalData.length > 0 ? nonFormalData : [
      { nama_lembaga: '', tahun_lulus: '', sertifikat: null },
    ],
  };

  // console.log(initialData)

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: Yup.object().shape({
      formal: Yup.array().of(
        Yup.object().shape({
          asal_sekolah: Yup.string().required('Asal Sekolah is required'),
          masa_waktu: Yup.string().required('Masa Waktu is required'),
          keterangan_pendidikan: Yup.string().required('Keterangan is required'),
        })
      ),
      non_formal: Yup.array().of(
        Yup.object().shape({
          nama_lembaga: Yup.string().required('Nama Lembaga is required'),
          tahun_lulus: Yup.string().required('Tahun Lulus is required'),
          sertifikat: Yup.mixed().nullable(),
        })
      ),
    }),
    onSubmit: (values) => {
      const newInput = handleInputError(values);

      const payload = {
        pk: "datapendidikan",
        user_id: isAuthenticated().user_id,
        formal: JSON.stringify(values.formal), // Serialize formal education array
        non_formal: JSON.stringify(values.non_formal), // Serialize non-formal education array
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

  const addFormalEducation = () => {
    formik.setFieldValue('formal', [
      ...formik.values.formal,
      { asal_sekolah: '', masa_waktu: '', keterangan_pendidikan: '' },
    ]);
  };

  const addNonFormalEducation = () => {
    formik.setFieldValue('non_formal', [
      ...formik.values.non_formal,
      { nama_lembaga: '', tahun_lulus: '', sertifikat: null },
    ]);
  };

  const removeFormalEducation = (index) => {
    const newEducation = formik.values.formal.filter((_, i) => i !== index);
    formik.setFieldValue('formal', newEducation);
  };

  const removeNonFormalEducation = (index) => {
    const newEducation = formik.values.non_formal.filter((_, i) => i !== index);
    formik.setFieldValue('non_formal', newEducation);
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
          <h1>Edit Data Pendidikan</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <div className='flex justify-between'>
              <h3 className='font-medium'>Pendidikan Formal</h3>
              <div className='flex gap-2 items-center cursor-pointer'>
                {formik.values.formal.length > 0 && (
                  <div>
                    {formik.values.formal.length > 1 && (
                      <button
                        type="button"
                        className='bg-gray-200 p-1 rounded-lg'
                        onClick={() => removeFormalEducation(formik.values.formal.length - 1)}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                )}
                <div>
                  <button type="button" className='bg-gray-200 p-1 rounded-lg' onClick={addFormalEducation}>
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
            {formik.values.formal.map((edu, index) => (
              <div key={index}>
                <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4 mb-4'>
                  <TextField
                    required
                    label="Asal Sekolah"
                    name={`formal[${index}].asal_sekolah`}
                    value={edu.asal_sekolah}
                    onChange={formik.handleChange}
                    onBlur={(e) => formik.handleBlur}
                    error={
                      formik.touched.formal?.[index]?.asal_sekolah
                        ? formik.errors.formal?.[index]?.asal_sekolah
                        : ''
                    }
                  />
                  <TextField
                    required
                    label="Masa Waktu"
                    name={`formal[${index}].masa_waktu`}
                    value={edu.masa_waktu}
                    onChange={formik.handleChange}
                    onBlur={(e) => formik.handleBlur}
                    error={
                      formik.touched.formal?.[index]?.masa_waktu
                        ? formik.errors.formal?.[index]?.masa_waktu
                        : ''
                    }
                  />
                  <TextField
                    required
                    label="Keterangan Pendidikan"
                    name={`formal[${index}].keterangan_pendidikan`}
                    value={edu.keterangan_pendidikan}
                    onChange={formik.handleChange}
                    onBlur={(e) => formik.handleBlur}
                    error={
                      formik.touched.formal?.[index]?.keterangan_pendidikan
                        ? formik.errors.formal?.[index]?.keterangan_pendidikan
                        : ''
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <hr />

          <div>
            <div className='flex justify-between'>
              <h3 className='font-medium'>Pendidikan Non Formal</h3>
              <div className='flex gap-2 items-center cursor-pointer'>
                {formik.values.non_formal.length > 0 && (
                  <div>
                    {formik.values.non_formal.length > 1 && (
                      <button
                        type="button"
                        className='bg-gray-200 p-1 rounded-lg'
                        onClick={() => removeNonFormalEducation(formik.values.non_formal.length - 1)}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                )}
                <div>
                  <button type="button" className='bg-gray-200 p-1 rounded-lg' onClick={addNonFormalEducation}>
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
            {formik.values.non_formal.map((edu, index) => (
              <div key={index}>
                <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4 mb-2'>
                  <TextField
                    required
                    label="Nama Lembaga"
                    name={`non_formal[${index}].nama_lembaga`}
                    value={edu.nama_lembaga}
                    onChange={formik.handleChange}
                    onBlur={(e) => formik.handleBlur}
                    error={
                      formik.touched.non_formal?.[index]?.nama_lembaga
                        ? formik.errors.non_formal?.[index]?.nama_lembaga
                        : ''
                    }
                  />
                  <TextField
                    required
                    label="Tahun Lulus"
                    name={`non_formal[${index}].tahun_lulus`}
                    value={edu.tahun_lulus}
                    onChange={formik.handleChange}
                    onBlur={(e) => formik.handleBlur}
                    error={
                      formik.touched.non_formal?.[index]?.tahun_lulus
                        ? formik.errors.non_formal?.[index]?.tahun_lulus
                        : ''
                    }
                  />
                  <TextField
                    type="file"
                    label="Sertifikat"
                    name={`non_formal[${index}].sertifikat`}
                    onChange={(event) =>
                      formik.setFieldValue(
                        `non_formal[${index}].sertifikat`,
                        event.currentTarget.files[0]
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Container>
    </div >
  );
};

export default EditProfilePendidikanPage;
