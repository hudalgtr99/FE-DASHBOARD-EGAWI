import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoMdReturnLeft } from "react-icons/io";
import {
    Button,
    Container,
    TextField,
    Select,
} from '@/components';
import { useDispatch } from 'react-redux';
import { addData, updateData } from '@/actions';
import { callbackReducer } from '@/reducers/apiReducers';
import {
    API_URL_createcallback,
    API_URL_edelcallback,
    API_URL_gettypecallback,
    API_URL_getapiclientall
} from '@/constants';
import axiosAPI from "@/authentication/axiosApi";

const CallbackForm = () => {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [typeOptions, setTypeOptions] = useState([]);
    const [apiOptions, setApiOptions] = useState([]);

    const isEdit = id && id !== 'add';

    useEffect(() => {
        getType();
        getApiClient();
    }, []);

    const getType = async () => {
        const response = await axiosAPI.get(API_URL_gettypecallback);
        setTypeOptions(
            response.data.map((item) => ({
                value: item.id,
                label: item.type,
            }))
        );
    };

    const getApiClient = async () => {
        const response = await axiosAPI.get(API_URL_getapiclientall);
        setApiOptions(
            response.data.map((item) => ({
                value: item.id,
                label: item.nama_client,
            }))
        );
    };

    const formik = useFormik({
        initialValues: {
            key: state?.item?.key || "",
            url: state?.item?.url || "",
            type: state?.item?.type || [],
            api: state?.item?.api || [],
        },
        validationSchema: Yup.object().shape({
            key: Yup.string().required("Api Key is required"),
            url: Yup.string().url("Invalid URL format").required("URL is required"),
            type: Yup.object().required("Type Callback is required"),
            api: Yup.object().required("Api Client is required"),
        }),
        onSubmit: async (values) => {
            try {
                if (isEdit) {
                    await updateData(
                        { dispatch, redux: callbackReducer },
                        { id: id, ...values },
                        API_URL_edelcallback,
                        'ADD_CALLBACK'
                    );
                } else {
                    await addData(
                        { dispatch, redux: callbackReducer },
                        values,
                        API_URL_createcallback,
                        'ADD_CALLBACK'
                    );
                }
                navigate('/api/callback');
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
                        onClick={() => navigate("/api/callback")}
                    >
                        <IoMdReturnLeft />
                    </button>
                    <h1>{isEdit ? 'Edit Data' : 'Tambah Data'}</h1>
                </div>
                <div>
                    <form onSubmit={formik.handleSubmit} className='space-y-6'>
                        <TextField
                            required
                            label="Api Key"
                            name="key"
                            value={formik.values.key}
                            onChange={formik.handleChange}
                            onBlur={(e) => formik.handleBlur}
                            error={formik.touched.key ? formik.errors.key : ''}
                        />
                        <TextField
                            required
                            label="URL"
                            name="url"
                            value={formik.values.url}
                            onChange={formik.handleChange}
                            onBlur={(e) => formik.handleBlur}
                            error={formik.touched.url ? formik.errors.url : ''}
                        />
                        <Select
                            required
                            label="Type Callback"
                            name="type"
                            options={typeOptions}
                            value={typeOptions.find(option => option.value === formik.values.type)}
                            onChange={(option) => formik.setFieldValue('type', option ? option.value : '')}
                            error={formik.touched.type ? formik.errors.type : ''}
                        />
                        <Select
                            required
                            label="Api Client"
                            name="api"
                            options={apiOptions}
                            value={apiOptions.find(option => option.value === formik.values.api)}
                            onChange={(option) => formik.setFieldValue('api', option ? option.value : '')}
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

export default CallbackForm;
