import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { IoMdReturnLeft } from "react-icons/io";
import { Container } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { addFormData, decrypted_id, updateFormData } from "@/actions";
import { API_URL_task, API_URL_todotask } from "@/constants";
import { AuthContext } from "@/context/AuthContext";
import axiosAPI from "@/authentication/axiosApi";
import * as Yup from "yup";
import { taskReducer } from "@/reducers/taskReducers";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import ProjectCard from "@/components/atoms/ProjectCard";
import moment from "moment";
import { debounce } from "lodash";
import SubAktivitasPage from "./SubAktivitasPage";

const optionTab = [
  { label: "Ringkasan", value: "ringkasan" },
  { label: "Daftar Todo", value: "list-todo" },
  { label: "Daftar Sub Tugas", value: "list-subtugas" },
];

const DetailProyekPage = () => {
  const { pk } = useParams();
  const { getTaskLoading } = useSelector((state) => state.task);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [detailProyek, setDetailProyek] = useState("");
  const [rerenderPegawai, setRerenderPegawai] = useState(true);
  const [tabActive, setTabActive] = useState("ringkasan");

  const { jwt } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
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
      //   formData.append("employee", encrypted_id(values.employee?.value));
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("type", "eksternal");

      try {
        if (pk) {
          const dekrip_id = decrypted_id(pk);
          updateFormData(
            { dispatch, redux: taskReducer },
            formData,
            API_URL_task,
            "UPDATE_DELEGATION",
            dekrip_id
          );
        } else {
          addFormData(
            { dispatch, redux: taskReducer },
            formData,
            API_URL_task,
            "ADD_DELEGATION"
          );
        }
        navigate(-1);
      } catch (error) {
        console.log(error);
      }
    },
  });

  // Effect untuk memantau perubahan perusahaan untuk melakukan
  useEffect(() => {
    if (!pk) {
      setRerenderPegawai(false);
      if (formik.values.perusahaan) {
        // Reset employee ke null ketika perusahaan berubah
        formik.setFieldValue("employee", null);
        setTimeout(() => {
          setRerenderPegawai(true);
        }, 1);
      }
    }
  }, [formik.values.perusahaan]);

  // Jika ada Pk maka Fetching data lama
  const get = useCallback(async () => {
    if (location?.state?.pk) {
      const response = await axiosAPI.get(API_URL_task + location.state.pk);
      const dataResponse = response.data;
      setDetailProyek(dataResponse);
    } else {
      navigate(-1);
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      get();
    }
  }, [location]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button
          className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
          onClick={() => navigate(-1)}
        >
          <IoMdReturnLeft />
        </button>
        <h1 className="font-semibold">{detailProyek?.title}</h1>
      </div>
      <Container variant="shadow">
        {/* Tab Option  */}
        <div className="flex flex-row gap-2">
          {optionTab.map((item, index) => (
            <button
              onClick={() => setTabActive(item.value)}
              className={`${
                tabActive === item.value &&
                "border-b-2 border-blue-700 text-blue-700"
              }  hover:bg-gray-200 active:bg-gray-300`}
            >
              <div className="p-2">{item.label}</div>
            </button>
          ))}
        </div>

        {tabActive === "ringkasan" && (
          <div>
            <div className="mb-3 font-semibold">
              {capitalizeFirstLetter(detailProyek?.description)}
            </div>
            <div className="font-bold text-sm mb-2">Departemen Terkait :</div>
            <div className="flex flex-row gap-2 mb-2">
              {detailProyek?.departemen_details?.map((item, index) => {
                return (
                  <div key={index} className="bg-green-100 p-1.5 rounded">
                    {item?.departemen?.nama}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Container>
      {tabActive === "ringkasan" && (
        <div className="pt-4">
          <div className="flex flex-row gap-4">
            <ProjectCard
              completionPercentage={
                detailProyek?.todotask_total > 0
                  ? Math.round(
                      (detailProyek?.todotask_completed /
                        detailProyek?.todotask_total) *
                        100
                    )
                  : 0
              }
              startDate={moment(detailProyek?.created_at).format(
                "DD MMMM YYYY"
              )}
              due_date={moment(detailProyek?.due_date).format("DD MMMM YYYY")}
              todo_completed={detailProyek?.todotask_completed}
              total_todo={detailProyek?.todotask_total}
              left_day={detailProyek?.day_left}
            />

            <div className="bg-white w-full shadow rounded h-[50vh] overflow-y-auto">
              <div className="border-b">
                <div className="p-4">Riwayat Aktivitas</div>
              </div>
              {/* content  */}
              <div>
                <SubAktivitasPage />
                <></>
              </div>
            </div>
          </div>
        </div>
      )}
      {tabActive === "list-todo" && <div></div>}
    </div>
  );
};

export default DetailProyekPage;
