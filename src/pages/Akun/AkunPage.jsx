import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // For accessing location
import PerusahaanAktif from "./Sub/PerusahaanAktif";
import PerusahaanNonaktif from "./Sub/PerusahaanNonaktif";
import { Tabs } from "@/components";
import { jwtDecode } from "jwt-decode";
import { isAuthenticated } from "../../authentication/authenticationApi";
import { PulseLoading } from "../../components";

const tabComponents = [
  { key: "0", label: "Perusahaan Aktif", Component: PerusahaanAktif },
  { key: "1", label: "Perusahaan Nonaktif", Component: PerusahaanNonaktif },
];

const AkunPage = () => {
  const { state } = useLocation();
  const initialTab = `${state?.activeTab || "0"}`;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setUser(jwtDecode(token));
      setLoading(false);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab); // Update active tab on change
  };

  if (loading){
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <PulseLoading />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        hidden={user?.perusahaan}
        activeTab={activeTab}
        tabComponents={tabComponents}
        onTabChange={handleTabChange}
      />

      {tabComponents.map(
        ({ key, Component }) =>
          activeTab === key && (
            <Component key={key} onTabChange={handleTabChange} />
          )
      )}
    </div>
  );
};

export default AkunPage;
