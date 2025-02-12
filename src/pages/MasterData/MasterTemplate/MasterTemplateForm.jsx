import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, Select } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { addData, updateData } from "@/actions";
import { penugasanReducer } from "@/reducers/penugasanReducers";
import { API_URL_getperusahaan, API_URL_createtemplatesurattugas, API_URL_edeltemplatesurattugas } from "@/constants";
import CKEditor from "../../../components/forms/CKEditor";
import axiosAPI from "@/authentication/axiosApi";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import { Drawer, SuratTutorial, Tooltip } from "../../../components";
import { MdQuestionMark } from "react-icons/md";

const MasterTemplateForm = () => {
	const { addTugasLoading } = useSelector((state) => state.tugas);
	const { pk } = useParams();
	const { state } = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [idTemplate, setIdTemplate] = useState(pk);

	const [drawer, setDrawer] = useState(false);

	const [perusahaanOptions, setPerusahaanOptions] = useState([]);
	const [perusahaan, Setperusahaan] = useState([]);
	const [role, setRole] = useState("");

	useEffect(() => {
		const token = isAuthenticated();
		const jwt = jwtDecode(token);
		setRole(jwt.level);
	}, []);

	const isEdit = pk && pk !== "add";

	const formik = useFormik({
		initialValues: {
			nama: state?.item?.nama || "",
			isi: state?.item?.isi || "",
			perusahaan: state?.item?.perusahaan || "",
		},
		validationSchema: Yup.object().shape({
			nama: Yup.string().required("Nama is required").max(255, "Nama template harus kurang dari 255 karakter"),
			perusahaan: Yup.mixed().required("Perusahaan wajib diisi"),
		}),

		onSubmit: async (values) => {
			values.isi = sessionStorage.getItem("ckeditor");
			if (isEdit) {
				if (idTemplate) {
					const data = await updateData(
						{ dispatch, redux: penugasanReducer },
						{ pk: idTemplate, data: values },
						API_URL_edeltemplatesurattugas,
						"ADD_TUGAS"
					);
					if (data && !addTugasLoading) {
						navigate(
							sessionStorage.getItem("url")
								? sessionStorage.getItem("url")
								: "/master-data/master-template"
						);
						sessionStorage.removeItem("url");
						sessionStorage.removeItem("ckeditor");
					}
				} else {
					console.error("ID is undefined for updating the task.");
				}
			} else {
				const data = await addData(
					{ dispatch, redux: penugasanReducer },
					values,
					API_URL_createtemplatesurattugas,
					"ADD_TUGAS"
				);
				if (data && !addTugasLoading) {
					navigate(
						sessionStorage.getItem("url") ? sessionStorage.getItem("url") : "/master-data/master-template"
					);
					sessionStorage.removeItem("url");
					sessionStorage.removeItem("ckeditor");
				}
			}
		},
	});

	useEffect(() => {
		const fetchAllData = async () => {
			try {
				const [perusahaanResponse] = await Promise.all([axiosAPI.get(API_URL_getperusahaan)]);

				const options = perusahaanResponse.data.map((item) => ({
					value: item.pk,
					label: item.nama,
					slug: item.slug,
				}));
				setPerusahaanOptions(options);
				Setperusahaan(perusahaanResponse.data);

				if (options.length === 1 || state?.item?.perusahaan) {
					const perusahaanSlug = state?.item?.perusahaan?.slug;
					const perusahaanId =
						perusahaanSlug && options.find((opt) => opt.slug === perusahaanSlug)
							? options.find((opt) => opt.slug === perusahaanSlug).value
							: state?.item?.perusahaan?.id || options[0].value;

					formik.setFieldValue("perusahaan", perusahaanId);
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchAllData();
	}, []);

	useEffect(() => {
		if (isEdit) {
			setIdTemplate(pk);
		}
	}, [pk, isEdit]);

	// console.log(formik.values)

	return (
		<Container>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2 mb-4">
					<button
						className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
						onClick={() => {
							navigate(
								sessionStorage.getItem("url")
									? sessionStorage.getItem("url")
									: "/master-data/master-template"
							);
							sessionStorage.removeItem("url");
						}}
					>
						<IoMdReturnLeft />
					</button>
					<h1>{isEdit ? "Edit Template" : "Tambah Template"}</h1>
				</div>
				{/* <Tooltip placement="left" tooltip="Lihat tutorial">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => setDrawer(true)}
          >
            <MdQuestionMark className="text-base" />
            <Drawer dismiss title="Tutorial" open={drawer} setOpen={setDrawer}>
              <SuratTutorial />
            </Drawer>
          </button>
        </Tooltip> */}
			</div>
			<form onSubmit={formik.handleSubmit} className="space-y-6">
				<Select
					required
					label="Perusahaan"
					name="perusahaan"
					value={perusahaanOptions.find((option) => option.value === formik.values.perusahaan) || null}
					onChange={(option) => {
						formik.setFieldValue("perusahaan", option ? option.value : "");
					}}
					options={perusahaanOptions}
					error={formik.touched.perusahaan && formik.errors.perusahaan}
					disabled={perusahaanOptions.length === 1}
				/>
				<TextField
					required
					label="Nama Template"
					name="nama"
					value={formik.values.nama}
					onChange={formik.handleChange}
					onBlur={(e) => formik.handleBlur}
					error={formik.touched.nama && formik.errors.nama}
				/>
				<div className="w-full">
					<CKEditor
						isTemplate={true}
						perusahaan={role !== "Super Admin" && perusahaan[0]}
						values={formik.values.isi}
						isEditTemplate={isEdit}
					/>
				</div>

				<div className="mt-6 flex justify-end">
					<Button loading={addTugasLoading} type="submit">
						{isEdit ? "Update" : "Tambah"}
					</Button>
				</div>
			</form>
		</Container>
	);
};

export default MasterTemplateForm;
