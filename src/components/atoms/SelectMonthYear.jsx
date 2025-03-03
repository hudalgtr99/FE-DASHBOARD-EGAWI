import moment from "moment";
import React, { useState, useRef, useEffect } from "react";
import {
  IoChevronDown,
  IoChevronBack,
  IoChevronForward,
  IoCalendarClearOutline,
} from "react-icons/io5";

const SelectMonthYear = ({ onChange }) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const currentYear = moment().format("YYYY");
  const currentMonthIndex = parseInt(moment().format("M"), 10) - 1;

  const [year, setYear] = useState(parseInt(currentYear, 10));
  const [month, setMonth] = useState(months[currentMonthIndex]);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [year, month, onChange]);

  const handleYearChange = (e) => {
    const inputYear = e.target.value.trim();
    if (inputYear === "") {
      setYear("");
      return;
    }
    const selectedYear = parseInt(inputYear, 10);
    if (!isNaN(selectedYear)) {
      setYear(selectedYear);
      onChange(
        `${selectedYear}-${(months.indexOf(month) + 1)
          .toString()
          .padStart(2, "0")}`
      );
    }
  };

  const incrementMonth = () => {
    setMonth((prevMonth) => {
      const currentMonthIndex = months.indexOf(prevMonth);
      if (currentMonthIndex === 11) {
        setYear((prevYear) => prevYear + 1);
        return months[0];
      } else {
        return months[currentMonthIndex + 1];
      }
    });
  };

  const decrementMonth = () => {
    setMonth((prevMonth) => {
      const currentMonthIndex = months.indexOf(prevMonth);
      if (currentMonthIndex === 0) {
        setYear((prevYear) => prevYear - 1);
        return months[11];
      } else {
        return months[currentMonthIndex - 1];
      }
    });
  };

  const handleMonthSelect = (selectedMonth) => {
    setMonth(selectedMonth);
    setIsOpen(false);
    onChange(
      `${year}-${(months.indexOf(selectedMonth) + 1)
        .toString()
        .padStart(2, "0")}`
    );
  };

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <div
        className="w-full flex justify-between text-[14px] items-center px-4 py-2 border rounded-lg shadow-sm bg-white text-gray-700 cursor-pointer  dark:bg-base-600 dark:border-base-400 dark:text-base-200 "
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoCalendarClearOutline className="w-5 h-5 mr-2" />
        {month} {year}
        <IoChevronDown className="w-5 h-5" />
      </div>

      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg z-10 dark:bg-base-600 dark:border-base-500">
          <div className="flex justify-between items-center px-4 py-2 border-b dark:border-base-500">
            <button
              onClick={decrementMonth}
              className="p-2 rounded-md hover:bg-gray-200  dark:hover:bg-base-500"
            >
              <IoChevronBack className="w-5 h-5" />
            </button>
            <input
              type="number"
              value={year === "" ? "" : year}
              onChange={handleYearChange}
              className="w-16 text-center border rounded-md p-[5px] dark:bg-base-600 dark:border-base-500 dark:text-base-200 "
            />
            <button
              onClick={incrementMonth}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-base-500"
            >
              <IoChevronForward className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1 p-2 max-h-60 overflow-y-auto">
            {months.map((monthName) => (
              <button
                key={monthName}
                onClick={() => handleMonthSelect(monthName)}
                className={`text-center p-[5px] text-[14px] rounded-lg ${
                  month === monthName
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-base-500 dark:text-base-200"
                }`}
              >
                {monthName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectMonthYear;
