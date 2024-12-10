import React, { Fragment, useEffect, useState } from "react";
import { TabsOld } from "@/components"; // Ensure this component handles accessibility
import PelaksanaanSub from "./Sub/PelaksanaanSub";
import PengajuanSub from "./Sub/PengajuanSub";
import PersetujuanSub from "./Sub/PersetujuanSub";
import HasilSub from "./Sub/HasilSub";
import { useLocation } from "react-router-dom";

const RekrutmenPage = () => {
  const { state } = useLocation(); // Get state from location
  const [activeTab, setActiveTab] = useState(0);

  const [tabNames] = useState([
    "Pengajuan",
    "Persetujuan",
    "Pelaksanaan",
    "Hasil",
  ]);

  const [tabContents] = useState([
    <PengajuanSub />,
    <PersetujuanSub />,
    <PelaksanaanSub />,
    <HasilSub />,
  ]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && tabNames.includes(hash)) {
      setActiveTab(tabNames.indexOf(hash));
    }
  }, [tabNames]);

  const handleTabChange = (index) => {
    window.location.hash = tabNames[index];
    setActiveTab(index);
  };

  return (
    <Fragment>
      <TabsOld
        tab={tabNames}
        defaultindex={activeTab}
        onTabChange={handleTabChange}
      >
        {tabContents.map((content, index) => (
          <div key={index} style={{ display: index === activeTab ? "block" : "none" }}>
            {content}
          </div>
        ))}
      </TabsOld>
    </Fragment>
  );
};

export default RekrutmenPage;