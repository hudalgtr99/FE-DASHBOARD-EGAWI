import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, FileInput, Modal } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "@/actions";
import { pegawaiReducer } from "@/reducers/kepegawaianReducers";
import { API_URL_edeluser } from "@/constants";
import { FaTimes, FaPlus } from "react-icons/fa";

const Pendidikan = ({ onTabChange }) => {
	const { addPegawaiLoading } = useSelector((state) => state.kepegawaian);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const localStorageData = JSON.parse(localStorage.getItem("editUserData"));
	const [isLanjut, setIsLanjut] = useState(false);
	const { pk } = useParams();
	const isEdit = pk && pk !== "add";

	const [showModal, setShowModal] = useState(false);
	const [imageModal, setImageModal] = useState(null);

	const pendidikanData = localStorageData.datapendidikan || {};
	const formalData = Array.isArray(pendidikanData.formal)
		? pendidikanData.formal
		: JSON.parse(pendidikanData.formal || "[]");
	const nonFormalData = Array.isArray(pendidikanData.non_formal)
		? pendidikanData.non_formal
		: JSON.parse(pendidikanData.non_formal || "[]");

	const initialData = {
		user_id: localStorageData.datapribadi.user_id || "",
		formal: formalData.length > 0 ? formalData : [{ asal_sekolah: "", masa_waktu: "", keterangan_pendidikan: "" }],
		non_formal:
			nonFormalData.length > 0 ? nonFormalData : [{ nama_lembaga: "", tahun_lulus: "", sertifikat: null }],
	};

	const formik = useFormik({
		initialValues: initialData,
		onSubmit: async (values) => {
			const formData = new FormData();
			var formal = "";
			var non_formal = "";

			if (values.formal) {
				formal = JSON.stringify(values.formal);
			}
			if (values.non_formal) {
				non_formal = JSON.stringify(values.non_formal);
			}

			const payload = {
				pk: "datapendidikan",
				user_id: values.user_id,
				formal: formal,
				non_formal: non_formal,
			};

			for (const key in payload) {
				formData.append(key, payload[key]);
			}

			values.non_formal.forEach((edu, index) => {
				if (edu.sertifikat) {
					formData.append("non_formal[" + index + "].sertifikat", edu.sertifikat);
				}
			});

			try {
				const response = await updateData(
					{ dispatch, redux: pegawaiReducer },
					formData,
					API_URL_edeluser,
					"ADD_PEGAWAI"
				);

				const storedData = localStorage.getItem("editUserData");
				if (storedData) {
					const parsedData = JSON.parse(storedData);
					parsedData.datapendidikan = {
						...parsedData.datapendidikan,
						...response.data,
					};

					// Save the updated data back to local storage
					localStorage.setItem("editUserData", JSON.stringify(parsedData));
				}

				if (response && !addPegawaiLoading) {
					isLanjut
						? onTabChange("4")
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
			} finally {
				setLoading(false);
			}
		},
	});

	const addFormalEducation = () => {
		formik.setFieldValue("formal", [
			...formik.values.formal,
			{ asal_sekolah: "", masa_waktu: "", keterangan_pendidikan: "" },
		]);
	};

	const addNonFormalEducation = () => {
		formik.setFieldValue("non_formal", [
			...formik.values.non_formal,
			{ nama_lembaga: "", tahun_lulus: "", sertifikat: null },
		]);
	};

	const removeFormalEducation = (index) => {
		const newEducation = formik.values.formal.filter((_, i) => i !== index);
		formik.setFieldValue("formal", newEducation);
	};

	const removeNonFormalEducation = (index) => {
		const newEducation = formik.values.non_formal.filter((_, i) => i !== index);
		formik.setFieldValue("non_formal", newEducation);
	};

	const handleLanjut = () => {
		setIsLanjut(true);
		formik.handleSubmit();
	};

	const handleMundur = () => {
		onTabChange("2");
	};

	const handlePreview = (preview) => {
		setShowModal(true);
		setImageModal(preview);
		console.log("preview", preview);
	};

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
					<h1>Data Pendidikan</h1>
				</div>
				<div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleLanjut();
						}}
						encType="multipart/form-data"
						className="space-y-6"
					>
						{/* Formal Education Section */}
						<div>
							<div className="flex justify-between">
								<h3 className="font-medium">Pendidikan Formal</h3>
								<div className="flex gap-2 items-center">
									{formik.values.formal.length > 1 && (
										<button
											type="button"
											className="bg-gray-200 p-1 rounded-lg"
											onClick={() => removeFormalEducation(formik.values.formal.length - 1)}
										>
											<FaTimes />
										</button>
									)}
									<button
										type="button"
										className="bg-gray-200 p-1 rounded-lg"
										onClick={addFormalEducation}
									>
										<FaPlus />
									</button>
								</div>
							</div>
							{formik.values.formal.map((edu, index) => (
								<div key={index} className="sm:flex block sm:gap-4 max-[640px]:space-y-4 mb-4">
									<TextField
										label="Asal Sekolah"
										name={`formal[${index}].asal_sekolah`}
										value={edu.asal_sekolah}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										error={
											formik.touched.formal?.[index]?.asal_sekolah
												? formik.errors.formal?.[index]?.asal_sekolah
												: ""
										}
									/>
									<TextField
										label="Masa Waktu"
										name={`formal[${index}].masa_waktu`}
										value={edu.masa_waktu}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										error={
											formik.touched.formal?.[index]?.masa_waktu
												? formik.errors.formal?.[index]?.masa_waktu
												: ""
										}
									/>
									<TextField
										label="Keterangan Pendidikan"
										name={`formal[${index}].keterangan_pendidikan`}
										value={edu.keterangan_pendidikan}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										error={
											formik.touched.formal?.[index]?.keterangan_pendidikan
												? formik.errors.formal?.[index]?.keterangan_pendidikan
												: ""
										}
									/>
								</div>
							))}
						</div>

						<hr className="dark:border-base-300" />

						{/* Non-Formal Education Section */}
						<div className="">
							<div className="flex justify-between">
								<div className="flex items-center gap-2">
									<h3 className="font-medium">Pendidikan Non Formal</h3>
								</div>
								<div className="flex gap-2 mb-4 items-center">
									{formik.values.non_formal.length > 1 && (
										<button
											type="button"
											className="bg-gray-200 p-1 rounded-lg"
											onClick={() =>
												removeNonFormalEducation(formik.values.non_formal.length - 1)
											}
										>
											<FaTimes />
										</button>
									)}
									<button
										type="button"
										className="bg-gray-200 p-1 rounded-lg"
										onClick={addNonFormalEducation}
									>
										<FaPlus />
									</button>
								</div>
							</div>
							<div className="flex flex-col gap-3">
								{formik.values.non_formal.map((edu, index) => (
									<div
										key={index}
										className="sm:grid grid-cols-3 block sm:gap-4 max-[640px]:space-y-4 mb-4"
									>
										<div className="flex flex-col gap-2 col-span-2">
											<TextField
												label="Nama Lembaga"
												name={`non_formal[${index}].nama_lembaga`}
												value={edu.nama_lembaga}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												error={
													formik.touched.non_formal?.[index]?.nama_lembaga
														? formik.errors.non_formal?.[index]?.nama_lembaga
														: ""
												}
											/>
											<div className="flex flex-col gap-2">
												<TextField
													label="Tahun Lulus"
													name={`non_formal[${index}].tahun_lulus`}
													value={edu.tahun_lulus}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													error={
														formik.touched.non_formal?.[index]?.tahun_lulus
															? formik.errors.non_formal?.[index]?.tahun_lulus
															: ""
													}
												/>
												{typeof edu.sertifikat === "string" && edu.sertifikat && (
													<div className="">
														<Button
															className="inline-block"
															onClick={() => handlePreview(edu.sertifikat)}
														>
															Lihat Gambar
														</Button>
													</div>
												)}
											</div>
										</div>
										<FileInput
											height={100} // Set your desired height
											accept={{ "image/jpeg": [], "image/png": [] }} // Change to desired file types
											disabled={false}
											maxFiles={1}
											minSize={0}
											maxSize={2097152} // 2 MB
											multiple={false}
											value={edu.sertifikat ? [edu.sertifikat] : []}
											setValue={(files) => {
												formik.setFieldValue(
													`non_formal[${index}].sertifikat`,
													files[0] || null
												);
											}}
										/>
										{formik.errors.non_formal?.[index]?.sertifikat && (
											<div className="text-red-500">
												{formik.errors.non_formal[index].sertifikat}
											</div>
										)}
										{/* <input
                    type="file"
                    name={`non_formal[${index}].sertifikat`}
                    onChange={(event) => {
                      formik.setFieldValue(
                        `non_formal[${index}].sertifikat`,
                        event.currentTarget.files[0]
                      );
                    }}
                    className="border rounded-md p-2"
                  />
                  {formik.errors.non_formal?.[index]?.sertifikat && (
                    <div className="text-red-500">
                      {formik.errors.non_formal[index].sertifikat}
                    </div>
                  )} */}
									</div>
								))}
							</div>
						</div>

						<div className="justify-end flex gap-3">
							<div className="justify-end flex gap-3">
								<Button onClick={() => formik.handleSubmit()} loading={addPegawaiLoading}>
									Simpan
								</Button>
								<Button loading={addPegawaiLoading} type="submit" onClick={handleLanjut}>
									Lanjut
								</Button>
							</div>
						</div>
					</form>
				</div>
				<Modal show={showModal} width="md" setShow={setShowModal} persistent>
					<div>
						<img src={imageModal} alt="" />
					</div>
				</Modal>
			</Container>
		</div>
	);
};

export default Pendidikan;
