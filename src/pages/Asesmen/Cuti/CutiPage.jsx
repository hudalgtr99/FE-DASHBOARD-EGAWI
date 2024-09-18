import React, { Fragment, useState } from "react";

// components
import { Tabs } from "@/components";

// sub
import TerimaSub from "./Sub/TerimaSub";
import TolakSub from "./Sub/TolakSub";
import ValidasiIzinSub from "./Sub/ValidasiIzinSub";

const CutiPage = () => {
  const [tabs] = useState({
    idTabs: "cutiTabs",
    idContents: "cutiTabs-Content",
    listTabs: [
      {
        nameTabs: "Validasi Cuti",
        linkTabs: "cutiValidasiIzin",
        contentTabs: <ValidasiIzinSub />,
      },
      {
        nameTabs: "Cuti Diterima",
        linkTabs: "cutiTerima",
        contentTabs: <TerimaSub />,
      },
      {
        nameTabs: "Cuti Ditolak",
        linkTabs: "cutiTolak",
        contentTabs: <TolakSub />,
      },
    ],
  });

  return (
    <Fragment>
      <Tabs tabs={tabs} />
    </Fragment>
  );
};

export default CutiPage;
