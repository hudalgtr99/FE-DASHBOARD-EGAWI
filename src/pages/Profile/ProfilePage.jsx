import React, { Fragment, useEffect, useState } from "react";

// components
import { TabsOld } from "@/components";

// sub
import PengaturanAkunSub from "./Sub/PengaturanAkunSub";
import PengaturanProfilSub from "./Sub/PengaturanProfilSub";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabNames] = useState(["Pengaturan Akun", "Pengaturan Profil"]);
  const [tabContents] = useState([<PengaturanAkunSub />, <PengaturanProfilSub />]);

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

export default ProfilePage;
