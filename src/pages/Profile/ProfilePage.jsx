import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to access location state

// components
import { Tabs } from "@/components"; // Assuming this is the correct Tabs component

// sub-components
import PengaturanAkunSub from "./Sub/PengaturanAkunSub";
import PengaturanProfilSub from "./Sub/PengaturanProfilSub";

// Define tab components in an array with key, label, and component
const tabComponents = [
  { key: '0', label: 'Pengaturan Akun', Component: PengaturanAkunSub },
  { key: '1', label: 'Pengaturan Profil', Component: PengaturanProfilSub }
];

const ProfilePage = () => {
  const { state } = useLocation(); // Access location state
  const initialTab = `${state?.activeTab || '0'}`; // Default to '0' if no state is found

  const [activeTab, setActiveTab] = useState(initialTab); // Initialize active tab

  const handleTabChange = (tab) => {
    setActiveTab(tab); // Update active tab when a tab is selected
  };

  return (
    <div className='flex flex-col gap-4'>
      <Tabs activeTab={activeTab} tabComponents={tabComponents} onTabChange={handleTabChange} />
      
      {/* Render the tab content based on the active tab */}
      {tabComponents.map(({ key, Component }) => (
        activeTab === key && <Component key={key} />
      ))}
    </div>
  );
};

export default ProfilePage;
