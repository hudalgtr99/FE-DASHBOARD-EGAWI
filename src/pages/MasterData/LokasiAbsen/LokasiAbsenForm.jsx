import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Container, TextField, Button, Select, GoogleMapInput } from "@/components";
import { IoMdReturnLeft } from "react-icons/io";
import { addData, updateData } from "@/actions";
import { API_URL_createLokasiAbsen, API_URL_getperusahaan, API_URL_edellokasi } from "@/constants";
import { perusahaanReducer } from "@/reducers/perusahaanReducers";
import axiosAPI from "@/authentication/axiosApi";

const LokasiAbsenForm = () => {
	const { addperusahaanLoading } = useSelector((state) => state.perusahaan);
	const { pk } = useParams();
	const { state } = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [perusahaanOptions, setPerusahaanOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const isEdit = pk && pk !== "add";

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axiosAPI.get(API_URL_getperusahaan);
				const options = response.data.map((item) => ({
					value: item.pk,
					label: item.nama,
					slug: item.slug, // tambahkan slug untuk referensi
				}));
				setPerusahaanOptions(options);

				// Set default value jika ada satu opsi perusahaan atau saat sedang edit
				if (options.length === 1 || state?.item?.perusahaan) {
					const perusahaanSlug = state?.item?.perusahaan?.slug;
					const perusahaanId =
						perusahaanSlug && options.find((opt) => opt.slug === perusahaanSlug)
							? options.find((opt) => opt.slug === perusahaanSlug).value
							: state?.item?.perusahaan?.id || options[0].value;

					formik.setFieldValue("perusahaan", perusahaanId);
				}

				setIsLoading(false); // Set loading ke false setelah data diambil
			} catch (error) {
				console.error("Error fetching perusahaan data:", error);
				setIsLoading(false); // Set loading ke false meskipun terjadi error
			}
		};

		fetchData();
	}, []);

	const formik = useFormik({
		initialValues: {
			nama_lokasi: state?.item?.nama_lokasi || "",
			latitude: state?.item?.latitude || "",
			longitude: state?.item?.longitude || "",
			radius: state?.item?.radius || 25,
			perusahaan: state?.item?.perusahaan?.id || "", // Pastikan 'id' digunakan jika ada state
		},
		validationSchema: Yup.object().shape({
			nama_lokasi: Yup.string()
				.required("Nama lokasi wajib diisi")
				.max(255, "Nama lokasi harus kurang dari 255 karakter"),
			latitude: Yup.string()
				.required("Latitude wajib diisi")
				.matches(/^[-+]?\d*\.?\d+$/, "Latitude hanya boleh berisi angka"),
			longitude: Yup.string()
				.required("Longitude wajib diisi")
				.matches(/^[-+]?\d*\.?\d+$/, "Longitude hanya boleh berisi angka"),
			radius: Yup.number().required("Radius wajib diisi").min(1, "Radius must be at least 1"),
			perusahaan: Yup.mixed().required("Perusahaan wajib diisi"),
		}),
		onSubmit: async (values) => {
			if (isEdit) {
				try {
					const data = await updateData(
						{ dispatch, redux: perusahaanReducer },
						{ pk: pk, ...values },
						API_URL_edellokasi,
						"ADD_perusahaan"
					);

					if (data && !addperusahaanLoading) {
						navigate(
							sessionStorage.getItem("url") ? sessionStorage.getItem("url") : "/master-data/lokasi-absen"
						);
					}
				} catch (error) {}
			} else {
				try {
					const data = await addData(
						{ dispatch, redux: perusahaanReducer },
						values,
						API_URL_createLokasiAbsen,
						"ADD_perusahaan"
					);

					console.log("create Data", data);

					if (data && !addperusahaanLoading) {
						navigate(
							sessionStorage.getItem("url") ? sessionStorage.getItem("url") : "/master-data/lokasi-absen"
						);
					}
				} catch (e) {}
			}
		},
	});
	const [isLoaded, setIsLoaded] = useState(false);
	useEffect(() => {
		if (typeof window.google !== "undefined" && window.google.maps) {
			setIsLoaded(true);
		}
	}, []);

	return (
		<div>
			<Container>
				<div className="flex items-center gap-2 mb-4">
					<button
						className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
						onClick={() => {
							navigate(
								sessionStorage.getItem("url")
									? sessionStorage.getItem("url")
									: "/master-data/lokasi-absen"
							);
						}}
					>
						<IoMdReturnLeft />
					</button>
					<h1>{isEdit ? "Edit" : "Tambah"} Lokasi Absen</h1>
				</div>
				<form onSubmit={formik.handleSubmit} className="space-y-6">
					<Select
						label="Perusahaan"
						name="perusahaan"
						value={perusahaanOptions.find((option) => option.value === formik.values.perusahaan) || null}
						onChange={(option) => {
							formik.setFieldValue("perusahaan", option ? option.value : "");
						}}
						options={perusahaanOptions}
						error={formik.touched.perusahaan ? formik.errors.perusahaan : ""}
						disabled={perusahaanOptions.length === 1}
					/>
					<TextField
						required
						label="Nama Lokasi"
						name="nama_lokasi"
						value={formik.values.nama_lokasi}
						onChange={formik.handleChange}
						onBlur={(e) => formik.handleBlur}
						error={formik.touched.nama_lokasi ? formik.errors.nama_lokasi : ""}
					/>
					<GoogleMapInput data={formik} isEdit={isEdit} isLoaded={isLoaded} />
					<div className="mt-6 flex justify-end">
						<Button loading={addperusahaanLoading} type="submit">
							{isEdit ? "Update" : "Tambah"}
						</Button>
					</div>
				</form>
			</Container>
		</div>
	);
};

export default LokasiAbsenForm;
