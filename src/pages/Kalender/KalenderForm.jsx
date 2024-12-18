import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdReturnLeft } from "react-icons/io";
import { Button, Container, TextField, Select } from "@/components";
import { useDispatch } from "react-redux";
import { addData, updateData } from "@/actions";
import { kalenderReducer } from "@/reducers/kalenderReducers";
import {
  API_URL_createkalender,
  API_URL_getperusahaan,
  API_URL_edelkalender,
} from "@/constants";
import axiosAPI from "@/authentication/axiosApi";

const KalenderForm = () => {
  const { pk } = useParams();
  const isEdit = pk && pk !== "add";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [perusahaanOptions, setPerusahaanOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.error("Error fetching perusahaan data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      nama_event: state?.item?.title || "", // Mengambil "title" sebagai nama_event
      tgl_mulai: state?.item?.start || "", // Mengambil "start" sebagai tgl_mulai
      tgl_berakhir: state?.item?.end || "", // Mengambil "end" sebagai tgl_berakhir
      type_event: state?.item?.type || "", // Mengambil "type" sebagai type_event
      perusahaan: Number(state?.item?.perusahaan_id) || "", // Mengambil "perusahaan_id"
    },
    validationSchema: Yup.object().shape({
      nama_event: Yup.string().required("Nama Event is required"),
      tgl_mulai: Yup.date().required("Tanggal Mulai is required"),
      tgl_berakhir: Yup.date().required("Tanggal Berakhir is required"),
      type_event: Yup.string().required("Type Event is required"),
      perusahaan: Yup.mixed().required("Perusahaan is required"), // Validation for perusahaan
    }),
    onSubmit: async (values) => {
      const payload = {
        title: values.nama_event,
        start_date: values.tgl_mulai,
        end_date: values.tgl_berakhir,
        is_national_holiday:
          values.type_event?.toLowerCase() === "libur" ||
          values.type_event?.toLowerCase() === "national holiday",
        perusahaan: values.perusahaan, // Include perusahaan in the payload
      };

      !pk
        ? await addData(
            { dispatch, redux: kalenderReducer },
            payload,
            API_URL_createkalender,
            "ADD_KALENDER"
          )
        : await updateData(
            { dispatch, redux: kalenderReducer },
            { pk: pk, data: payload },
            API_URL_edelkalender,
            "ADD_KALENDER"
          );
      navigate(
        sessionStorage.getItem("url")
          ? sessionStorage.getItem("url")
          : "/kalender"
      );
    },
  });

  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => {
              navigate(
                sessionStorage.getItem("url")
                  ? sessionStorage.getItem("url")
                  : "/kalender"
              );
            }}
          >
            <IoMdReturnLeft />
          </button>
          <h1>Tambah Event</h1>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Select
              required
              label="Perusahaan"
              name="perusahaan"
              value={
                perusahaanOptions.find(
                  (option) => option.value === formik.values.perusahaan
                ) || null
              }
              onChange={(option) => {
                formik.setFieldValue("perusahaan", option ? option.value : "");
              }}
              options={perusahaanOptions}
              error={formik.touched.perusahaan ? formik.errors.perusahaan : ""}
              disabled={perusahaanOptions.length === 1}
              hidden={true}
            />
            <TextField
              required
              label="Nama Event"
              name="nama_event"
              value={formik.values.nama_event}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nama_event ? formik.errors.nama_event : ""}
            />
            <div className="flex gap-4">
              <TextField
                required
                type="date"
                label="Tanggal Mulai"
                name="tgl_mulai"
                value={formik.values.tgl_mulai}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.tgl_mulai ? formik.errors.tgl_mulai : ""}
              />
              <TextField
                required
                type="date"
                label="Tanggal Berakhir"
                name="tgl_berakhir"
                value={formik.values.tgl_berakhir}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.tgl_berakhir ? formik.errors.tgl_berakhir : ""
                }
              />
            </div>
            <Select
              required
              label="Type Event"
              name="type_event"
              value={
                formik.values.type_event
                  ? {
                      value: formik.values.type_event,
                      label:
                        formik.values.type_event === "National Holiday"
                          ? "Libur"
                          : formik.values.type_event,
                    }
                  : null
              }
              onChange={(option) =>
                formik.setFieldValue("type_event", option ? option.value : "")
              }
              options={[
                { value: "Libur", label: "Libur" },
                { value: "Event", label: "Event" },
              ]}
              error={formik.touched.type_event ? formik.errors.type_event : ""}
            />
            <div className="mt-6 flex justify-end">
              <Button type="submit">{isEdit ? "Update" : "Tambah"}</Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default KalenderForm;
