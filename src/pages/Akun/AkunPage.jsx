import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // For accessing location
import PerusahaanAktif from "./Sub/PerusahaanAktif";
import PerusahaanNonaktif from "./Sub/PerusahaanNonaktif";
import { Tabs } from "@/components"; // Assuming your Tabs component works similarly

const tabComponents = [
  { key: '0', label: 'Perusahaan Aktif', Component: PerusahaanAktif },
  { key: '1', label: 'Perusahaan Nonaktif', Component: PerusahaanNonaktif },
];

const AkunPage = () => {
  const { state } = useLocation(); // Get location state
  const initialTab = `${state?.activeTab || '0'}`; // Default to '0' if no state found

  const [activeTab, setActiveTab] = useState(initialTab); // Set initial active tab

  const handleTabChange = (tab) => {
    setActiveTab(tab); // Update active tab on change
  };

  return (
    <div className='flex flex-col gap-4'>
      <Tabs activeTab={activeTab} tabComponents={tabComponents} onTabChange={handleTabChange} />

      {tabComponents.map(({ key, Component }) => (
        activeTab === key && <Component key={key} onTabChange={handleTabChange} />
      ))}
    </div>
  );
};

export default AkunPage;
