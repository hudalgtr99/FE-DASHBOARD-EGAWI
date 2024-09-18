import React, { Fragment, useState } from "react";

// components
import { Tabs } from "@/components";

// sub
import AppraisalSub from "./Sub/AppraisalSub";
import HistorikalSub from "./Sub/HistorikalSub";
import KapabilitasSub from "./Sub/KapabilitasSub";
import ObjektifSub from "./Sub/ObjektifSub";
import TugasSub from "./Sub/TugasSub";
import UmpanBalikSub from "./Sub/UmpanBalikSub";

const KinerjaPage = () => {
  const [tabs] = useState({
    idTabs: "kinerjaTabs",
    idContents: "kinerjaTabs-Content",
    listTabs: [
      {
        nameTabs: "Appraisal",
        linkTabs: "kinerjaAppraisal",
        contentTabs: <AppraisalSub />,
      },
      {
        nameTabs: "Objektif",
        linkTabs: "kinerjaObjektif",
        contentTabs: <ObjektifSub />,
      },
      {
        nameTabs: "Kapabilitas",
        linkTabs: "kinerjaKapabilitas",
        contentTabs: <KapabilitasSub />,
      },
      {
        nameTabs: "Tugas",
        linkTabs: "kinerjaTugas",
        contentTabs: <TugasSub />,
      },
      {
        nameTabs: "Umpan Balik",
        linkTabs: "kinerjaUmpanBalik",
        contentTabs: <UmpanBalikSub />,
      },
      {
        nameTabs: "Historikal",
        linkTabs: "kinerjaHistorikal",
        contentTabs: <HistorikalSub />,
      },
    ],
  });

  return (
    <Fragment>
      <Tabs tabs={tabs} />
    </Fragment>
  );
};

export default KinerjaPage;
