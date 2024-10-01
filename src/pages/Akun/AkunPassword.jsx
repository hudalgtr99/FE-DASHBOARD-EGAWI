import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, TextField } from '@/components';
import { icons } from "../../../public/icons";
import { IoMdReturnLeft } from 'react-icons/io';

const AkunPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [visibleOldPassword, setVisibleOldPassword] = useState(false);
    const [visibleNewPassword, setVisibleNewPassword] = useState(false);
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
    const userId = location.state?.item.datapribadi.user_id; // Retrieve user ID from navigation state

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required('Password Saat Ini is required'),
            newPassword: Yup.string()
                .min(6, 'Password Baru must be at least 6 characters')
                .required('Password Baru is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], 'Passwords must match')
                .required('Konfirmasi Password Baru is required'),
        }),
        onSubmit: (values) => {
            // API call to update the password
            console.log('Password Change Data:', {
                userId,
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            });

            // Navigate back to AkunPage after successful password change
            navigate('/akun');
        },
    });

    return (
        <Container>
            <div className='flex items-center gap-2 mb-4'>
                <button
                    className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
                    onClick={() => navigate("/akun")}
                >
                    <IoMdReturnLeft />
                </button>
                <h1>Ubah Password</h1>
            </div>
            <form onSubmit={formik.handleSubmit} className='space-y-4'>
                <div className="relative">
                    <TextField
                        label="Password Saat Ini"
                        type={visibleOldPassword ? "text" : "password"}
                        name="oldPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.oldPassword}
                    />
                    <div
                        className="absolute text-gray-400 top-[44px] right-4 transform -translate-y-2/4 text-2xl cursor-pointer"
                        onClick={() => setVisibleOldPassword(!visibleOldPassword)}
                    >
                        {visibleOldPassword ? icons.aifilleyeinvisible : icons.aifilleye}
                    </div>
                </div>

                <div className="relative">
                    <TextField
                        label="Password Baru"
                        type={visibleNewPassword ? "text" : "password"}
                        name="newPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.newPassword}
                    />
                    <div
                        className="absolute text-gray-400 top-[44px] right-4 transform -translate-y-2/4 text-2xl cursor-pointer"
                        onClick={() => setVisibleNewPassword(!visibleNewPassword)}
                    >
                        {visibleNewPassword ? icons.aifilleyeinvisible : icons.aifilleye}
                    </div>
                </div>

                <div className="relative">
                    <TextField
                        label="Konfirmasi Password Baru"
                        type={visibleConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                    />
                    <div
                        className="absolute text-gray-400 top-[44px] right-4 transform -translate-y-2/4 text-2xl cursor-pointer"
                        onClick={() => setVisibleConfirmPassword(!visibleConfirmPassword)}
                    >
                        {visibleConfirmPassword ? icons.aifilleyeinvisible : icons.aifilleye}
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button type="submit">Simpan</Button>
                </div>
            </form>
        </Container>
    );
};

export default AkunPassword;
