import React, { useState } from "react";
import Pribadi from "./Sub/Pribadi";
import Pegawai from "./Sub/Pegawai";
import Keluarga from "./Sub/Keluarga";
import Pendidikan from "./Sub/Pendidikan";
import Lainnya from "./Sub/Lainnya";
import { Tabs } from "../../../components";

const tabComponents = [
  { key: "0", label: "Pribadi", Component: Pribadi },
  { key: "1", label: "Pegawai", Component: Pegawai },
  { key: "2", label: "Keluarga", Component: Keluarga },
  { key: "3", label: "Pendidikan", Component: Pendidikan },
  { key: "4", label: "Lainnya", Component: Lainnya },
];

const PegawaiForm = () => {
  const [activeTab, setActiveTab] = useState("0"); // Initialize active tab

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        activeTab={activeTab}
        tabComponents={tabComponents}
        onTabChange={handleTabChange}
      />

      {tabComponents.map(
        ({ key, Component }) =>
          activeTab === key && (
            <Component
              key={key}
              onLanjut={() => handleTabChange("1")}
              onTabChange={handleTabChange}
            />
          )
      )}
    </div>
  );
};

export default PegawaiForm;
