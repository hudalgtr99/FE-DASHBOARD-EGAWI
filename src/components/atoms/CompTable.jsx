import React, { Fragment } from "react";

// components
import { PulseLoader } from "react-spinners";
import { CompProgressBar } from "@/components";

import moment from "moment";

const CompTable = ({
  dataColumns,
  dataTables,
  actions,
  isLoading,
  isError,
  offset,
  status,
  handleSwitch,
}) => {
  return (
    <Fragment>
      <div className="py-2 w-auto">
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-300">
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default CompTable;
