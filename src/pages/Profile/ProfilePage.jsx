import React, { Fragment, useState } from "react";

// components
import { Tabs } from "@/components";

// sub
import PengaturanAkunSub from "./Sub/PengaturanAkunSub";
import PengaturanProfilSub from "./Sub/PengaturanProfilSub";

const ProfilePage = () => {
  const [tabs] = useState({
    idTabs: "profileTabs",
    idContents: "profileTabs-Content",
    listTabs: [
      {
        nameTabs: "Pengaturan Akun",
        linkTabs: "profilePengaturanAkun",
        contentTabs: <PengaturanAkunSub />,
      },
      {
        nameTabs: "Pengaturan Profil",
        linkTabs: "profilePengaturanProfil",
        contentTabs: <PengaturanProfilSub />,
      },
    ],
  });

  return (
    <Fragment>
      <Tabs tabs={tabs} />
    </Fragment>
  );
};

export default ProfilePage;
