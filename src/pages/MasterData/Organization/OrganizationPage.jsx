import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Use useLocation for accessing the location
import DepartemenSub from "./Sub/DepartemenSub";
import DivisiSub from "./Sub/DivisiSub";
import UnitSub from "./Sub/UnitSub";
import { Tabs } from '@/components';

const tabComponents = [
  { key: '0', label: 'Departemen', Component: DepartemenSub },
  { key: '1', label: 'Divisi', Component: DivisiSub },
  { key: '2', label: 'Unit', Component: UnitSub },
];

const OrganPage = () => {
  const { state } = useLocation(); // Access location state
  const initialTab = `${state?.activeTab || '0'}`; // Default to '0' if no state is found

  const [activeTab, setActiveTab] = useState(initialTab); // Initialize active tab

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className='flex flex-col gap-4'>
      <Tabs
        activeTab={activeTab} 
        tabComponents={tabComponents} 
        onTabChange={handleTabChange} 
      />

      {tabComponents.map(({ key, Component }) => (
        activeTab === key && <Component key={key} onTabChange={handleTabChange} />
      ))}
    </div>
  );
};

export default OrganPage;
