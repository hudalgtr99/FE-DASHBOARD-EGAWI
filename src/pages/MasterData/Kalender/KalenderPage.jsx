import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const KalenderPage = () => {
  const calendarRef = useRef(null);
  const [Kalender, setKalender] = useState([]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg calendar-wrapper">
      <FullCalendar
        ref={calendarRef}
        customButtons={{
          buttonAdd: {
            text: "Tambah +",
          },
          prev: {
            click: (e) => {
              const calendarApi = calendarRef.current.getApi();
              calendarApi.prev();
              const date = calendarApi.currentDataManager.data.currentDate;
            },
          },
          next: {
            click: (e) => {
              const calendarApi = calendarRef.current.getApi();
              calendarApi.next();
              const date = calendarApi.currentDataManager.data.currentDate;
            },
          },
          today: {
            text: "Today",
            click: (e) => {
              const calendarApi = calendarRef.current.getApi();
              calendarApi.today();
              const date = calendarApi.currentDataManager.data.currentDate;
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
        events={Kalender}
      />
    </div>
  );
};

export default KalenderPage;
