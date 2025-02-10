import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { addFormData, decrypted_id, updateFormData } from "@/actions";
import { API_URL_templates } from "@/constants";
import { AuthContext } from "@/context/AuthContext";
import axiosAPI from "@/authentication/axiosApi";
import * as Yup from "yup";
import { templateReducer } from "@/reducers/templateReducers";
import { CKEditor } from "ckeditor4-react";
import { TbArrowBack } from "react-icons/tb";
import { SyncLoader } from "react-spinners";

const FormTemplatePage = () => {
  const { pk } = useParams();
  const { addTemplateLoading } = useSelector((state) => state.template);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const editorRef = useRef();
  const [refreshEditor, setRefreshEditor] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      message: "",
      subject: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("nama wajib diisi"),
      type: Yup.string().required("type wajib diisi"),
      message: Yup.string().required("message wajib diisi"),
      subject: Yup.string().required("subject wajib diisi"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      // Validasi manual setiap field
      const errors = {};

      if (values.password === "" && !pk) {
        errors.password = "Password is required";
      }

      if (Object.keys(errors).length > 0) {
        console.log(errors);
        formik.setErrors(errors);
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("message", values.message);
      formData.append("subject", values.subject);

      try {
        if (pk) {
          const dekrip_id = decrypted_id(pk);
          updateFormData(
            { dispatch, redux: templateReducer },
            formData,
            API_URL_templates,
            "UPDATE_TEMPLATE",
            dekrip_id + "/"
          );
        } else {
          addFormData(
            { dispatch, redux: templateReducer },
            formData,
            API_URL_templates,
            "ADD_TEMPLATE"
          );
        }
        navigate(-1);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const toolbarConfig = {
    extraPlugins: "font,colorbutton,colordialog",
    removePlugins: "about,image",
    skin: "moono",
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
      // Jika tombol Enter ditekan bersamaan dengan Ctrl
      formik.handleSubmit();
    }
  };

  // Jika ada Pk maka Fetching data lama
  const get = useCallback(async () => {
    if (decrypted_id(pk)) {
      const response = await axiosAPI.get(
        API_URL_templates + decrypted_id(pk) + "/"
      );
      const dataResponse = response.data;

      formik.setFieldValue("name", dataResponse?.name);
      formik.setFieldValue("type", dataResponse?.type);
      formik.setFieldValue("message", dataResponse?.message);
      formik.setFieldValue("subject", dataResponse?.subject);
    } else {
      navigate(-1);
    }
  }, [pk]);

  useEffect(() => {
    if (pk) {
      get();
    }
  }, [pk]);

  // Mengatur data CKEditor setelah data diambil
  useEffect(() => {
    if (formik.values.message) {
      setRefreshEditor(!refreshEditor);
    }
  }, [formik.values.message]);

  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white dark:bg-gray-500 dark:text-gray-200 rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate(-1)}
          >
            <IoMdReturnLeft />
          </button>
          <h1>
            {pk ? "Edit Data Template Email" : "Tambah Data Template Email"}
          </h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} onKeyDown={handleKeyDown}>
            <div className="h-auto w-auto px-4 bg-neutral dark:bg-base-600  dark:border-base-500 object-left">
              <div className="mt-4 grid grid-cols-12 gap-3 mb-4">
                <div className="col-span-full md:col-span-6 mb-1.5">
                  <TextField
                    type="text"
                    label="Type Template"
                    required
                    name="type"
                    id="type"
                    error={formik.touched.type && formik.errors.type}
                    placeholder="Type Template"
                    value={formik.values.type}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  />
                </div>

                <div className="col-span-full mb-1.5 md:col-span-6">
                  <TextField
                    type="text"
                    label="Name Description"
                    required
                    name="name"
                    id="name"
                    error={formik.touched.name && formik.errors.name}
                    placeholder="Name Description Template"
                    value={formik.values.name}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  />
                </div>

                <div className="col-span-full mb-1.5">
                  <TextField
                    type="text"
                    label="Subject"
                    name="subject"
                    required
                    id="subject"
                    error={formik.touched.subject && formik.errors.subject}
                    placeholder="Subject"
                    value={formik.values.subject}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  />
                </div>

                <div className="col-span-full mb-1.5 ">
                  <div>
                    <label className="text-sm">
                      Message <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <CKEditor
                    key={refreshEditor}
                    config={toolbarConfig}
                    type="classic"
                    initData={formik.values.message}
                    onChange={(e) => {
                      formik.setFieldValue("message", e.editor.getData());
                    }}
                  />
                  {formik.touched.message && formik.errors.message && (
                    <div className="text-red-500 dark:text-red-300 text-xs">
                      {formik.errors.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-12 gap-3 mb-4">
                <div className="col-span-full mb-1.5 flex justify-between">
                  <Button
                    type="button"
                    color="base"
                    variant="flat"
                    className="flex items-center gap-1"
                    onClick={() => window.history.back()}
                  >
                    <TbArrowBack />
                    Back
                  </Button>
                  <Button type="submit" disabled={addTemplateLoading}>
                    {addTemplateLoading ? (
                      <SyncLoader size={10} color="#fff" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* <div className=" justify-between flex flex-row gap-3">
            <Button color="base" onClick={() => navigate(-1)}>
              Batal
            </Button>
            <Button
              onClick={() => formik.handleSubmit()}
              loading={getTemplateLoading}
            >
              Simpan
            </Button>
          </div> */}
        </div>
      </Container>
    </div>
  );
};

export default FormTemplatePage;
