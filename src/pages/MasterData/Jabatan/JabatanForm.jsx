import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, Select } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { addData, decrypted_id, updateData } from "@/actions";
import { jabatanReducers } from "@/reducers/strataReducers";
import { API_URL_createjabatan, API_URL_edeljabatan, API_URL_getperusahaan } from "@/constants";
import axiosAPI from "@/authentication/axiosApi";
import KewenanganModal from "../../../components/molecules/KewenanganModal";
import { FaCircleQuestion } from "react-icons/fa6";

const JabatanSubForm = () => {
	const { pk } = useParams();
	const { state } = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { addJabatanLoading } = useSelector((state) => state.strata);
	const [perusahaanOptions, setPerusahaanOptions] = useState([]);
	const [levelOptions] = useState([
		{ value: 1, label: "Tingkat 1: Penuh" },
		{ value: 2, label: "Tingkat 2: Tinggi" },
		{ value: 3, label: "Tingkat 3: Menengah" },
		{ value: 4, label: "Tingkat 4: Dasar" },
	]);
	const [showKewenanganModal, setShowKewenanganModal] = useState(false);
	const isEdit = pk && pk !== "add";

	useEffect(() => {
		const fetchPerusahaanOptions = async () => {
			try {
				const response = await axiosAPI.get(API_URL_getperusahaan);
				const options = response.data.map((item) => ({
					value: item.pk,
					label: item.nama,
					slug: item.slug,
				}));
				setPerusahaanOptions(options);

				if (options.length === 1 || state?.item?.perusahaan) {
					const perusahaanSlug = state?.item?.perusahaan?.slug;
					const perusahaanId =
						perusahaanSlug && options.find((opt) => opt.slug === perusahaanSlug)
							? options.find((opt) => opt.slug === perusahaanSlug).value
							: state?.item?.perusahaan?.id || options[0].value;

					formik.setFieldValue("perusahaan", perusahaanId);
					console.log(perusahaanId);
				}

				// Set default value for perusahaan if editing
				if (isEdit && state?.item?.perusahaan) {
					formik.setFieldValue("perusahaan", state.item.perusahaan.id);
				}
			} catch (error) {
				console.error("Error fetching perusahaan data:", error);
			}
		};

		fetchPerusahaanOptions();
	}, [isEdit, state]);

	const formik = useFormik({
		initialValues: {
			nama: state?.item?.nama || "",
			keterangan: state?.item?.keterangan || "",
			level: state?.item?.level || "",
			perusahaan: state?.item?.perusahaan?.id || "", // Set initial value for perusahaan
		},
		validationSchema: Yup.object().shape({
			nama: Yup.string()
				.required("Nama Jabatan wajib diisi")
				.max(255, "Nama Jabatan harus kurang dari 255 karakter"),
			level: Yup.number().required("Level Jabatan wajib diisi"),
			perusahaan: Yup.mixed().required("Perusahaan wajib diisi"),
		}),
		onSubmit: async (values) => {
			if (isEdit) {
				const data = await updateData(
					{ dispatch, redux: jabatanReducers },
					{ pk: decrypted_id(pk), ...values },
					API_URL_edeljabatan,
					"ADD_JABATAN"
				);
				if (data && !addJabatanLoading) {
					navigate(sessionStorage.getItem("url") ? sessionStorage.getItem("url") : "/master-data/jabatan");
					sessionStorage.removeItem("url");
				}
			} else {
				const data = await addData(
					{ dispatch, redux: jabatanReducers },
					values,
					API_URL_createjabatan,
					"ADD_JABATAN"
				);
				if (data && !addJabatanLoading) {
					navigate(sessionStorage.getItem("url") ? sessionStorage.getItem("url") : "/master-data/jabatan");
					sessionStorage.removeItem("url");
				}
			}
		},
	});

	console.log(state?.item);

	return (
		<div>
			<Container>
				<div className="flex items-center gap-2 mb-4">
					<button
						className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
						onClick={() => {
							navigate(
								sessionStorage.getItem("url") ? sessionStorage.getItem("url") : "/master-data/jabatan"
							);
							sessionStorage.removeItem("url");
						}}
					>
						<IoMdReturnLeft />
					</button>
					<h1>{isEdit ? "Edit Jabatan" : "Tambah Jabatan"}</h1>
				</div>
				<div>
					<form onSubmit={formik.handleSubmit} className="space-y-6">
						<div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
							<Select
								label="Perusahaan"
								name="perusahaan"
								value={
									perusahaanOptions.find((option) => option.value === formik.values.perusahaan) ||
									null
								}
								onChange={(option) => {
									formik.setFieldValue("perusahaan", option ? option.value : "");
								}}
								options={perusahaanOptions}
								error={formik.touched.perusahaan ? formik.errors.perusahaan : ""}
								disabled={perusahaanOptions.length === 1}
							/>
							<TextField
								required
								label="Nama Jabatan"
								name="nama"
								value={formik.values.nama}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								error={formik.touched.nama ? formik.errors.nama : ""}
							/>

							<div className="w-full">
								<button
									type="button"
									className="flex flex-row gap-2 items-center"
									onClick={() => setShowKewenanganModal(!showKewenanganModal)}
								>
									Tingkat Kewenangan <FaCircleQuestion size={15} color="orange" />
								</button>
								<Select
									label=""
									name="level"
									value={levelOptions.find((option) => option.value === formik.values.level) || null}
									onChange={(option) => {
										formik.setFieldValue("level", option ? option.value : "");
									}}
									options={levelOptions}
									error={formik.touched.level ? formik.errors.level : ""}
									disabled={levelOptions.length === 1}
								/>
							</div>
						</div>
						<div className="mt-6 flex justify-end">
							<Button loading={addJabatanLoading} type="submit">
								{isEdit ? "Update" : "Tambah"}
							</Button>
						</div>
					</form>
				</div>
			</Container>
			<KewenanganModal showModal={showKewenanganModal} setShowModal={setShowKewenanganModal} />
		</div>
	);
};

export default JabatanSubForm;
