import React, { Fragment, useState } from "react";

// components
import { Tabs } from "@/components";

// sub
import Pribadi from "./Sub/Pribadi";
import Pegawai from "./Sub/Pegawai";
import Keluarga from "./Sub/Keluarga";
import Pendidikan from "./Sub/Pendidikan";
import Lainnya from "./Sub/Lainnya";
import Jadwal from "./Sub/Jadwal";

const PegawaiForm = () => {
  const [tabs] = useState({
    idTabs: "pegawaiTabs",
    idContents: "pegawaiTabs-Content",
    listTabs: [
      {
        nameTabs: "Pribadi",
        linkTabs: "formPribadi",
        contentTabs: <Pribadi />,
      },
      {
        nameTabs: "Pegawai",
        linkTabs: "formPegawai",
        contentTabs: <Pegawai />,
      },
      {
        nameTabs: "Keluarga",
        linkTabs: "formKeluarga",
        contentTabs: <Keluarga />,
      },
      {
        nameTabs: "Pendidikan",
        linkTabs: "formPendidikan",
        contentTabs: <Pendidikan />,
      },
      {
        nameTabs: "Lainnya",
        linkTabs: "formLainnya",
        contentTabs: <Lainnya />,
      },
      {
        nameTabs: "Jadwal",
        linkTabs: "formJadwal",
        contentTabs: <Jadwal />,
      },
    ],
  });

  return (
    <Fragment>
      <Tabs tabs={tabs} />
    </Fragment>
  );
};

export default PegawaiForm;
