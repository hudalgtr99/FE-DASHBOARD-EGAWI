import React, { Fragment, useState } from "react";

// components
import { Tabs } from "@/components";

// sub
import PelaksanaanSub from "./Sub/PelaksanaanSub";
import PengajuanSub from "./Sub/PengajuanSub";
import PersetujuanSub from "./Sub/PersetujuanSub";
import HasilSub from "./Sub/HasilSub";

const RekrutmenPage = () => {
  const [tabs] = useState({
    idTabs: "rekrutmenTabs",
    idContents: "rekrutmenTabs-Content",
    listTabs: [
      {
        nameTabs: "Pengajuan",
        linkTabs: "rekrutmenPengajuan",
        contentTabs: <PengajuanSub />,
      },
      {
        nameTabs: "Persetujuan",
        linkTabs: "rekrutmenPersetujuan",
        contentTabs: <PersetujuanSub />,
      },
      {
        nameTabs: "Pelaksanaan",
        linkTabs: "rekrutmenPelaksanaan",
        contentTabs: <PelaksanaanSub />,
      },
      {
        nameTabs: "Hasil",
        linkTabs: "rekrutmenHasil",
        contentTabs: <HasilSub />,
      },
    ],
  });

  return (
    <Fragment>
      <Tabs tabs={tabs} />
    </Fragment>
  );
};

export default RekrutmenPage;
