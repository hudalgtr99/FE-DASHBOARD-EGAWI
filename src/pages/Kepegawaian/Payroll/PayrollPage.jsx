import React, { Fragment, useState } from "react";

// components
import { Tabs } from "@/components";

// sub
import KomponenSub from "./Sub/KomponenSub";
import LaporanSub from "./Sub/LaporanSub";
import PengajuanGajiSub from "./Sub/PengajuanGajiSub";

const PayrollPage = () => {
  const [tabs] = useState({
    idTabs: "payrollTabs",
    idContents: "payrollTabs-Content",
    listTabs: [
      {
        nameTabs: "Komponen",
        linkTabs: "payrollKomponen",
        contentTabs: <KomponenSub />,
      },
      {
        nameTabs: "Pengajuan Gaji ",
        linkTabs: "payrollPengajuanGaji",
        contentTabs: <PengajuanGajiSub />,
      },
      {
        nameTabs: "Laporan",
        linkTabs: "payrollLaporan",
        contentTabs: <LaporanSub />,
      },
    ],
  });

  return (
    <Fragment>
      <Tabs tabs={tabs} />
    </Fragment>
  );
};

export default PayrollPage;
