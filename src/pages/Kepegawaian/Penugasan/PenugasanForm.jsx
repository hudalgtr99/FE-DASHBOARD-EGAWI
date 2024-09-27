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
import {
    addFormData,
    updateFormData,
} from '@/actions';
import { penugasanReducer } from '@/reducers/penugasanReducers';
import { API_URL_createtugas, API_URL_edeltugas, API_URL_getpegawai } from '@/constants';
import axiosAPI from "@/authentication/axiosApi";
import { isAuthenticated } from "@/authentication/authenticationApi";

const PenugasanForm = () => {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pegawaiOptions, setPegawaiOptions] = useState([]);

    console.log(state)

    const isEdit = id && id !== 'add';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosAPI.get(`${API_URL_getpegawai}?nama=`);
                setPegawaiOptions(response.data.map((item) => ({
                    value: item.id,
                    label: item.nama,
                })));
            } catch (error) {
                console.error('Error fetching pegawai options: ', error);
            }
        };

        fetchData();
    }, []);

    const formik = useFormik({
        initialValues: {
            judul: state?.item?.judul || '',
            prioritas: state?.item?.prioritas || '',
            deskripsi: state?.item?.deskripsi || '',
            penerima: state?.item?.penerima || [],
            file_pendukung: null, // Initialize as null for file input
            start_date: state?.item?.start_date || '',
            end_date: state?.item?.end_date || '',
        },
        validationSchema: Yup.object().shape({
            judul: Yup.string().required("Judul is required"),
            prioritas: Yup.string().required("Prioritas is required"),
            deskripsi: Yup.string().required("Deskripsi is required"),
            penerima: Yup.array().min(1, "Penerima is required"),
            start_date: Yup.date().required("Tanggal Mulai is required"),
            end_date: Yup.date().required("Tanggal Selesai is required")
                .min(Yup.ref('start_date'), "Tanggal Selesai must be after Tanggal Mulai"),
        }),
        onSubmit: async (values) => {
            console.log("Form Values: ", values);
            try {
                const formData = new FormData();
                // Append each value to formData
                Object.keys(values).forEach(key => {
                    // If the key is 'penerima', append only the IDs
                    if (key === 'penerima') {
                        formData.append(key, JSON.stringify(values.penerima.map(option => option.value))); // Extract IDs
                    } else {
                        formData.append(key, values[key]);
                    }
                });

                // Append the authenticated user's ID
                formData.append("pengirim", isAuthenticated().user_id);

                if (isEdit) {
                    await updateFormData(
                        { dispatch, redux: penugasanReducer },
                        { id: id, formData },
                        API_URL_edeltugas,
                        'UPDATE_TUGAS'
                    );
                } else {
                    await addFormData(
                        { dispatch, redux: penugasanReducer },
                        formData,
                        API_URL_createtugas,
                        'ADD_TUGAS'
                    );
                }
                navigate('/kepegawaian/penugasan');
            } catch (error) {
                console.error('Error in form submission: ', error);
                alert('An error occurred: ' + error.message);
            }
        }

    });

    return (
        <Container>
            <div className='flex items-center gap-2 mb-4'>
                <button
                    className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
                    onClick={() => navigate("/kepegawaian/penugasan")}
                >
                    <IoMdReturnLeft />
                </button>
                <h1>{isEdit ? 'Edit Tugas' : 'Tambah Tugas'}</h1>
            </div>
            <form onSubmit={formik.handleSubmit} className='space-y-6'>
                <TextField
                    required
                    label="Judul"
                    name="judul"
                    value={formik.values.judul}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.judul && formik.errors.judul}
                />
                <Select
                    required
                    label="Prioritas"
                    name="prioritas"
                    value={formik.values.prioritas ? { value: formik.values.prioritas, label: formik.values.prioritas } : null}
                    onChange={(option) => formik.setFieldValue('prioritas', option ? option.value : '')}
                    options={[
                        { value: "1", label: "Tinggi" },
                        { value: "2", label: "Sedang" },
                        { value: "3", label: "Rendah" },
                    ]}
                    error={formik.touched.prioritas && formik.errors.prioritas}
                />
                <TextArea
                    required
                    label="Deskripsi Tugas"
                    name="deskripsi"
                    value={formik.values.deskripsi}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.deskripsi && formik.errors.deskripsi}
                />
                <Select
                    required
                    multi
                    label="Penerima"
                    name="penerima"
                    value={formik.values.penerima}
                    onChange={(options) => formik.setFieldValue('penerima', options)} // Store the array of selected options
                    options={pegawaiOptions}
                    error={formik.touched.penerima && formik.errors.penerima}
                />
                <TextField
                    label="File Pendukung"
                    name="file_pendukung"
                    type="file"
                    onChange={(event) => {
                        formik.setFieldValue("file_pendukung", event.currentTarget.files[0]);
                    }}
                    onBlur={formik.handleBlur}
                    error={formik.touched.file_pendukung && formik.errors.file_pendukung}
                />
                <TextField
                    required
                    label="Tanggal Mulai"
                    name="start_date"
                    type="date"
                    value={formik.values.start_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.start_date && formik.errors.start_date}
                />
                <TextField
                    required
                    label="Tanggal Selesai"
                    name="end_date"
                    type="date"
                    value={formik.values.end_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.end_date && formik.errors.end_date}
                />
                <div className="mt-6 flex justify-end">
                    <Button type="submit">{isEdit ? "Simpan" : "Tambah"}</Button>
                </div>
            </form>
        </Container>
    );
}

export default PenugasanForm;
