import React, { useEffect, useState } from "react";

const CurrencyInput = ({ label, name, value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || "");

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Hanya ambil angka
    const formattedValue = rawValue
      ? parseInt(rawValue, 10).toLocaleString("id-ID")
      : "";
    setInputValue(formattedValue);
    onChange(rawValue); // Kirim nilai mentah ke parent
  };

  useEffect(() => {
    const rawValue = value?.replace(/[^0-9]/g, ""); // Hanya ambil angka
    const formattedValue = rawValue
      ? parseInt(rawValue, 10).toLocaleString("id-ID")
      : "";
    setInputValue(formattedValue);
    onChange(rawValue);
  }, [value]);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative mt-1">
        <span className="absolute left-0 top-0 text-gray-500 bg-gray-200 h-full px-1 py-1 flex items-center rounded">
          Rp.
        </span>
        <input
          type="text"
          name={name}
          value={inputValue}
          onChange={handleChange}
          className="pl-8 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-0"
          placeholder="0"
        />
      </div>
    </div>
  );
};

export default CurrencyInput;
