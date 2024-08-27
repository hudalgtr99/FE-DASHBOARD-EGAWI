import React from "react";

// components
import { CardOrgChart } from "@/components";
import OrganizationChart from "@dabeng/react-orgchart";
import { pengurus } from "@/constants/dataPengurus";

const PengurusPage = () => {
  return (
    <div className="">
      <OrganizationChart
        datasource={pengurus}
        collapsible={false}
        chartClass="bg-none"
        containerClass="hidden-scroll h-[79vh] bg-white"
        NodeTemplate={CardOrgChart}
        pan={true}
        zoom={true}
      />
    </div>
  );
};

export default PengurusPage;
