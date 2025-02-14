import { AuthContext } from "@/context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MoonLoader, PulseLoader } from "react-spinners";
import { CKEditor } from "ckeditor4-react";
import { masterEmailReducer } from "@/reducers/masterEmailReducers";
import { Container } from "@/components";
import { addFormData, getData } from "@/actions";
import { API_URL_masteremail } from "@/constants";

const DiagnosticEmail = () => {
  const [isLoadingCkeditor, setLoadingCkeditor] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { datauser } = useContext(AuthContext);
  //eslint-disable-next-line
  const [refreshEditor, setRefreshEditor] = useState(false);
  const [menuAccess, setMenuAccess] = useState(false);

  const { getMasterEmailResult, addMasterEmailLoading } = useSelector(
    (state) => state.masteremail
  );

  const get = useCallback(
    async (param) => {
      await getData(
        { dispatch, redux: masterEmailReducer },
        param,
        API_URL_masteremail,
        "GET_MASTEREMAIL"
      );
      setLoading(false);
    },
    [dispatch]
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      to: "",
      title: "",
      body: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Email is required"),
      to: Yup.string().required("to is required"),
      title: Yup.string().required("title is required"),
      body: Yup.string().required("body is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("to", values.to);
      formData.append("title", values.title);
      formData.append("body", values.body);

      addFormData(
        { dispatch, redux: masterEmailReducer },
        formData,
        API_URL_masteremail + "diagnostic/",
        "ADD_MASTEREMAIL"
      );
    },
  });

  // Event handler ketika CKEditor siap
  const onEditorReady = () => {
    setLoadingCkeditor(false); // Sembunyikan loading indicator
  };

  const fetchData = useCallback(() => {
    const params = { param: `?limit=99999999` };
    get(params);
  }, [get]);

  useEffect(() => {
    fetchData();
    //eslint-disable-next-line
  }, []);

  const toolbarConfig = {
    extraPlugins: "font,colorbutton,colordialog",
    removePlugins: "about",
    skin: "moono",
  };

  return (
    <div>
      <Container>
        <div className="font-bold">Diagnostic Email</div>
        {isLoadingCkeditor && (
          <div className="bg-black bg-opacity-10 lg:pl-[15rem] fixed inset-0 z-[40] flex justify-center items-center ">
            <MoonLoader color="blue" size={100} />
          </div>
        )}
        <hr></hr>
        <form onSubmit={formik.handleSubmit}>
          <div className="h-auto w-auto px-4 mt-4 bg-neutral dark:bg-base-600 border-b border-neutral-200 dark:border-neutral-600 object-left">
            <div className="mt-4 grid grid-cols-4 gap-4">
              <div>
                <label className="font-semibold">
                  From <span className="text-red-500">*</span> :
                </label>
              </div>

              <div className="col-span-3">
                <select
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="block w-full md:w-1/2 lg:w-1/2 rounded-md border border-gray-500 bg-white py-2 px-2 text-gray-900 shadow-sm focus:ring-1 focus:ring-inset focus:ring-blue-400
                  dark:bg-base-500 dark:text-base-200 sm:text-sm sm:leading-6"
                >
                  <option value={""}>Select</option>
                  {getMasterEmailResult.results &&
                    getMasterEmailResult.results.map((item, index) => (
                      <option key={index} value={item.email}>
                        {item.email}
                      </option>
                    ))}
                </select>
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 dark:text-red-300 text-xs">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold">
                  To <span className="text-red-500">*</span> :
                </label>
              </div>

              <div className="col-span-3">
                <input
                  type="email"
                  name="to"
                  id="to"
                  placeholder="Tulis alamat email tujuan..."
                  value={formik.values.to}
                  onChange={formik.handleChange}
                  className="block w-full md:w-1/2 lg:w-1/2 rounded-md border border-gray-500 bg-white py-1.5 px-2 text-gray-900 shadow-sm placeholder:text-gray-600 focus:ring-1 focus:ring-inset focus:ring-blue-400
                  dark:bg-base-600 dark:text-gray-200 sm:text-sm sm:leading-6"
                />
                {formik.touched.to && formik.errors.to && (
                  <div className="text-red-500 dark:text-red-300 text-xs">
                    {formik.errors.to}
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold">
                  Subjek <span className="text-red-500">*</span> :
                </label>
              </div>

              <div className="col-span-3">
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Subjek email Anda..."
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  className="block w-full md:w-1/2 lg:w-1/2 rounded-md border border-gray-500 bg-white py-1.5 px-2 text-gray-900 shadow-sm placeholder:text-gray-600 focus:ring-1 focus:ring-blue-400
                  dark:bg-base-600 dark:text-gray-200
                  sm:text-sm sm:leading-6" 
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="text-red-500 dark:text-red-300 text-xs">
                    {formik.errors.title}
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold">
                  Pesan <span className="text-red-500">*</span> :
                </label>
              </div>

              <div className="col-span-3 mb-4">
                <CKEditor
                  key={refreshEditor}
                  config={toolbarConfig}
                  type="classic"
                  initData={formik.values.body}
                  onInstanceReady={onEditorReady}
                  onChange={(e) =>
                    formik.setFieldValue("body", e.editor.getData())
                  }
                />
                {formik.touched.body && formik.errors.body && (
                  <div className="text-red-500 dark:text-red-300 text-xs">
                    {formik.errors.body}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="h-12 w-full grid items-center px-4 ">
            <button
              type="submit"
              disabled={loading}
              className="flex w-16 items-center justify-center p-1 rounded shadow-sm  text-white bg-sky-800 hover:bg-sky-700"
            >
              {addMasterEmailLoading ? (
                <PulseLoader color="rgb(255 255 255)" size={14} />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default DiagnosticEmail;
