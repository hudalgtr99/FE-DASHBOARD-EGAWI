import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { API_URL_getkalender } from "@/constants";
import { useSelector } from "react-redux";
import axiosAPI from "@/authentication/axiosApi";
import moment from "moment";
import { Container } from "../../components";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/AuthContext";
import { Select } from "@/components";
import { isAuthenticated } from "@/authentication/authenticationApi";

const KalenderSubPage = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const { addKalenderResult } = useSelector((state) => state.kalender);
  const calendarRef = useRef(null);
  const [kalender, setKalender] = useState([]);

  const [jwt, setJwt] = useState({}); // Initialize jwt variable
  const { perusahaan, loadingPerusahaan } = useAuth();
  const [perusahaanOptions, setPerusahaanOptions] = useState([]);

  const [selectedPerusahaan, setSelectedPerusahaan] = useState(null);

  // Fetch perusahaan options and set selectedPerusahaan
  useEffect(() => {
    if (!loadingPerusahaan) {
      const options = perusahaan.map((opt) => ({
        value: opt.slug,
        label: opt.nama,
      }));
      setPerusahaanOptions(options);
      // Set selectedPerusahaan if pk exists, otherwise default to first perusahaan
      setSelectedPerusahaan(options.find((opt) => opt?.value === pk) || options[0]);
    }
  }, [loadingPerusahaan, pk]);

  const handleSelect = (selectedOption) => {
    setSelectedPerusahaan(selectedOption);
  };

  // Decode JWT token if authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, []);

  // Fetch events based on selectedPerusahaan or pk
  const getEvent = async (month_year = false) => {
    const params = month_year ? { "month-year": month_year } : {};
    const perusahaanSlug = selectedPerusahaan ? selectedPerusahaan.value : pk;

    // Request based on selectedPerusahaan or pk
    const response = await axiosAPI.get(`${API_URL_getkalender}${perusahaanSlug ? `${perusahaanSlug}/` : ""}`, { params });
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

  return (
    <div className="flex flex-col gap-6">
      <Container>
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center">
          <div className="w-full sm:w-60 z-50">
            <Select
              options={perusahaanOptions}
              placeholder="Filter perusahaan"
              onChange={handleSelect}
              value={selectedPerusahaan}
            />
          </div>
        </div>
      </Container>
      <div className="p-6 bg-white dark:bg-base-600 rounded-lg shadow-lg calendar-wrapper">
        <FullCalendar
          ref={calendarRef}
          customButtons={{
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
            left: "today",
            center: "title",
            right: "prev next",
          }}
          eventColor="#FF2300"
          events={kalender}
        />
      </div>
    </div>
  );
};

export default KalenderSubPage;
