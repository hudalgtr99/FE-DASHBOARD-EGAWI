import React, { Fragment } from "react";
import { DonutChart } from "../../components";
import { icons } from "../../../public/icons";

const DashboardPage = () => {
  return (
    <Fragment>
      <div className="grid md:grid-cols-6 gap-6">
        <div
          className="cursor-pointer lg:col-span-2 md:col-span-3"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
        >
          <DonutChart
            title={"Jumlah Pegawai"}
            icon={icons.fausers}
          />
        </div>
        <div
          className="cursor-pointer lg:col-span-2 md:col-span-3"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
        >
          <DonutChart
            title={"Status Pegawai"}
            icon={icons.fauseredit}
          />
        </div>
        <div
          className="cursor-pointer lg:col-span-2 md:col-span-full"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
        >
          <DonutChart
            title={"Kehadiran Pegawai"}
            icon={icons.fauserclock}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default DashboardPage;
