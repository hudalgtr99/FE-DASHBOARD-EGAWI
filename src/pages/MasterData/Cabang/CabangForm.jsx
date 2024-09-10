import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { cabangReducer } from "@/reducers/cabangReducers";
import { addData, updateData } from "@/actions";
import {
    API_URL_createcabang,
    API_URL_edelcabang,
    API_URL_getcabang
} from "@/constants";
import {
    Container,
    TextField,
    Button,
} from "@/components";
import { IoMdReturnLeft } from "react-icons/io";
const CabangForm = () => {
    const { pk } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { getCabangResult } = useSelector(state => state.cabang);
    const [initialValues, setInitialValues] = useState({
        nama: "",
        no_telepon: "",
        latitude: "",
        longitude: "",
        radius: 25,
        senin_masuk: "08:00",
        senin_keluar: "17:00",
        selasa_masuk: "08:00",
        selasa_keluar: "17:00",
        rabu_masuk: "08:00",
        rabu_keluar: "17:00",
        kamis_masuk: "08:00",
        kamis_keluar: "17:00",
        jumat_masuk: "08:00",
        jumat_keluar: "17:00",
        sabtu_masuk: "00:00",
        sabtu_keluar: "00:00",
        minggu_masuk: "00:00",
        minggu_keluar: "00:00",
    });
    const [loading, setLoading] = useState(true);

    const validationSchema = Yup.object().shape({
        nama: Yup.string().required("Nama is required"),
        latitude: Yup.string().required("Latitude is required"),
        longitude: Yup.string().required("Longitude is required"),
        radius: Yup.number().required("Radius is required"),
        no_telepon: Yup.string().required("No Telepon is required"),
        senin_masuk: Yup.string().required("Senin Masuk is required"),
        senin_keluar: Yup.string().required("Senin Keluar is required"),
        selasa_masuk: Yup.string().required("Selasa Masuk is required"),
        selasa_keluar: Yup.string().required("Selasa Keluar is required"),
        rabu_masuk: Yup.string().required("Rabu Masuk is required"),
        rabu_keluar: Yup.string().required("Rabu Keluar is required"),
        kamis_masuk: Yup.string().required("Kamis Masuk is required"),
        kamis_keluar: Yup.string().required("Kamis Keluar is required"),
        jumat_masuk: Yup.string().required("Jumat Masuk is required"),
        jumat_keluar: Yup.string().required("Jumat Keluar is required"),
        sabtu_masuk: Yup.string().required("Sabtu Masuk is required"),
        sabtu_keluar: Yup.string().required("Sabtu Keluar is required"),
        minggu_masuk: Yup.string().required("Minggu Masuk is required"),
        minggu_keluar: Yup.string().required("Minggu Keluar is required"),
    });

    const isEdit = pk && pk !== 'add';

    useEffect(() => {
        if (isEdit && getCabangResult?.results) {
            const foundCabang = getCabangResult.results.find(item => item.pk === parseInt(pk, 10));
            if (foundCabang) {
                setInitialValues({
                    nama: foundCabang.nama || '',
                    no_telepon: foundCabang.no_telepon || '',
                    latitude: foundCabang.latitude || '',
                    longitude: foundCabang.longitude || '',
                    radius: foundCabang.radius || 25,
                    senin_masuk: foundCabang.senin_masuk || "08:00",
                    senin_keluar: foundCabang.senin_keluar || "17:00",
                    selasa_masuk: foundCabang.selasa_masuk || "08:00",
                    selasa_keluar: foundCabang.selasa_keluar || "17:00",
                    rabu_masuk: foundCabang.rabu_masuk || "08:00",
                    rabu_keluar: foundCabang.rabu_keluar || "17:00",
                    kamis_masuk: foundCabang.kamis_masuk || "08:00",
                    kamis_keluar: foundCabang.kamis_keluar || "17:00",
                    jumat_masuk: foundCabang.jumat_masuk || "08:00",
                    jumat_keluar: foundCabang.jumat_keluar || "17:00",
                    sabtu_masuk: foundCabang.sabtu_masuk || "00:00",
                    sabtu_keluar: foundCabang.sabtu_keluar || "00:00",
                    minggu_masuk: foundCabang.minggu_masuk || "00:00",
                    minggu_keluar: foundCabang.minggu_keluar || "00:00",
                });
            }
        }
        setLoading(false); // Data fetching complete
    }, [isEdit, pk, getCabangResult]);

    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const jadwal = JSON.stringify({
                    senin: {
                        masuk: values.senin_masuk,
                        keluar: values.senin_keluar,
                    },
                    selasa: {
                        masuk: values.selasa_masuk,
                        keluar: values.selasa_keluar,
                    },
                    rabu: {
                        masuk: values.rabu_masuk,
                        keluar: values.rabu_keluar,
                    },
                    kamis: {
                        masuk: values.kamis_masuk,
                        keluar: values.kamis_keluar,
                    },
                    jumat: {
                        masuk: values.jumat_masuk,
                        keluar: values.jumat_keluar,
                    },
                    sabtu: {
                        masuk: values.sabtu_masuk,
                        keluar: values.sabtu_keluar,
                    },
                    minggu: {
                        masuk: values.minggu_masuk,
                        keluar: values.minggu_keluar,
                    },
                });

                const data = { ...values, jadwal };

                if (isEdit) {
                    await updateData(
                        { dispatch, redux: cabangReducer },
                        { pk: pk, ...data },
                        API_URL_edelcabang,
                        'UPDATE_CABANG'
                    );
                } else {
                    await addData(
                        { dispatch, redux: cabangReducer },
                        data,
                        API_URL_createcabang,
                        'ADD_CABANG'
                    );
                }
                navigate('/masterdata/cabang');
            } catch (error) {
                console.error('Error in form submission: ', error);
            }
        },
    });


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Container>
                <div className='flex items-center gap-2 mb-4'>
                    <button
                        className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#7367f0] text-white rounded-full shadow hover:shadow-lg transition-all"
                        onClick={() => navigate("/masterdata/cabang")}
                    >
                        <IoMdReturnLeft />
                    </button>
                    <h1>{isEdit ? 'Edit Cabang' : 'Tambah Cabang'}</h1>
                </div>
                <div>
                    <form onSubmit={formik.handleSubmit} className='space-y-6'>
                        <TextField
                            label="Nama Cabang"
                            name="nama"
                            value={formik.values.nama}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.nama ? formik.errors.nama : ''}
                        />
                        <TextField
                            label="No Telepon"
                            name="no_telepon"
                            value={formik.values.no_telepon}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.no_telepon ? formik.errors.no_telepon : ''}
                        />
                        <TextField
                            label="Latitude"
                            name="latitude"
                            value={formik.values.latitude}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.latitude ? formik.errors.latitude : ''}
                        />
                        <TextField
                            label="Longitude"
                            name="longitude"
                            value={formik.values.longitude}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.longitude ? formik.errors.longitude : ''}
                        />
                        <TextField
                            label="Radius"
                            name="radius"
                            type="number"
                            value={formik.values.radius}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.radius ? formik.errors.radius : ''}
                        />
                        {['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'].map(day => (
                            <div key={day} className='flex gap-4'>
                                <TextField
                                    label={`${day.charAt(0).toUpperCase() + day.slice(1)} Masuk`}
                                    name={`${day}_masuk`}
                                    type="time"
                                    value={formik.values[`${day}_masuk`]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched[`${day}_masuk`] ? formik.errors[`${day}_masuk`] : ''}
                                />
                                <TextField
                                    label={`${day.charAt(0).toUpperCase() + day.slice(1)} Keluar`}
                                    name={`${day}_keluar`}
                                    type="time"
                                    value={formik.values[`${day}_keluar`]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched[`${day}_keluar`] ? formik.errors[`${day}_keluar`] : ''}
                                />
                            </div>
                        ))}
                        <Button type="submit">Submit</Button>
                    </form>
                </div>
            </Container>
        </div>
    );
};

export default CabangForm;
