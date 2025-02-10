import { addFormData, updateFormData } from "@/actions";
import { Container } from "@/components";
import ProjectCard from "@/components/atoms/ProjectCard";
import { API_URL_task } from "@/constants";
import { taskReducer } from "@/reducers/taskReducers";
import { useFormik } from "formik";
import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import DaftarPekerjaanPage from "./DaftarPekerjaanPage";
import SubAktivitasPage from "./SubAktivitasPage";

const optionTab = [
  { label: "Ringkasan", value: "ringkasan" },
  { label: "Daftar Pekerjaan", value: "list-todo" },
  // { label: "Daftar Sub Tugas", value: "list-subtugas" },
];

const DetailProyekPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [tabActive, setTabActive] = useState("ringkasan");

  const formik = useFormik({
    initialValues: {
      id: state?.id,
      perusahaan: null,
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: (values, { setSubmitting }) => {
      // Validasi manual setiap field
      const errors = {};
      if (Object.keys(errors).length > 0) {
        console.log(errors);
        formik.setErrors(errors);
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("type", "eksternal");

      try {
        if (values.id) {
          updateFormData(
            { dispatch, redux: taskReducer },
            formData,
            API_URL_task,
            "ADD_TASK",
            values.id
          );
        } else {
          addFormData(
            { dispatch, redux: taskReducer },
            formData,
            API_URL_task,
            "ADD_TASK"
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
        <div className="capitalize font-semibold">{state?.title}</div>

        {/* Tab Option  */}
        <div className="flex flex-row">
          {optionTab.map((item, itemIdx) => (
            <button
              key={itemIdx}
              onClick={() => setTabActive(item.value)}
              className={`${
                tabActive === item.value &&
                "border-b-2 border-blue-700 dark:border-white text-blue-700 dark:text-white"
              }  hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-700 duration-100`}
            >
              <div className="p-2">{item.label}</div>
            </button>
          ))}
        </div>

        {tabActive === "ringkasan" && (
          <div>
            <div className="mb-3 text-sm capitalize">{state?.description}</div>
            <div className="font-semibold text-sm mb-2">
              Departemen Terkait :
            </div>
            <div className="flex flex-row gap-2">
              {state?.departemen_details?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="bg-green-100 text-gray-700 p-1.5 px-3 rounded text-sm"
                  >
                    {item?.departemen?.nama}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tabActive === "list-todo" && <DaftarPekerjaanPage />}
      </Container>

      {tabActive === "ringkasan" && (
        <div className="pt-4">
          <div className="flex flex-row gap-4">
            <ProjectCard
              completionPercentage={
                state?.todotask_total > 0
                  ? Math.round(
                      (state?.todotask_completed / state?.todotask_total) * 100
                    )
                  : 0
              }
              startDate={moment(state?.created_at).format("DD MMMM YYYY")}
              due_date={moment(state?.due_date).format("DD MMMM YYYY")}
              todo_completed={state?.todotask_completed}
              total_todo={state?.todotask_total}
              left_day={state?.day_left}
            />

            <SubAktivitasPage />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailProyekPage;
