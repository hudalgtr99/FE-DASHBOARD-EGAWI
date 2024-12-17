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
import { potonganReducer } from '@/reducers/potonganReducers';
import { API_URL_getpotongan, API_URL_edelpotongan } from '@/constants';

const PotonganForm = () => {
    const { pk } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isEdit = pk && pk !== 'add';

    const formik = useFormik({
        initialValues: {
            nama: state?.item?.nama,
            nominal: state?.item?.nominal,
        },
        validationSchema: Yup.object().shape({
            nama: Yup.string().required("Nama is required"),
            nominal: Yup.number().required("Nominal is required"),
        }),
        onSubmit: async (values) => {
            try {
                if (isEdit) {
                    await updateData(
                        { dispatch, redux: potonganReducer },
                        { pk: pk, nama: values.nama, nominal: values.nominal },
                        API_URL_edelpotongan,
                        'UPDATE_POTONGAN'
                    );
                } else {
                    await addData(
                        { dispatch, redux: potonganReducer },
                        { nama: values.nama, nominal: values.nominal },
                        API_URL_getpotongan,
                        'ADD_POTONGAN'
                    );
                }
                navigate('/masterdata/potongan');
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
                        onClick={() => navigate("/masterdata/potongan")}
                    >
                        <IoMdReturnLeft />
                    </button>
                    <h1>{isEdit ? 'Edit Data' : 'Tambah Data'}</h1>
                </div>
                <div>
                    <form onSubmit={formik.handleSubmit} className='space-y-6'>
                        <TextField
                            label="Nama Potongan"
                            name="nama"
                            placeholder="Enter Nama Potongan"
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
                            <Button type="submit">{isEdit ? "Update" : "Tambah"}</Button>
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    );
};

export default PotonganForm;
