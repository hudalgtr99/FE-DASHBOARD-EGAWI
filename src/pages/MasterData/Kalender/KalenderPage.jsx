import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { API_URL_getkalender } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import axiosAPI from "@/authentication/axiosApi";
import moment from "moment";

const KalenderPage = () => {
  const navigate = useNavigate();
  const { addKalenderResult } = useSelector(
    (state) => state.kalender
  );
  const dispatch = useDispatch();
  const calendarRef = useRef(null);
  const [kalender, setKalender] = useState([]);

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
