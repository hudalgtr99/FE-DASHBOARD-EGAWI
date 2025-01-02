import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { API_URL_getkalender } from "@/constants";
import { useSelector } from "react-redux";
import axiosAPI from "@/authentication/axiosApi";
import moment from "moment";
import { useAuth } from "@/context/AuthContext";

const KalenderSubPage = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const { addKalenderResult } = useSelector((state) => state.kalender);
  const calendarRef = useRef(null);
  const [kalender, setKalender] = useState([]);

  const { selectedPerusahaan, loadingPerusahaan } = useAuth();

  // Fetch events based on selectedPerusahaan or pk
  const getEvent = async (month_year = false) => {
    const params = month_year ? { "month-year": month_year } : {};
    const perusahaanSlug = selectedPerusahaan ? selectedPerusahaan.value : null;

    // Request based on selectedPerusahaan or pk
    const response = await axiosAPI.get(
      `${API_URL_getkalender}${perusahaanSlug ? `${perusahaanSlug}/` : ""}`,
      { params }
    );
    setKalender(response.data);
  };

  const fetchData = useCallback(async () => {
    getEvent();
  }, [pk, selectedPerusahaan]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (addKalenderResult) {
      fetchData();
    }
  }, [addKalenderResult]);

  const onDetail = () => {
    navigate("/kalender/list");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 bg-white dark:bg-base-600 rounded-lg shadow-lg calendar-wrapper">
        <FullCalendar
          ref={calendarRef}
          customButtons={{
            data_kalender: {
              text: "Data Kalender",
              click: () => {
                onDetail();
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
            right: "data_kalender",
          }}
          eventColor="#FF2300"
          events={kalender}
        />
      </div>
    </div>
  );
};

export default KalenderSubPage;
