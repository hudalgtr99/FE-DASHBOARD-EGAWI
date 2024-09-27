import React, { Fragment, useState, useMemo } from "react";
import { Tabs } from "@/components"; // Ensure this component handles accessibility
import Pribadi from "./Sub/Pribadi";
import Pegawai from "./Sub/Pegawai";
import Keluarga from "./Sub/Keluarga";
import Pendidikan from "./Sub/Pendidikan";
import Lainnya from "./Sub/Lainnya";
import Jadwal from "./Sub/Jadwal";
import { useLocation, useParams } from "react-router-dom";

const PegawaiForm = () => {
  const { pk } = useParams();
  const { state } = useLocation();

  console.log(state)

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
        disabled: !pk,
      },
      {
        nameTabs: "Keluarga",
        linkTabs: "formKeluarga",
        contentTabs: <Keluarga />,
        disabled: !pk,
      },
      {
        nameTabs: "Pendidikan",
        linkTabs: "formPendidikan",
        contentTabs: <Pendidikan />,
        disabled: !pk,
      },
      {
        nameTabs: "Lainnya",
        linkTabs: "formLainnya",
        contentTabs: <Lainnya />,
        disabled: !pk,
      },
      {
        nameTabs: "Jadwal",
        linkTabs: "formJadwal",
        contentTabs: <Jadwal />,
        disabled: !pk,
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
