import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoMdReturnLeft } from "react-icons/io";
import {
    Button,
    Container,
    TextField,
    TextArea,
} from '@/components';
import { useDispatch } from 'react-redux';
import { addData, updateData } from '@/actions';
import { gajiReducer } from '@/reducers/gajiReducers';
import { API_URL_creategaji, API_URL_edelgaji } from '@/constants';

const GajiForm = () => {
    const { pk } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isEdit = pk && pk !== 'add';

    const formik = useFormik({
        initialValues: {
            nama: location.state?.item?.nama,
            nominal: location.state?.item?.nominal,
        },
        validationSchema: Yup.object().shape({
            nama: Yup.string().required('Nama Gaji is required'),
            nominal: Yup.number().required('Nominal is required'),
        }),
        onSubmit: async (values) => {
            try {
                if (isEdit) {
                    await updateData(
                        { dispatch, redux: gajiReducer },
                        { pk: pk, nama: values.nama, nominal: values.nominal },
                        API_URL_edelgaji,
                        'UPDATE_GAJI'
                    );
                } else {
                    await addData(
                        { dispatch, redux: gajiReducer },
                        { nama: values.nama, nominal: values.nominal },
                        API_URL_creategaji,
                        'ADD_GAJI'
                    );
                }
                navigate('/masterdata/gaji');
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
                        className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
                        onClick={() => navigate("/masterdata/gaji")}
                    >
                        <IoMdReturnLeft />
                    </button>
                    <h1>{isEdit ? 'Edit Gaji' : 'Tambah Gaji'}</h1>
                </div>
                <div>
                    <form onSubmit={formik.handleSubmit} className='space-y-6'>
                        <TextField
                            label="Nama Gaji"
                            name="nama"
                            placeholder="Enter Nama Gaji"
                            value={formik.values.nama}
                            onChange={formik.handleChange}
                            onBlur={(e) => formik.handleBlur}
                            error={formik.touched.nama && formik.errors.nama}
                        />
                        <TextField
                            label="Nominal"
                            name="nominal"
                            type="number"
                            placeholder="Enter Nominal"
                            value={formik.values.nominal}
                            onChange={formik.handleChange}
                            onBlur={(e) => formik.handleBlur}
                            error={formik.touched.nominal && formik.errors.nominal}
                        />
                        <div className="mt-6 flex justify-end">
                            <Button type="submit">{isEdit ? "Simpan" : "Tambah"}</Button>
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    );
};

export default GajiForm;
