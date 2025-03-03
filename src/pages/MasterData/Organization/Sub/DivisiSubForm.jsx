import { addData, updateData } from "@/actions";
import axiosAPI from "@/authentication/axiosApi";
import { Button, Container, Select, TextField } from "@/components";
import { API_URL_createdivisi, API_URL_edeldivisi, API_URL_getspesifikdepartemen } from "@/constants";
import { divisiReducers } from "@/reducers/organReducers";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { IoMdReturnLeft } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

const DivisiSubForm = () => {
	const { addDivisiLoading } = useSelector((state) => state.organ);
	const { pk } = useParams();
	const { state } = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [departemenOptions, setDepartemenOptions] = useState([]);

	const isEdit = pk && pk !== "add";

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axiosAPI.get(API_URL_getspesifikdepartemen);
				setDepartemenOptions(
					response.data.map((item) => ({
						value: item.pk,
						label: item.nama,
					}))
				);
			} catch (error) {
				console.error("Error fetching departemen options: ", error);
			}
		};

		fetchData();
	}, []);

	const formik = useFormik({
		initialValues: {
			nama: state?.item?.nama,
			departemen: state?.item?.departemen?.pk || "",
		},
		validationSchema: Yup.object().shape({
			nama: Yup.string()
				.required("Nama Divisi wajib diisi")
				.max(255, "Nama Divisi harus kurang dari 255 karakter"),
			departemen: Yup.string().required("Nama Departemen wajib diisi"),
		}),
		onSubmit: async (values) => {
			try {
				if (isEdit) {
					const data = await updateData(
						{ dispatch, redux: divisiReducers },
						{
							pk: pk, // Ensure pk is an integer
							nama: values.nama,
							departemen_id: values.departemen,
						},
						API_URL_edeldivisi,
						"ADD_DIVISI"
					);
					if (data && !addDivisiLoading) {
						navigate("/master-data/organization", { state: { activeTab: "1" } });
					}
				} else {
					const data = await addData(
						{ dispatch, redux: divisiReducers },
						{ nama: values.nama, departemen_id: values.departemen },
						API_URL_createdivisi,
						"ADD_DIVISI"
					);
					if (data && !addDivisiLoading) {
						navigate("/master-data/organization", { state: { activeTab: "1" } });
					}
				}
			} catch (error) {
				console.error("Error in form submission: ", error);
			}
		},
	});

	return (
		<div>
			<Container>
				<div className="flex items-center gap-2 mb-4">
					<button
						className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
						onClick={() => navigate("/master-data/organization")}
					>
						<IoMdReturnLeft />
					</button>
					<h1>{isEdit ? "Edit Divisi" : "Tambah Divisi"}</h1>
				</div>
				<div>
					<form onSubmit={formik.handleSubmit} className="space-y-6">
						<Select
							required
							label="Nama Departemen"
							name="departemen"
							value={departemenOptions.find((option) => option.value === formik.values.departemen)}
							onChange={(option) => formik.setFieldValue("departemen", option ? option.value : "")}
							options={departemenOptions}
							error={formik.touched.departemen ? formik.errors.departemen : ""}
						/>
						<TextField
							required
							label="Nama Divisi"
							name="nama"
							value={formik.values.nama}
							onChange={formik.handleChange}
							onBlur={(e) => formik.handleBlur}
							error={formik.touched.nama ? formik.errors.nama : ""}
						/>
						<div className="mt-6 flex justify-end">
							<Button loading={addDivisiLoading} type="submit">
								{isEdit ? "Update" : "Tambah"}
							</Button>
						</div>
					</form>
				</div>
			</Container>
		</div>
	);
};

export default DivisiSubForm;
