import React, { Fragment, useState } from "react";

// components
import { CompTabs } from "../../../components";

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
      <CompTabs tabs={tabs} />
    </Fragment>
  );
};

export default StrataPage;
