import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { cabangReducer } from "@/reducers/cabangReducers";
import { addData, updateData } from "@/actions";
import {
    API_URL_createcabang,
    API_URL_edelcabang,
} from "@/constants";
import {
    Container,
    TextField,
    Button,
} from "@/components";
import { IoMdReturnLeft } from "react-icons/io";

const Jadwal = () => {
    const { pk } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            senin_masuk: state?.item?.jadwal?.senin?.masuk || "08:00",
            senin_keluar: state?.item?.jadwal?.senin?.keluar || "17:00",
            selasa_masuk: state?.item?.jadwal?.selasa?.masuk || "08:00",
            selasa_keluar: state?.item?.jadwal?.selasa?.keluar || "17:00",
            rabu_masuk: state?.item?.jadwal?.rabu?.masuk || "08:00",
            rabu_keluar: state?.item?.jadwal?.rabu?.keluar || "17:00",
            kamis_masuk: state?.item?.jadwal?.kamis?.masuk || "08:00",
            kamis_keluar: state?.item?.jadwal?.kamis?.keluar || "17:00",
            jumat_masuk: state?.item?.jadwal?.jumat?.masuk || "08:00",
            jumat_keluar: state?.item?.jadwal?.jumat?.keluar || "17:00",
            sabtu_masuk: state?.item?.jadwal?.sabtu?.masuk || "00:00",
            sabtu_keluar: state?.item?.jadwal?.sabtu?.keluar || "00:00",
            minggu_masuk: state?.item?.jadwal?.minggu?.masuk || "00:00",
            minggu_keluar: state?.item?.jadwal?.minggu?.keluar || "00:00",
        },
        validationSchema: Yup.object().shape({
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
        }),
        onSubmit: async (values) => {
                const jadwal = JSON.stringify({
                    senin: {
                        masuk: values.senin_masuk,
                        keluar: values.senin_keluar
                    },
                    selasa: {
                        masuk: values.selasa_masuk,
                        keluar: values.selasa_keluar
                    },
                    rabu: {
                        masuk: values.rabu_masuk,
                        keluar: values.rabu_keluar
                    },
                    kamis: {
                        masuk: values.kamis_masuk,
                        keluar: values.kamis_keluar
                    },
                    jumat: {
                        masuk: values.jumat_masuk,
                        keluar: values.jumat_keluar
                    },
                    sabtu: {
                        masuk: values.sabtu_masuk,
                        keluar: values.sabtu_keluar
                    },
                    minggu: {
                        masuk: values.minggu_masuk,
                        keluar: values.minggu_keluar
                    },
                });

                navigate('/kepegawaian/pegawai');
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
                    <h1>Data Jadwal</h1>
                </div>
                <div>
                    <form onSubmit={formik.handleSubmit} className='space-y-6'>
                        {['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'].map(day => (
                            <div key={day} className='flex gap-4'>
                                <TextField
                                    required
                                    label={`${day.charAt(0).toUpperCase() + day.slice(1)} Masuk`}
                                    name={`${day}_masuk`}
                                    type="time"
                                    value={formik.values[`${day}_masuk`]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched[`${day}_masuk`] ? formik.errors[`${day}_masuk`] : ''}
                                />
                                <TextField
                                    required
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
                        <div className="mt-6 flex justify-end">
                            <Button type="submit">Simpan</Button>
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    );
};

export default Jadwal;
