import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoMdReturnLeft } from "react-icons/io";
import {
    Button,
    Container,
    TextField,
    TextArea,
    Select,
} from '@/components';
import { useDispatch } from 'react-redux';
import { addData, updateData } from '@/actions';
import { apiReducer } from '@/reducers/apiReducers';
import {
    API_URL_createapiclient,
    API_URL_edelapiclient,
    API_URL_getperusahaan,
    API_URL_getapiaccess,
} from '@/constants';
import axiosAPI from "@/authentication/axiosApi";

const ApiForm = () => {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [perusahaanOptions, setperusahaanOptions] = useState([]);
    const [apiOptions, setapiOptions] = useState([]);

    const isEdit = id && id !== 'add';

    useEffect(() => {
        getperusahaan();
        getApiAccess();
    }, []);

    const getperusahaan = async () => {
        const response = await axiosAPI.get(API_URL_getperusahaan);
        const options = response.data.map((item) => ({
          value: item.pk,
          label: item.nama,
        }));
        setperusahaanOptions(options);

        if (options.length === 1) {
          formik.setFieldValue("perusahaan", options[0].value);
        }
    };

    const getApiAccess = async () => {
        const response = await axiosAPI.get(API_URL_getapiaccess);
        setapiOptions(
            response.data.map((item) => ({
                value: item.id,
                label: item.api,
            }))
        );
    };

    const formik = useFormik({
        initialValues: {
            nama_client: state?.item?.nama_client || "",
            keterangan: state?.item?.keterangan || "",
            perusahaan: state?.item?.perusahaan || [], // Ensure this is an array
            api: state?.item?.api || [], // Ensure this is an array
        },
        validationSchema: Yup.object().shape({
            nama_client: Yup.string().required("Nama Client is required"),
            keterangan: Yup.string().required("Keterangan is required"),
            perusahaan: Yup.array().min(1, "At least one Perusahaan is required"),
            api: Yup.array().min(1, "At least one API Access is required"),
        }),
        onSubmit: async (values) => {
            const updatedValues = {
                ...values,
                perusahaan: JSON.stringify(values.perusahaan),
                api: JSON.stringify(values.api),
            };

            try {
                if (isEdit) {
                    await updateData(
                        { dispatch, redux: apiReducer },
                        { id: id, ...updatedValues },
                        API_URL_edelapiclient,
                        'ADD_API'
                    );
                } else {
                    await addData(
                        { dispatch, redux: apiReducer },
                        updatedValues,
                        API_URL_createapiclient,
                        'ADD_API'
                    );
                }
                navigate('/api/api');
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
                        onClick={() => navigate("/api/api")}
                    >
                        <IoMdReturnLeft />
                    </button>
                    <h1>{isEdit ? 'Edit Data' : 'Tambah Data'}</h1>
                </div>
                <div>
                    <form onSubmit={formik.handleSubmit} className='space-y-6'>
                        <TextField
                            required
                            label="Nama Client"
                            name="nama_client"
                            value={formik.values.nama_client}
                            onChange={formik.handleChange}
                            onBlur={(e) => formik.handleBlur}
                            error={formik.touched.nama_client ? formik.errors.nama_client : ''}
                        />
                        <TextArea
                            required
                            label="Keterangan"
                            name="keterangan"
                            value={formik.values.keterangan}
                            onChange={formik.handleChange}
                            onBlur={(e) => formik.handleBlur}
                            error={formik.touched.keterangan ? formik.errors.keterangan : ''}
                        />
                        <Select
                            label="Perusahaan"
                            name="perusahaan"
                            options={perusahaanOptions}
                            multi
                            value={formik.values.perusahaan}
                            onChange={(options) => formik.setFieldValue('perusahaan', options)}
                            error={formik.touched.perusahaan ? formik.errors.perusahaan : ''}
                        />
                        <Select
                            label="API Access"
                            name="api"
                            options={apiOptions}
                            multi
                            value={formik.values.api}
                            onChange={(options) => formik.setFieldValue('api', options)}
                            error={formik.touched.api ? formik.errors.api : ''}
                        />
                        <div className="mt-6 flex justify-end">
                            <Button type="submit">{isEdit ? "Simpan" : "Tambah"}</Button>
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    );
}

export default ApiForm;
