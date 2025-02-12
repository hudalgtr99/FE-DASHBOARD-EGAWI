import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "@/actions";
import { pegawaiReducer } from "@/reducers/kepegawaianReducers";
import { API_URL_edeluser } from "@/constants";
import { FaTimes, FaPlus } from "react-icons/fa";

const Lainnya = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { addPegawaiLoading } = useSelector((state) => state.kepegawaian);

	// Extract 'datalainnya' and 'user_id' from localStorage
	const storedData = JSON.parse(localStorage.getItem("editUserData"));
	const user_id = storedData?.datapribadi?.user_id || "";
	const datalainnya = JSON.parse(storedData.datalainnya ? storedData.datalainnya.data : "[]") || [];

	const formik = useFormik({
		initialValues: {
			user_id: user_id,
			lainnya: datalainnya || [],
			datalainnya: datalainnya || [],
		},
		validationSchema: Yup.object().shape({
			lainnya: Yup.array()
				.of(
					Yup.object().shape({
						link: Yup.string().url("Invalid URL").nullable(),
						data: Yup.mixed().required("A file or link is required"),
					})
				)
				.required("At least one item is required"),
		}),
		onSubmit: async (values) => {
			const formData = new FormData();
			formData.append("user_id", user_id);

			// Map your 'lainnya' structure to JSON string
			formData.append(
				"lainnya",
				JSON.stringify(
					values.lainnya.map((item) => ({
						lainnya: item.data ? "" : item.link ? item.link : null,
					}))
				)
			);

			// Append 'datalainnya' to FormData
			values.lainnya.forEach((item) => {
				formData.append("datalainnya", item.data ? item.data : item.link);
			});

			const data = await updateData(
				{ dispatch, redux: pegawaiReducer },
				formData,
				API_URL_edeluser,
				"ADD_PEGAWAI",
				"PUT"
			);

			if (data && !addPegawaiLoading) {
				sessionStorage.getItem("url")
					? (navigate(sessionStorage.getItem("url"), {
							state: {
								activeTab: ["0", "1"].includes(sessionStorage.getItem("activeTab"))
									? sessionStorage.getItem("activeTab")
									: "0",
							},
					  }),
					  sessionStorage.removeItem("url"),
					  sessionStorage.removeItem("activeTab"))
					: navigate("/kepegawaian/data-pegawai"),
					localStorage.removeItem("editUserData");
			}
		},
	});

	// Handle adding a new file input
	const handleAddFile = () => {
		const newLainnya = [...formik.values.lainnya, { data: null, link: "" }];
		formik.setFieldValue("lainnya", newLainnya);
	};

	// Handle removing a file input
	const handleRemoveFile = (index) => {
		const updatedLainnya = formik.values.lainnya.filter((_, i) => i !== index);
		formik.setFieldValue("lainnya", updatedLainnya);
	};

	// Handle file input change
	const handleFileChange = (index) => (event) => {
		const file = event.currentTarget.files[0];

		const updatedLainnya = formik.values.lainnya.map((item, i) => (i === index ? { ...item, data: file } : item));

		formik.setFieldValue("lainnya", updatedLainnya);
	};

	return (
		<div>
			<Container>
				<div className="flex items-center justify-between gap-2 ">
					<div className="flex items-center gap-2 ">
						<button
							className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
							onClick={() => navigate("/kepegawaian/data-pegawai")}
						>
							<IoMdReturnLeft />
						</button>
						<h1>Data Lainnya</h1>
					</div>
					<div className="flex flex-row-reverse gap-1 items-center">
						{formik.values.lainnya.length > 1 && (
							<button
								type="button"
								className="bg-gray-200 p-1 rounded-lg"
								onClick={() => handleRemoveFile(formik.values.lainnya.length - 1)}
							>
								<FaTimes />
							</button>
						)}
						<button type="button" className="bg-gray-200 p-1 rounded-lg" onClick={handleAddFile}>
							<FaPlus />
						</button>
					</div>
				</div>
				<form onSubmit={formik.handleSubmit} className="space-y-6">
					<div className="flex gap-2 justify-end items-center cursor-pointer"></div>
					{formik.values.lainnya.map((item, index) => (
						<div key={index} className="items-center gap-4">
							<label htmlFor={`file-${index}`} className="block">{`File Ke-${index + 1}`}</label>
							<input
								type="file"
								id={`file-${index}`}
								name={`lainnya[${index}].data`}
								accept="application/pdf" // Restrict to PDF files
								onChange={handleFileChange(index)} // Use a closure to pass the index
								onBlur={formik.handleBlur}
								className="block w-full border p-2 rounded-lg text-sm text-gray-500 
                      file:mr-4 file:py-2 file:px-4 
                      file:rounded-full file:border-0 
                      file:text-sm file:font-semibold 
                      file:bg-blue-500 file:text-white 
                      hover:file:bg-blue-600"
							/>
							{formik.touched.lainnya?.[index]?.data && formik.errors.lainnya?.[index]?.data && (
								<span className="text-red-500">{formik.errors.lainnya[index].data}</span>
							)}
							{item.data && (
								<a
									href={typeof item.data === "string" ? item.data : URL.createObjectURL(item.data)}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500"
								>
									Preview File
								</a>
							)}
						</div>
					))}
					<div className="mt-6 flex justify-end">
						<Button loading={addPegawaiLoading} type="submit">
							Simpan
						</Button>
					</div>
				</form>
			</Container>
		</div>
	);
};

export default Lainnya;
