import React, { Fragment, useState } from "react";

// components
import { CompTabs } from "../../../components";

// sub
import DepartemenSub from "./Sub/DepartemenSub";
import DivisiSub from "./Sub/DivisiSub";
import UnitSub from "./Sub/UnitSub";

const OrganPage = () => {
  const [tabs] = useState({
    idTabs: "organTabs",
    idContents: "organTabs-Content",
    listTabs: [
      {
        nameTabs: "Departemen",
        linkTabs: "organPangkat",
        contentTabs: <DepartemenSub />,
      },
      {
        nameTabs: "Divisi",
        linkTabs: "organDivisi",
        contentTabs: <DivisiSub />,
      },
      {
        nameTabs: "Unit",
        linkTabs: "organUnit",
        contentTabs: <UnitSub />,
      },
    ],
  });

  return (
    <Fragment>
      <CompTabs tabs={tabs} />
    </Fragment>
  );
};

export default OrganPage;
