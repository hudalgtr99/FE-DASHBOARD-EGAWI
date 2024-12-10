import React from "react";
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
import { FileInput } from "../../../../components";

const Lainnya = ({ onTabChange }) => {
  const { addPegawaiLoading } = useSelector((state) => state.kepegawaian);
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localStorageData =
    JSON.parse(localStorage.getItem("editUserData")) || {};

  // Cek apakah ini mode edit atau tidak
  const isEditMode = localStorageData && localStorageData.datalainnya;

  const pendidikanData = isEditMode ? localStorageData.datalainnya : {};
  const datalainnya = Array.isArray(pendidikanData.data)
    ? pendidikanData.data
    : JSON.parse(pendidikanData.data || "[]");

  const formik = useFormik({
    initialValues: {
      user_id: localStorageData.datapribadi.user_id || "",
      // Jika dalam mode edit, ambil datalainnya, jika tidak, inisialisasi dengan satu input kosong
      lainnya: isEditMode ? datalainnya : [{ data: null, link: "" }],
    },

    validationSchema: Yup.object().shape({}),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        const payload = {
          pk: "datalainnya",
          user_id: values.user_id,
          lainnya: JSON.stringify(
            values.lainnya.map((item) => ({
              data: item.data ? "file" : item.link,
              link: item.link || "",
            }))
          ),
        };

        for (const key in payload) {
          formData.append(key, payload[key]);
        }

        values.lainnya.forEach((item, index) => {
          if (item.data) {
            formData.append(`lainnya[${index}].data`, item.data);
          }
        });

        const data = await updateData(
          { dispatch, redux: pegawaiReducer },
          formData,
          API_URL_edeluser,
          "ADD_PEGAWAI",
          "PUT",
          "datalainnya"
        );

        if(data && !addPegawaiLoading){
          navigate("/kepegawaian/pegawai");
        }
      } catch (error) {
        console.error("Error in form submission: ", error);
      }
    },
  });

  const handleAddFile = () => {
    const newLainnya = [...formik.values.lainnya, { data: null, link: "" }];
    formik.setFieldValue("lainnya", newLainnya);
  };

  const handleRemoveFile = (index) => {
    const updatedLainnya = formik.values.lainnya.filter((_, i) => i !== index);
    formik.setFieldValue("lainnya", updatedLainnya);
  };

  const handleFileChange = (index) => (files) => {
    const updatedLainnya = formik.values.lainnya.map((item, i) =>
      i === index ? { ...item, data: files[0] || null } : item
    );
    formik.setFieldValue("lainnya", updatedLainnya);
  };

  const handleMundur = () => {
    onTabChange("3");
  };

  console.log(pendidikanData);

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
          <h1>Data Lainnya</h1>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            formik.handleSubmit();
            // setTimeout(() => {
            //   localStorage.removeItem("editUserData");
            // }, 1000);
          }}
          className="space-y-6"
        >
          <div className="flex justify-between">
            <h3 className="font-medium">Data lainnya</h3>
            <div className="flex gap-2 items-center cursor-pointer">
              {formik.values.lainnya.length > 0 && (
                <div>
                  {formik.values.lainnya.length > 1 && (
                    <button
                      type="button"
                      className="bg-gray-200 p-1 rounded-lg"
                      onClick={() =>
                        handleRemoveFile(formik.values.lainnya.length - 1)
                      }
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              )}
              <div>
                <button
                  type="button"
                  className="bg-gray-200 p-1 rounded-lg"
                  onClick={handleAddFile}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
          {formik.values.lainnya.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <label
                htmlFor={`file-${index}`}
                className="block whitespace-nowrap mt-2"
              >{`Gambar Ke-${index + 1}`}</label>
              <FileInput
                height={70}
                accept={{ "image/jpeg": [], "image/png": [] }}
                maxFiles={1}
                minSize={0}
                maxSize={2097152} // 2 MB
                multiple={false}
                value={item.data ? [item.data] : []}
                setValue={handleFileChange(index)}
                error={formik.errors.lainnya?.[index]?.data}
              />
              {formik.touched.lainnya?.[index]?.data &&
                formik.errors.lainnya?.[index]?.data && (
                  <span className="text-red-500">
                    {formik.errors.lainnya[index].data}
                  </span>
                )}
            </div>
          ))}
          <div className="mt-6 flex justify-end">
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default Lainnya;
