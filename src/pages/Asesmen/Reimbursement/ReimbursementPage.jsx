import React, { Fragment, useEffect, useState } from "react";
import { TabsOld } from "@/components"; // Ensure this component handles accessibility
import ValidasiReimbursementSub from "./Sub/ValidasiReimbursementSub";

const ReimbursementPage = () => {
  const tabNames = [
    "Validasi Reimbursement",
    "Reimbursement Diterima",
    "Reimbursement Ditolak",
  ];
  const tabContents = [
    <ValidasiReimbursementSub type={"validasi_reimbursement"} />,
    <ValidasiReimbursementSub type={"reimbursement_diterima"} />,
    <ValidasiReimbursementSub type={"reimbursement_ditolak"} />,
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

export default ReimbursementPage;
