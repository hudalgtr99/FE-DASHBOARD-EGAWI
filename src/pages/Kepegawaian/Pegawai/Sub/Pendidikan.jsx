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
import { FaTimes, FaPlus } from "react-icons/fa";

const Pendidikan = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Parse the formal and non_formal fields
  const formalData = JSON.parse(state?.item?.datapendidikan?.formal || '[]');
  const nonFormalData = JSON.parse(state?.item?.datapendidikan?.non_formal || '[]');

  const initialData = {
    user_id: state?.item?.datapribadi.user_id || '',
    formal: formalData.length > 0 ? formalData : [
      { asal_sekolah: '', masa_waktu: '', keterangan_pendidikan: '' },
    ],
    non_formal: nonFormalData.length > 0 ? nonFormalData : [
      { nama_lembaga: '', tahun_lulus: '', sertifikat: null },
    ],
  };

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
    onSubmit: async (values) => {
      try {
        // Prepare the data for the API
        const payload = {
          pk: "datapendidikan",
          user_id: values.user_id,
          formal: JSON.stringify(values.formal), // Serialize formal education array
          non_formal: JSON.stringify(values.non_formal), // Serialize non-formal education array
        };

        // Call the updateData function with the prepared payload
        await updateData(
          { dispatch, redux: pegawaiReducer },
          payload,
          API_URL_edeluser,
          'UPDATE_PEGAWAI',
          "datapendidikan"
        );

        // Navigate back after a successful update
        navigate('/kepegawaian/pegawai');
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  });

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
            onClick={() => navigate('/kepegawaian/pegawai')}
          >
            <IoMdReturnLeft />
          </button>
          <h1>Data Pendidikan</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <div className='flex justify-between'>
                <h3 className='font-medium'>Pendidikan Formal</h3>
                <div className='flex gap-2 items-center cursor-pointer'>
                  {formik.values.formal.map((edu, index) => (
                    <div>
                      <div key={index}>
                        <Tooltip tooltip="Hapus">
                          {formik.values.formal.length > 1 && (
                            <button
                              type="button"
                              className='bg-gray-200 p-1 rounded-lg'
                              onClick={() => removeFormalEducation(index)}
                            >
                              <FaTimes />
                            </button>
                          )}
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                  <div>
                    <Tooltip tooltip="Tambah">
                      <button type="button" className='bg-gray-200 p-1 rounded-lg' onClick={addFormalEducation}>
                        <FaPlus />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
              {formik.values.formal?.length > 0 ? (
                formik.values.formal.map((edu, index) => (
                  <div key={index}>
                    <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4 mb-4'>
                      <TextField
                        required
                        label="Asal Sekolah"
                        name={`formal[${index}].asal_sekolah`}
                        value={edu.asal_sekolah}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                        onBlur={formik.handleBlur}
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
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.formal?.[index]?.keterangan_pendidikan
                            ? formik.errors.formal?.[index]?.keterangan_pendidikan
                            : ''
                        }
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>No Data Available</p>
              )}
            </div>

            <hr />

            <div>
              <div className='flex justify-between'>
                <h3 className='font-medium'>Pendidikan Non Formal</h3>
                <div className='flex gap-2 items-center cursor-pointer'>
                  {formik.values.non_formal.map((edu, index) => (
                    <div>
                      <div key={index}>
                        <Tooltip tooltip="Hapus">
                          {formik.values.non_formal.length > 1 && (
                            <button
                              type="button"
                              className='bg-gray-200 p-1 rounded-lg'
                              onClick={() => removeNonFormalEducation(index)}
                            >
                              <FaTimes />
                            </button>
                          )}
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                  <div>
                    <Tooltip tooltip="Tambah">
                      <button type="button" className='bg-gray-200 p-1 rounded-lg' onClick={addNonFormalEducation}>
                        <FaPlus />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
              {formik.values.non_formal?.length > 0 ? (
                formik.values.non_formal.map((edu, index) => (
                  <div key={index}>
                    <div className='sm:flex block sm:gap-4 max-[640px]:space-y-4 mb-2'>
                      <TextField
                        required
                        label="Nama Lembaga"
                        name={`non_formal[${index}].nama_lembaga`}
                        value={edu.nama_lembaga}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                        onBlur={formik.handleBlur}
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
                ))
              ) : (
                <p>No Data Available</p>
              )}
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
