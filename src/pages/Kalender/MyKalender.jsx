import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { API_URL_getkalender } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import axiosAPI from "@/authentication/axiosApi";
import moment from "moment";

const KalenderSubPage = ({ role }) => {
  const { pk } = useParams(); 
  const navigate = useNavigate();
  const { addKalenderResult } = useSelector((state) => state.kalender);
  const dispatch = useDispatch();
  const calendarRef = useRef(null);
  const [kalender, setKalender] = useState([]);

  const getEvent = async (month_year = false) => {
    const params = month_year ? { "month-year": month_year } : {};
    // Include pk in the request to fetch events for that specific calendar
    const response = pk
      ? await axiosAPI.get(`${API_URL_getkalender}${pk}/`, { params })
      : await axiosAPI.get(`${API_URL_getkalender}`, { params });
    setKalender(response.data);
  };

  const fetchData = useCallback(async () => {
    getEvent();
  }, [pk]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (addKalenderResult) {
      fetchData();
    }
  }, [addKalenderResult]);

  return (
    <div className="p-6 bg-white dark:bg-base-600 rounded-lg shadow-lg calendar-wrapper">
      {/* <p className="mb-6 text-lg font-[400]">Perusahaan</p> */}
      <FullCalendar
        ref={calendarRef}
        customButtons={{
          buttonAdd: {
            text: "Data Kalender",
            // click: () => navigate("/kalender/form"),
            click: () => navigate(`${pk ? `/kalender/list/${pk}` : "/kalender/list"}`),
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

export default KalenderSubPage;
