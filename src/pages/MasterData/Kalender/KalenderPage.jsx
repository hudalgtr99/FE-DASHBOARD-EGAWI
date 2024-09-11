import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import {
  API_URL_createkalender,
  API_URL_getkalender,
} from "@/constants";
import {
  Button,
} from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { kalenderReducer } from "@/reducers/kalenderReducers";
import { addData } from "@/actions";
import axiosAPI from "@/authentication/axiosApi";
import moment from "moment";

const KalenderPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { addKalenderResult, addKalenderLoading } = useSelector(
    (state) => state.kalender
  );
  const dispatch = useDispatch();
  const calendarRef = useRef(null);
  const [kalender, setKalender] = useState([]);

  const initialValues = {
    id: "",
    nama_event: "",
    tgl_mulai: "",
    tgl_berakhir: "",
    type_event: "",
  };

  const validationSchema = Yup.object({
    nama_event: Yup.string().required("Nama Event is required"),
    tgl_mulai: Yup.date().required("Tanggal Mulai is required"),
    tgl_berakhir: Yup.date().required("Tanggal Berakhir is required"),
    type_event: Yup.string().required("Type Event is required"),
  });

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    const payload = {
      title: values.nama_event,
      start_date: values.tgl_mulai,
      end_date: values.tgl_berakhir,
      is_national_holiday: Boolean(values.type_event),
    };

    if (!values.id) {
      addData(
        { dispatch, redux: kalenderReducer },
        payload,
        API_URL_createkalender,
        "ADD_KALENDER"
      );
    }

    resetForm();
    setSubmitting(false);
  };

  const getEvent = async (month_year = false) => {
    const params = month_year ? { "month-year": month_year } : {};
    const response = await axiosAPI.get(API_URL_getkalender, { params });
    setKalender(response.data);
  };

  const fetchData = useCallback(async () => {
    getEvent();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (addKalenderResult) {
      fetchData();
    }
  }, [addKalenderResult]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg calendar-wrapper">
      <FullCalendar
        ref={calendarRef}
        customButtons={{
          buttonAdd: {
            text: "Tambah +",
            click: () => navigate('/kalender/form'), // Use navigate for redirection
          },
          prev: {
            click: () => {
              const calendarApi = calendarRef.current.getApi();
              calendarApi.prev();
              const date = calendarApi.currentDataManager.data.currentDate;
              getEvent(moment(date).format("YYYY-MM"));
            },
          },
          next: {
            click: () => {
              const calendarApi = calendarRef.current.getApi();
              calendarApi.next();
              const date = calendarApi.currentDataManager.data.currentDate;
              getEvent(moment(date).format("YYYY-MM"));
            },
          },
          today: {
            text: "Today",
            click: () => {
              const calendarApi = calendarRef.current.getApi();
              calendarApi.today();
              const date = calendarApi.currentDataManager.data.currentDate;
              getEvent(moment(date).format("YYYY-MM"));
            },
          },
        }}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev next today",
          center: "title",
          right: "buttonAdd",
        }}
        eventColor="#FF2300"
        events={kalender}
      />
    </div>
  );
};

export default KalenderPage;
