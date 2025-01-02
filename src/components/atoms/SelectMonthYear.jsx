import moment from "moment";
import React, { useState } from "react";
import { IoRefresh } from "react-icons/io5";

const SelectMonthYear = ({ onChange }) => {
  const [year, setYear] = useState(moment().format("YYYY"));
  const [month, setMonth] = useState("");

  const handleYearChange = (e) => {
    const selectedYear = parseInt(e.target.value, 10);
    setYear(selectedYear);
    if (month) {
      onChange(`${selectedYear}-${month.toString().padStart(2, "0")}`);
    }
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setMonth(selectedMonth);
    if (year) {
      onChange(`${year}-${selectedMonth.toString().padStart(2, "0")}`);
    }
  };

  const handleReset = () => {
    setMonth("");
    setYear(moment().format("YYYY"));
    if (year) {
      onChange(`YYYY-MM`);
    }
  };

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - 50 + i
  );
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

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      {/* Month Selector */}
      <select
        value={month}
        onChange={handleMonthChange}
        style={{ padding: "5px", fontSize: "14px" }}
      >
        <option value="" disabled>
          Pilih Bulan
        </option>
        {months.map((m, index) => (
          <option
            key={index + 1}
            value={(index + 1).toString().padStart(2, "0")}
          >
            {m}
          </option>
        ))}
      </select>

      {/* Year Selector */}
      <select
        value={year}
        onChange={handleYearChange}
        style={{ padding: "5px", fontSize: "14px" }}
      >
        <option value="" disabled>
          Pilih Tahun
        </option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <button onClick={() => handleReset()}>
        <IoRefresh />
      </button>
    </div>
  );
};

export default SelectMonthYear;
