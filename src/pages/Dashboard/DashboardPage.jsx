import React, { Fragment, useState } from "react";
import { DonutChart, CompCardTable } from "../../components";
import { icons } from "../../../public/icons";

const DashboardPage = () => {
  return (
    <Fragment>
      <div className="grid md:grid-cols-6 gap-6">
        <div
          className="cursor-pointer lg:col-span-2 md:col-span-3"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          onClick={() => navigate("/")}
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
          onClick={() => navigate("/")}
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
          onClick={() => navigate("/")}
        >
          <DonutChart
            title={"Kehadiran Pegawai"}
            icon={icons.fauserclock}
          />
        </div>
        <div className="col-span-full lg:col-span-3">
          <CompCardTable
            filter
            title={"Presensi Pegawai"}
            icon={icons.fausercheck}
          />
        </div>
        <div className="col-span-full lg:col-span-3">
          <CompCardTable
            filter
            title={"Absensi Pegawai"}
            icon={icons.fausertimes}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default DashboardPage;
