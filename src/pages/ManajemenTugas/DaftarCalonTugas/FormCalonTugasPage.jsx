import { addFormData, updateFormData } from "@/actions";
import { Button, Container, TextArea, TextField } from "@/components";
import { API_URL_delegation } from "@/constants";
import { delegationReducer } from "@/reducers/delegationReducers";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const FormCalonTugasPage = () => {
	const { state } = useLocation();

	const { getDelegationLoading } = useSelector((state) => state.delegation);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			id: state?.id,
			title: state?.title || "",
			description: state?.description || "",
		},
		validationSchema: Yup.object({
			title: Yup.string().required("Judul harus diisi"),
			description: Yup.string().required("Deskripsi harus diisi"),
		}),
		onSubmit: (values) => {
			const formData = new FormData();
			formData.append("title", values.title);
			formData.append("description", values.description);
			formData.append("type", "eksternal");

			try {
				if (values.id) {
					updateFormData(
						{ dispatch, redux: delegationReducer },
						formData,
						API_URL_delegation,
						"ADD_DELEGATION",
						values.id
					);
				} else {
					addFormData(
						{ dispatch, redux: delegationReducer },
						formData,
						API_URL_delegation,
						"ADD_DELEGATION"
					);
				}
				navigate(-1);
			} catch (error) {
				console.log(error);
			}
		},
	});

	return (
		<div>
			<Container>
				<div className="mb-2">
					{state?.id
						? "Edit Data Calon Tugas"
						: "Tambah Data Calon Tugas"}
				</div>
				<div>
					<form onSubmit={formik.handleSubmit}>
						<div className="space-y-1 mb-4">
							<TextField
								label="Judul Calon Tugas"
								name="title"
								placeholder="Judul"
								value={formik.values.title}
								onChange={formik.handleChange}
								error={
									formik.touched.title && formik.errors.title
								}
							/>
							<TextArea
								label="Deskripsi"
								name="description"
								placeholder="Deskripsi"
								value={formik.values.description}
								onChange={formik.handleChange}
								rows={3}
								error={
									formik.touched.description &&
									formik.errors.description
								}
							/>
						</div>
						<div className="flex justify-end gap-x-3">
							<Button color="base" onClick={() => navigate(-1)}>
								Batal
							</Button>
							<Button
								type="submit"
								loading={getDelegationLoading}
							>
								Simpan
							</Button>
						</div>
					</form>
				</div>
			</Container>
		</div>
	);
};

export default FormCalonTugasPage;
