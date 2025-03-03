import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, Select } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "@/actions";
import { pegawaiReducer } from "@/reducers/kepegawaianReducers";
import { API_URL_edeluser, API_URL_getmasterpegawai } from "@/constants";
import axiosAPI from "@/authentication/axiosApi";

const Pegawai = ({ onTabChange }) => {
	const { pk } = useParams();
	const { addPegawaiLoading } = useSelector((state) => state.kepegawaian);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [jabatanOptions, setJabatanOptions] = useState([]);
	const [departemenOptions, setDepartemenOptions] = useState([]);
	const [isLanjut, setIsLanjut] = useState(false);
	const isEdit = pk && pk !== "add";

	useEffect(() => {
		const fetchData = async () => {
			const response = await axiosAPI.get(API_URL_getmasterpegawai);
			setJabatanOptions(
				response.data.jabatan.map((item) => ({
					value: item.pk,
					label: item.nama,
				}))
			);
			setDepartemenOptions(
				response.data.departemen.map((item) => ({
					value: item.pk,
					label: item.nama,
				}))
			);
		};
		fetchData();
	}, []);

	// Ambil data pegawai dari localStorage
	const localStorageData = JSON.parse(localStorage.getItem("editUserData"));
	const initialData = localStorageData ? localStorageData.datapegawai : null;

	// Formik setup for form handling and validation
	const formik = useFormik({
		initialValues: {
			user_id: initialData?.user_id || "",
			id_pegawai: initialData?.id_pegawai || "",
			jabatan_id: initialData?.jabatan_id || initialData?.jabatan?.id || "",
			tgl_bergabung: initialData?.tgl_bergabung || "",
			tgl_resign: initialData?.tgl_resign || "",
			status: initialData?.status || "",
			departemen_id: initialData?.departemen_id || initialData?.departemen?.id || "",
		},
		validationSchema: Yup.object().shape({
			id_pegawai: Yup.string().required("ID Pegawai wajib diisi"),
			jabatan_id: Yup.string().required("Jabatan wajib diisi"),
			tgl_bergabung: Yup.date().required("Tanggal Bergabung wajib diisi"),
			status: Yup.string().required("Status wajib diisi"),
			departemen_id: Yup.string().required("Departemen wajib diisi"),
		}),
		onSubmit: async (values) => {
			const updatedValues = {
				...values,
				user_id: localStorageData.datapribadi.user_id, // Update here
			};
			try {
				const data = await updateData(
					{ dispatch, redux: pegawaiReducer },
					{
						pk: "datapegawai", // Only send `pk` if it's an edit
						...updatedValues,
					},
					API_URL_edeluser, // Single API URL used for both add and update
					"ADD_PEGAWAI" // Unified action for add/update
				);
				if (data && !addPegawaiLoading) {
					if (isLanjut) {
						sessionStorage.setItem("Pegawai", true);
						sessionStorage.setItem("Keluarga", true);
					}

					isLanjut
						? onTabChange("2")
						: (sessionStorage.getItem("url")
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
						  localStorage.removeItem("editUserData"));
				}
			} catch (error) {
				console.error("Error in form submission: ", error);
			}
		},
	});

	const handleLanjut = () => {
		setIsLanjut(true);
		formik.handleSubmit();
		const storedData = localStorage.getItem("editUserData");
		if (storedData) {
			const parsedData = JSON.parse(storedData);
			parsedData.datapegawai = { ...parsedData.datapegawai, ...formik.values };

			// Save the updated data back to local storage
			localStorage.setItem("editUserData", JSON.stringify(parsedData));
		}
	};

	const handleMundur = () => {
		onTabChange("0");
	};

	// console.log("isi data:", formik.values);

	return (
		<div>
			<Container>
				<div className="flex items-center gap-2 mb-4">
					<button
						className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
						onClick={handleMundur}
					>
						<IoMdReturnLeft />
					</button>
					<h1>Data Pegawai</h1>
				</div>
				<div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
						}}
						className="space-y-6"
					>
						<div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
							<TextField
								required
								label="ID Pegawai"
								name="id_pegawai"
								value={formik.values.id_pegawai}
								onChange={formik.handleChange}
								onBlur={(e) => formik.handleBlur}
								error={formik.touched.id_pegawai ? formik.errors.id_pegawai : ""}
							/>
							<Select
								required
								label="Jabatan" // Change here
								name="jabatan_id" // Change here
								value={
									jabatanOptions.find(
										(option) => option.value === Number(formik.values.jabatan_id) // Change here
									) || null
								}
								onChange={
									(option) => formik.setFieldValue("jabatan_id", option ? option.value : "") // Change here
								}
								options={jabatanOptions}
								error={
									formik.touched.jabatan_id ? formik.errors.jabatan_id : "" // Change here
								}
							/>
						</div>
						<div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
							<Select
								required
								label="Departemen"
								name="departemen_id"
								value={
									departemenOptions.find((option) => option.value === formik.values.departemen_id) ||
									null
								}
								onChange={(option) => formik.setFieldValue("departemen_id", option ? option.value : "")}
								options={departemenOptions}
								error={formik.touched.departemen_id ? formik.errors.departemen_id : ""}
							/>
							{/*  <Select
                required
                label="Divisi"
                name="divisi_id"
                value={
                  divisiOptions.find(
                    (option) => option.value === formik.values.divisi_id
                  ) || null
                }
                onChange={(option) =>
                  formik.setFieldValue("divisi_id", option ? option.value : "")
                }
                options={divisiOptions}
                error={formik.touched.divisi_id ? formik.errors.divisi_id : ""}
              />
            </div>
            <div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
              <Select
                required
                label="Unit"
                name="unit_id"
                value={
                  unitOptions.find(
                    (option) => option.value === formik.values.unit_id
                  ) || null
                }
                onChange={(option) =>
                  formik.setFieldValue("unit_id", option ? option.value : "")
                }
                options={unitOptions}
                error={formik.touched.unit_id ? formik.errors.unit_id : ""}
              /> */}
							<Select
								required
								label="Status"
								name="status"
								value={
									formik.values.status
										? {
												value: formik.values.status,
												label: formik.values.status,
										  }
										: null
								}
								onChange={(option) => formik.setFieldValue("status", option ? option.value : "")}
								options={[
									{ value: "Percobaan", label: "Percobaan" },
									{ value: "Kontrak", label: "Kontrak" },
									{ value: "Permanen", label: "Permanen" },
								]}
								error={formik.touched.status ? formik.errors.status : ""}
							/>
							<TextField
								required
								label="Tanggal Bergabung"
								name="tgl_bergabung"
								type="date"
								value={formik.values.tgl_bergabung}
								onChange={formik.handleChange}
								onBlur={(e) => formik.handleBlur}
								error={formik.touched.tgl_bergabung ? formik.errors.tgl_bergabung : ""}
							/>
						</div>
						<div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
							{!isEdit ||
								(localStorageData.datapribadi.is_staff === false && (
									<TextField
										label="Tanggal Resign"
										name="tgl_resign"
										type="date"
										value={formik.values.tgl_resign}
										onChange={formik.handleChange}
										onBlur={(e) => formik.handleBlur}
										error={formik.touched.tgl_resign ? formik.errors.tgl_resign : ""}
									/>
								))}
						</div>
						<div className="justify-end flex gap-3">
							<div className="justify-end flex gap-3">
								<Button onClick={() => formik.handleSubmit()} loading={addPegawaiLoading}>
									Simpan
								</Button>
								<Button onClick={() => handleLanjut()} loading={addPegawaiLoading} type="submit">
									Lanjut
								</Button>
							</div>
						</div>
					</form>
				</div>
			</Container>
		</div>
	);
};

export default Pegawai;
