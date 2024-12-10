import React, { Fragment, useEffect, useState } from "react";

// components
import { TabsOld } from "@/components";

// sub
import DepartemenSub from "./Sub/DepartemenSub";
import DivisiSub from "./Sub/DivisiSub";
import UnitSub from "./Sub/UnitSub";

const OrganPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabNames] = useState(["Departemen", "Divisi", "Unit"]);
  const [tabContents] = useState([<DepartemenSub />, <DivisiSub />, <UnitSub />]);

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
      <TabsOld tab={tabNames} defaultindex={activeTab} onTabChange={handleTabChange}>
        {tabContents}
      </TabsOld>
    </Fragment>
  );
};

export default OrganPage;
