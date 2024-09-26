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

  const itemData = state?.item || {}; // Fallback to an empty object

  const [tabs] = useState({
    idTabs: "pegawaiTabs",
    idContents: "pegawaiTabs-Content",
    listTabs: [
      {
        nameTabs: "Pribadi",
        linkTabs: "formPribadi",
        contentTabs: <Pribadi data={itemData} />,
      },
      {
        nameTabs: "Pegawai",
        linkTabs: "formPegawai",
        contentTabs: <Pegawai data={itemData} />,
        disabled: !pk,
      },
      {
        nameTabs: "Keluarga",
        linkTabs: "formKeluarga",
        contentTabs: <Keluarga data={itemData} />,
        disabled: !pk,
      },
      {
        nameTabs: "Pendidikan",
        linkTabs: "formPendidikan",
        contentTabs: <Pendidikan data={itemData} />,
        disabled: !pk,
      },
      {
        nameTabs: "Lainnya",
        linkTabs: "formLainnya",
        contentTabs: <Lainnya data={itemData} />,
        disabled: !pk,
      },
      {
        nameTabs: "Jadwal",
        linkTabs: "formJadwal",
        contentTabs: <Jadwal data={itemData} />,
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
