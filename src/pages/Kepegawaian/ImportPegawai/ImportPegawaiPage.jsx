import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import { BsDownload } from "react-icons/bs";
import { Button, Container, Select, Modal, Tables, Tooltip } from "@/components";
import { useDispatch } from "react-redux";
import { addData } from "@/actions";
import { pegawaiReducer } from "@/reducers/kepegawaianReducers";
import { API_URL_importdatapribadipegawai, API_URL_getperusahaan, API_URL_getlokasiabsen } from "@/constants";
import axiosAPI from "@/authentication/axiosApi";
import { FileInput } from "../../../components";
import * as XLSX from "xlsx";

const ImportPegawai = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { state } = useLocation();
	const [perusahaanOptions, setPerusahaanOptions] = useState([]);
	const [lokasiOptions, setLokasiOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [jsonData, setJsonData] = useState([]);
	const [excelModal, setExcelModal] = useState(false);
	const [importedDataLoading, setImportedDataLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axiosAPI.get(API_URL_getperusahaan);
				const options = response.data.map((item) => ({
					value: item.pk,
					label: item.nama,
				}));
				setPerusahaanOptions(options);

				if (options.length === 1 || state?.item?.perusahaan) {
					const perusahaanId = state?.item?.perusahaan?.id || options[0].value;
					formik.setFieldValue("perusahaan", perusahaanId);
				}

				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching perusahaan data:", error);
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const initialValues = {
		perusahaan: state?.item?.perusahaan?.id || "",
		lokasi_absen: state?.item?.lokasi_absen || [],
		excel: null,
	};

	const formik = useFormik({
		initialValues,
		validationSchema: Yup.object().shape({
			perusahaan: Yup.number().required("Perusahaan wajib diisi"),
			excel: Yup.mixed()
				.required("File Excel wajib diisi")
				.test(
					"fileType",
					"Hanya file excel yang diizinkan",
					(value) =>
						!value ||
						(value &&
							(value.type === "application/vnd.ms-excel" ||
								value.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
				),
			lokasi_absen: Yup.array().required("Lokasi Absen wajib diisi"),
		}),
		onSubmit: async (values) => {
			setImportedDataLoading(false);
			const formData = new FormData();
			formData.append("perusahaan_id", values.perusahaan);
			formData.append("lokasi_absen_ids", JSON.stringify(values.lokasi_absen.map((option) => option.value)));
			formData.append("excel", values.excel);

			try {
				await addData(
					{ dispatch, redux: pegawaiReducer },
					formData,
					API_URL_importdatapribadipegawai,
					"ADD_PEGAWAI",
					{ headers: { "Content-Type": "multipart/form-data" } }
				);
				navigate("/kepegawaian/data-pegawai");
			} catch (error) {
				console.error("Error in form submission: ", error);
			} finally {
				setExcelModal(false);
				setImportedDataLoading(true);
			}
		},
	});

	useEffect(() => {
		const fetchData = async () => {
			const response = await axiosAPI.get(API_URL_getlokasiabsen);
			setLokasiOptions(
				response.data.map((item) => ({
					value: item.id,
					label: item.nama_lokasi,
				}))
			);
		};

		fetchData();
	}, []);

	function handleTableExcel(e) {
		e.preventDefault();
		formik.setTouched({
			perusahaan: true,
			lokasi_absen: true,
			excel: true,
		});

		if (formik.isValid) {
			setExcelModal(true);
			const file = formik.values.excel;
			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const data = e.target.result;
					const workbook = XLSX.read(data, { type: "binary" });
					const sheetName = workbook.SheetNames[0];
					const worksheet = workbook.Sheets[sheetName];
					const json = XLSX.utils.sheet_to_json(worksheet);

					const updatedJson = json.map((item) => {
						const renamedItem = {};
						Object.keys(item).forEach((key) => {
							const newKey = key.toLowerCase().replace(/\s+/g, "_");
							renamedItem[newKey] = item[key];
						});

						return {
							...renamedItem,
							perusahaan: formik.values.perusahaan,
							lokasi_absen: formik.values.lokasi_absen,
						};
					});

					setJsonData(updatedJson);
				};
				reader.readAsBinaryString(file);
			}
		}
	}

	const downloadExcelFile = () => {
		const headers = [
			"Nama",
			"Email",
			"No Identitas",
			"Jenis Kelamin",
			"No Telepon",
			"Tempat Lahir",
			"Tanggal Lahir",
			"Agama",
			"NPWP",
			"Alamat KTP",
			"Alamat Domisili",
		];

		// Mengubah header kolom menjadi worksheet Excel
		const ws = XLSX.utils.aoa_to_sheet([headers]); // AOA = Array of Arrays
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

		// Menyimpan file Excel dengan nama "dummy-file.xlsx"
		XLSX.writeFile(wb, "template-kepegawaian.xlsx");
	};

	return (
		<div>
			<Container>
				<div className="flex items-center gap-2 mb-4 justify-between">
					<div className="flex items-center gap-2">
						<button
							className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
							onClick={() => navigate("/kepegawaian/data-pegawai")}
						>
							<IoMdReturnLeft />
						</button>
						<h1>Import Data Pribadi Pegawai</h1>
					</div>
					<Tooltip placement="left" tooltip="Download template table">
						<button
							className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
							onClick={downloadExcelFile}
						>
							<BsDownload className="text-base" />
						</button>
					</Tooltip>
				</div>
				<div>
					<form onSubmit={handleTableExcel} className="space-y-6">
						<div className="flex flex-col">
							<div className="">
								<label
									style={{
										fontSize: "14px",
									}}
									className={`mb-2 font-[400]`}
								>
									File Excel
								</label>
								<FileInput
									text={"Drag 'n' drop some Excel file here."}
									height={70}
									accept={{
										"application/vnd.ms-excel": [],
										"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
									}}
									maxFiles={1}
									minSize={0}
									maxSi
									ze={2097152} // 2 MB
									multiple={false}
									value={formik.values.excel ? [formik.values.excel] : []}
									setValue={(files) => {
										formik.setFieldValue("excel", files[0] || null);
									}}
								/>
							</div>
							<div
								style={{
									fontSize: "11px",
								}}
								className="leading-none tracking-wide mt-1 text-danger-500"
							>
								{formik.touched.excel ? formik.errors.excel : ""}
							</div>
						</div>
						<div className="sm:flex block sm:gap-4 max-[640px]:space-y-4">
							<Select
								required
								label="Perusahaan"
								name="perusahaan_id"
								value={
									perusahaanOptions.find((option) => option.value === formik.values.perusahaan) ||
									null
								}
								onChange={(option) => formik.setFieldValue("perusahaan", option.value || "")}
								options={perusahaanOptions}
								error={formik.touched.perusahaan ? formik.errors.perusahaan : ""}
								disabled={perusahaanOptions.length === 1}
							/>
							<Select
								required
								multi
								label="Lokasi Absen"
								name="lokasi_absen"
								value={
									formik.values.lokasi_absen.map((item) => ({
										value: item.value,
										label: item.label,
									})) || []
								}
								onChange={(option) => formik.setFieldValue("lokasi_absen", option || "")}
								options={lokasiOptions}
								error={formik.touched.lokasi_absen ? formik.errors.lokasi_absen : ""}
							/>
						</div>
						<div className="justify-end flex gap-3">
							<Button type="submit">Preview table</Button>
						</div>
					</form>
				</div>
			</Container>
			<Modal show={excelModal} setShow={setExcelModal} width="full" persistent>
				<div className="text-lg font-normal p-5">
					<div className="mb-3">
						{jsonData.find((data) => data.example === true) ? "Contoh" : "Preview"} Table
					</div>
					<Tables>
						<Tables.Head>
							<tr>
								<Tables.Header>Nama</Tables.Header>
								<Tables.Header>Email</Tables.Header>
								<Tables.Header>No Identitas</Tables.Header>
								<Tables.Header>Jenis Kelamin</Tables.Header>
								<Tables.Header>No Telepon</Tables.Header>
								<Tables.Header>Tempat Lahir</Tables.Header>
								<Tables.Header>Tanggal Lahir</Tables.Header>
								<Tables.Header>Agama</Tables.Header>
								<Tables.Header>NPWP</Tables.Header>
								<Tables.Header>Alamat KTP</Tables.Header>
								<Tables.Header>Alamat Domisili</Tables.Header>
							</tr>
						</Tables.Head>
						<Tables.Body>
							{jsonData.map((item, index) => (
								<tr key={index}>
									<Tables.Data>{item?.nama || "-"}</Tables.Data>
									<Tables.Data>{item?.email || "-"}</Tables.Data>
									<Tables.Data>{item?.no_identitas || "-"}</Tables.Data>
									<Tables.Data>{item?.jenis_kelamin || "-"}</Tables.Data>
									<Tables.Data>{item?.no_telepon || "-"}</Tables.Data>
									<Tables.Data>{item?.tempat_lahir || "-"}</Tables.Data>
									<Tables.Data>{item?.tanggal_lahir || "-"}</Tables.Data>
									<Tables.Data>{item?.agama || "-"}</Tables.Data>
									<Tables.Data>{item?.npwp || "-"}</Tables.Data>
									<Tables.Data>{item?.alamat_ktp || "-"}</Tables.Data>
									<Tables.Data>{item?.alamat_domisili || "-"}</Tables.Data>
								</tr>
							))}
						</Tables.Body>
					</Tables>

					{jsonData.find((data) => data.example === true) ? null : (
						<div className="mt-14">
							<div className="text-sm flex justify-end gap-2 absolute bottom-5 right-5">
								<Button onClick={() => setExcelModal(false)} variant="tonal" color="base">
									Cancel
								</Button>
								<Button
									onClick={() => formik.handleSubmit()}
									variant="flat"
									color="primary"
									loading={!importedDataLoading}
									disabled={!importedDataLoading}
								>
									Import
								</Button>
							</div>
						</div>
					)}
				</div>
			</Modal>
		</div>
	);
};

export default ImportPegawai;
