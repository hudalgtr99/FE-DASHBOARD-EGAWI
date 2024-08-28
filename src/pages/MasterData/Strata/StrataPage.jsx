import React, { Fragment, useState } from "react";

// components
import { Tabs } from "@/components";

// sub
import PangkatSub from "./Sub/PangkatSub";
import JabatanSub from "./Sub/JabatanSub";

const StrataPage = () => {
  const [tabs] = useState({
    idTabs: "strataTabs",
    idContents: "strataTabs-Content",
    listTabs: [
      {
        nameTabs: "Pangkat",
        linkTabs: "strataPangkat",
        contentTabs: <PangkatSub />,
      },
      {
        nameTabs: "Jabatan",
        linkTabs: "strataJabatan",
        contentTabs: <JabatanSub />,
      },
    ],
  });

  return (
    <Fragment>
      <Tabs tabs={tabs} />
    </Fragment>
  );
};

export default StrataPage;
