import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, Tooltip } from '@/components';
import { useDispatch } from 'react-redux';
import { updateData } from '@/actions';
import { pegawaiReducer } from '@/reducers/kepegawaianReducers';
import { API_URL_edeluser } from '@/constants';
import { CiTrash } from 'react-icons/ci';

const Pendidikan = () => {
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialData = {
    user_id: state?.item?.datapribadi.user_id || '',
    pendidikanFormal: state?.item?.pendidikanFormal || [
      { asal_sekolah: '', masa_waktu: '', keterangan_pendidikan: '' },
    ],
    pendidikanNonFormal: state?.item?.pendidikanNonFormal || [
      { nama_lembaga: '', tahun_lulus: '', sertifikat: null },
    ],
  };

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: Yup.object().shape({
      pendidikanFormal: Yup.array().of(
        Yup.object().shape({
          asal_sekolah: Yup.string().required('Asal Sekolah is required'),
          masa_waktu: Yup.string().required('Masa Waktu is required'),
          keterangan_pendidikan: Yup.string().required('Keterangan is required'),
        })
      ),
      pendidikanNonFormal: Yup.array().of(
        Yup.object().shape({
          nama_lembaga: Yup.string().required('Nama Lembaga is required'),
          tahun_lulus: Yup.string().required('Tahun Lulus is required'),
          sertifikat: Yup.mixed().nullable(),
        })
      ),
    }),
    onSubmit: async (values) => {
      // Ensure the correct structure for API submission
      const updatedValues = {
        user_id: values.user_id,
        pendidikan_formal: values.pendidikanFormal, // Check if API expects 'pendidikan_formal'
        non_formal: values.pendidikanNonFormal, // Mapping 'pendidikanNonFormal' to 'non_formal'
      };

      // API expects a valid JSON object
      try {
        await updateData(
          { dispatch, redux: pegawaiReducer },
          {
            pk: "datapendidikan",
            ...updatedValues,  // Properly formatted data object
          },
          API_URL_edeluser,
          'UPDATE_PEGAWAI',
          "datapendidikan"
        );
        navigate('/kepegawaian/pegawai');
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });


  const addFormalEducation = () => {
    formik.setFieldValue('pendidikanFormal', [
      ...formik.values.pendidikanFormal,
      { asal_sekolah: '', masa_waktu: '', keterangan_pendidikan: '' },
    ]);
  };

  const addNonFormalEducation = () => {
    formik.setFieldValue('pendidikanNonFormal', [
      ...formik.values.pendidikanNonFormal,
      { nama_lembaga: '', tahun_lulus: '', sertifikat: null },
    ]);
  };

  const removeFormalEducation = (index) => {
    const newEducation = formik.values.pendidikanFormal.filter((_, i) => i !== index);
    formik.setFieldValue('pendidikanFormal', newEducation);
  };

  const removeNonFormalEducation = (index) => {
    const newEducation = formik.values.pendidikanNonFormal.filter((_, i) => i !== index);
    formik.setFieldValue('pendidikanNonFormal', newEducation);
  };

  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate('/kepegawaian/pegawai')}
          >
            <IoMdReturnLeft />
          </button>
          <h1>Data Pendidikan</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <h3 className='font-medium'>Pendidikan Formal</h3>
              {formik.values.pendidikanFormal?.length > 0 ? (
                formik.values.pendidikanFormal.map((edu, index) => (
                  <div key={index}>
                    <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4 mb-4'>
                      <TextField
                        required
                        label="Asal Sekolah"
                        name={`pendidikanFormal[${index}].asal_sekolah`}
                        value={edu.asal_sekolah}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.pendidikanFormal?.[index]?.asal_sekolah
                            ? formik.errors.pendidikanFormal?.[index]?.asal_sekolah
                            : ''
                        }
                      />
                      <TextField
                        required
                        label="Masa Waktu"
                        name={`pendidikanFormal[${index}].masa_waktu`}
                        value={edu.masa_waktu}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.pendidikanFormal?.[index]?.masa_waktu
                            ? formik.errors.pendidikanFormal?.[index]?.masa_waktu
                            : ''
                        }
                      />
                      <TextField
                        required
                        label="Keterangan Pendidikan"
                        name={`pendidikanFormal[${index}].keterangan_pendidikan`}
                        value={edu.keterangan_pendidikan}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.pendidikanFormal?.[index]?.keterangan_pendidikan
                            ? formik.errors.pendidikanFormal?.[index]?.keterangan_pendidikan
                            : ''
                        }
                      />
                      <Tooltip tooltip="Hapus">
                        <button
                          type="button"
                          className="text-red-500 mt-9 cursor-pointer sm:block hidden"
                          onClick={() => removeFormalEducation(index)}
                        >
                          <CiTrash />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Data Available.</p>
              )}
              <div className='sm:block hidden'>
                <Button type="button" onClick={addFormalEducation}>
                  Tambah Data
                </Button>
              </div>
            </div>

            <hr />

            <div>
              <h3 className='font-medium'>Pendidikan Non Formal</h3>
              {formik.values.pendidikanNonFormal?.length > 0 ? (
                formik.values.pendidikanNonFormal.map((edu, index) => (
                  <div key={index}>
                    <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4 mb-2'>
                      <TextField
                        required
                        label="Nama Lembaga"
                        name={`pendidikanNonFormal[${index}].nama_lembaga`}
                        value={edu.nama_lembaga}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.pendidikanNonFormal?.[index]?.nama_lembaga
                            ? formik.errors.pendidikanNonFormal?.[index]?.nama_lembaga
                            : ''
                        }
                      />
                      <TextField
                        required
                        label="Tahun Lulus"
                        name={`pendidikanNonFormal[${index}].tahun_lulus`}
                        value={edu.tahun_lulus}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.pendidikanNonFormal?.[index]?.tahun_lulus
                            ? formik.errors.pendidikanNonFormal?.[index]?.tahun_lulus
                            : ''
                        }
                      />
                      <TextField
                        type="file"
                        label="Sertifikat"
                        name={`pendidikanNonFormal[${index}].sertifikat`}
                        onChange={(event) =>
                          formik.setFieldValue(
                            `pendidikanNonFormal[${index}].sertifikat`,
                            event.currentTarget.files[0]
                          )
                        }
                      />
                      <Tooltip tooltip="Hapus">
                        <button
                          type="button"
                          className="text-red-500 mt-9 cursor-pointer sm:block hidden"
                          onClick={() => removeNonFormalEducation(index)}
                        >
                          <CiTrash />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                ))
              ) : (
                <p>No Data Available.</p>
              )}
              <div className='sm:block hidden'>
                <Button type="button" onClick={addNonFormalEducation}>
                  Tambah Data
                </Button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default Pendidikan;
