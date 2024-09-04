import React, { useCallback, useEffect, useRef, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  API_URL_createkalender,
  API_URL_getkalender,
} from "@/constants";
import {
  Button,
  InputText,
  InputDate,
  InputSelect,
  Modal,
} from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { kalenderReducer } from "@/reducers/kalenderReducers";
import { addData } from "@/actions";
import axiosAPI from "@/authentication/axiosApi";
import moment from "moment";

const KalenderPage = () => {
  const { addKalenderResult, addKalenderLoading } = useSelector(
    (state) => state.kalender
  );
  const dispatch = useDispatch();
  const calendarRef = useRef(null);
  const [kalender, setKalender] = useState([]);
  const [modal, setModal] = useState(false);

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
    setModal(false); // Close the modal after submission
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (addKalenderResult) {
      fetchData();
    }
  }, [addKalenderResult]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-6 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg calendar-wrapper">
      <FullCalendar
        ref={calendarRef}
        customButtons={{
          buttonAdd: {
            text: "Tambah +",
            click: function () {
              setModal(true);
            },
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
      <Modal
        isOpen={modal}
        onClose={() => setModal(false)}
        title="Tambah Event"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 gap-4 p-2 rounded-lg dark:bg-gray-800">
              <InputText
                label="Nama Event"
                name="nama_event"
                placeholder="Input Event"
              />
              <InputDate
                label="Tanggal Mulai"
                name="tgl_mulai"
                placeholder="Tanggal Mulai"
              />
              <InputDate
                label="Tanggal Berakhir"
                name="tgl_berakhir"
                placeholder="Tanggal Berakhir"
              />
              <InputSelect
                label="Tipe Event"
                name="type_event"
                options={[
                  { value: true, label: "Libur" },
                  { value: false, label: "Event" },
                ]}
                placeholder="Pilih Tipe"
              />
              <div className="flex justify-end items-center">
                <Button
                  btnName={"Submit"}
                  onLoading={isSubmitting || addKalenderLoading}
                  type="submit"
                />
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default KalenderPage;