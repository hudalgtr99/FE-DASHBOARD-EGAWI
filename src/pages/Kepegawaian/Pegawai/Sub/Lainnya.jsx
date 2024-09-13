import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { IoMdReturnLeft } from "react-icons/io";
import {
  Button,
  Container,
  Tooltip,
  TextField, // Assuming your custom TextField is imported here
} from '@/components';
import { useDispatch } from 'react-redux';
import { updateData } from '@/actions';
import { pegawaiReducer } from '@/reducers/kepegawaianReducers';
import {
  API_URL_edeluser,
} from '@/constants';
import axiosAPI from "@/authentication/axiosApi";
import { CiTrash } from 'react-icons/ci';

const Lainnya = () => {
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      data_lainnya: state?.item?.data_lainnya || [
        {
          name: 'data_lainnya',
          type: 'file',
          value: '',
          data: null,
          fullWidth: true,
          link: '',
        },
      ],
    },
    validationSchema: Yup.object().shape({
      data_lainnya: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required("Name is required"),
          type: Yup.string().required("Type is required"),
          value: Yup.string(),
          data: Yup.mixed().required("File is required"),
          fullWidth: Yup.boolean(),
          link: Yup.string(),
        })
      ),
    }),
    onSubmit: async (values) => {
      try {
        await updateData(
          { dispatch, redux: pegawaiReducer },
          {
            pk: pk, // Only send `pk` if it's an edit
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

  return (
    <div>
      <Container>
        <div className='flex items-center gap-2 mb-4'>
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#7367f0] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate("/kepegawaian/pegawai")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>Data Lainnya</h1>
        </div>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            <FieldArray name="data_lainnya">
              {({ push, remove }) => (
                <>
                  {formik.values.data_lainnya.map((item, index) => (
                    <div key={index} className='flex'>
                      <TextField
                        type="file"
                        label={`File Ke-${index + 1}`}
                        name={`data_lainnya[${index}].data`}
                        onChange={(event) => {
                          formik.setFieldValue(
                            `data_lainnya[${index}].data`,
                            event.currentTarget.files[0]
                          );
                        }}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.data_lainnya?.[index]?.data &&
                          formik.errors.data_lainnya?.[index]?.data
                        }
                        helperText={
                          formik.touched.data_lainnya?.[index]?.data &&
                            formik.errors.data_lainnya?.[index]?.data
                            ? formik.errors.data_lainnya[index].data
                            : null
                        }
                      />
                      <Tooltip tooltip="Hapus">
                        <button
                          type="button"
                          className="text-red-500 mt-9 pl-4 cursor-pointer sm:block hidden"
                          onClick={() => remove(index)}
                        >
                          <CiTrash />
                        </button>
                      </Tooltip>
                    </div>
                  ))}
                  <div className='sm:block hidden'>
                    <Button
                      type="button"
                      onClick={() => push({
                        name: 'data_lainnya',
                        type: 'file',
                        value: '',
                        data: null,
                        fullWidth: true,
                        link: '',
                      })}
                    >
                      Tambah Data
                    </Button>
                  </div>
                </>
              )}
            </FieldArray>
            <div className="mt-6 flex justify-end">
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </FormikProvider>
      </Container>
    </div>
  );
}

export default Lainnya;
