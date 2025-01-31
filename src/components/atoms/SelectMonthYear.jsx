import moment from "moment";
import React, { useState } from "react";
import { IoChevronDown, IoChevronBack, IoChevronForward, IoCalendarClearOutline } from "react-icons/io5";

const SelectMonthYear = ({ onChange }) => {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const currentYear = moment().format("YYYY");
  const currentMonthIndex = parseInt(moment().format("M"), 10) - 1; 

  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(months[currentMonthIndex]);
  const [isOpen, setIsOpen] = useState(false); 

  const handleYearChange = (e) => {
    const selectedYear = parseInt(e.target.value, 10);
    setYear(selectedYear);
    onChange(`${selectedYear}-${(months.indexOf(month) + 1).toString().padStart(2, "0")}`);
  };


  const handleMonthSelect = (selectedMonth) => {
    setMonth(selectedMonth);
    setIsOpen(false); 
    onChange(`${year}-${(months.indexOf(selectedMonth) + 1).toString().padStart(2, "0")}`);
  };

  return (
    <div className="relative w-64">
      <div
        className="w-full flex justify-between items-center px-4 py-2 border rounded-lg shadow-sm bg-white text-gray-700 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoCalendarClearOutline className="w-5 h-5 mr-2" />
        {month} {year}
        <IoChevronDown className="w-5 h-5" />
      </div>

      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-lg z-10">
          <div className="flex justify-between items-center px-4 py-2 border-b">
          <button onClick={() => setYear(year - 1)} className="p-2 rounded-md hover:bg-gray-200">
            <IoChevronBack className="w-5 h-5" />
          </button>
          <input
            type="number"
            value={year}
            onChange={handleYearChange}
            className="w-16 text-center text-[14px] border rounded-md p-[5px]"
          />
          <button onClick={() => setYear(year + 1)} className="p-2 rounded-md hover:bg-gray-200">
            <IoChevronForward className="w-5 h-5" />
          </button>

          </div>
          <div className="grid grid-cols-3 gap-1 p-2 max-h-60 overflow-y-auto">
            {months.map((monthName) => (
              <button
                key={monthName}
                onClick={() => handleMonthSelect(monthName)}
                className={`text-center text-[14px] p-[5px] rounded-lg ${month === monthName ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}  
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