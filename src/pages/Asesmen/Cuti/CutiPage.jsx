import React, { Fragment, useEffect, useState } from "react";
import { TabsOld } from "@/components"; // Ensure this component handles accessibility
import ValidasiIzinSub from "./Sub/ValidasiIzinSub";

const CutiPage = () => {
  const tabNames = ["Validasi Cuti", "Cuti Diterima", "Cuti Ditolak"];
  const tabContents = [
    <ValidasiIzinSub type={"validasi_cuti"} />,
    <ValidasiIzinSub type={"cuti_diterima"} />,
    <ValidasiIzinSub type={"cuti_ditolak"} />,
  ];

  const [activeTab, setActiveTab] = useState(0);

  // Effect to update active tab based on URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && tabNames.includes(hash)) {
      setActiveTab(tabNames.indexOf(hash));
    }
  }, [tabNames]);

  // Handle tab change
  const handleTabChange = (index) => {
    window.location.hash = tabNames[index]; // Update the hash in the URL
    setActiveTab(index); // Set the active tab
  };

  return (
    <Fragment>
      <TabsOld
        tab={tabNames}
        defaultindex={activeTab}
        onTabChange={handleTabChange}
      >
        {tabContents.map((content, index) => (
          <div
            key={index}
            style={{ display: index === activeTab ? "block" : "none" }}
          >
            {content}
          </div>
        ))}
      </TabsOld>
    </Fragment>
  );
};

export default CutiPage;
