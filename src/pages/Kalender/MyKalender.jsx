import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
  const { addKalenderResult } = useSelector((state) => state.kalender);
  const calendarRef = useRef(null);
  const [kalender, setKalender] = useState([]);

  const [jwt, setJwt] = useState({}); // Initialize jwt variable
  const { perusahaan, loadingPerusahaan } = useAuth();
  const [perusahaanOptions, setperusahaanOptions] = useState([]);

  const [selectedPerusahaan, setSelectedPerusahaan] = useState(null);

  useEffect(() => {
    if (!loadingPerusahaan) {
      const options = perusahaan.map((opt) => ({
        value: opt.slug,
        label: opt.nama,
      }));
      setperusahaanOptions(options);
      setSelectedPerusahaan(options.find((opt) => opt?.value === pk) || "");
    }
  }, [loadingPerusahaan]);

  const handleSelect = (selectedOption) => {
    setSelectedPerusahaan(selectedOption);

  };

  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, []);

  const getEvent = async (month_year = false) => {
    const params = month_year ? { "month-year": month_year } : {};
    // Include pk in the request to fetch events for that specific calendar
    const response = selectedPerusahaan
      ? await axiosAPI.get(`${API_URL_getkalender}${selectedPerusahaan}/`, { params })
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
    <div className="flex flex-col gap-6">
      <Container>
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center">
          <div className="w-full sm:w-60 z-50">
            {/* <TextField
              placeholder="Search"
              icon={<CiSearch />}
              value={searchTerm} // Bind value dengan state
              onChange={(e) => setSearchTerm(e.target.value)} // Update state saat input berubah
            /> */}
            <Select
              options={perusahaanOptions}
              placeholder="Filter perusahaan"
              onChange={handleSelect} // Memanggil handleSelect saat ada perubahan
              value={selectedPerusahaan} // Menampilkan perusahaan yang dipilih
            />
          </div>
        </div>
      </Container>
      <div className="p-6 bg-white dark:bg-base-600 rounded-lg shadow-lg calendar-wrapper">
        {/* <p className="mb-6 text-lg font-[400]">Perusahaan</p> */}
        <FullCalendar
          ref={calendarRef}
          customButtons={{
            // buttonAdd: {
            //   text: "Data Kalender",
            //   // click: () => navigate("/kalender/form"),
            //   click: () => navigate(`${pk ? `/kalender/list/${pk}` : "/kalender/list"}`),
            // },

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
