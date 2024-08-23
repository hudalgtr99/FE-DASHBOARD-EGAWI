import React, { Fragment, useState } from "react";
import { CompCardDonutChart, CompCardTable } from "../../components";
import { icons } from "../../../public/icons";

const DashboardPage = () => {
  return (
    <Fragment>
      <div className="grid md:grid-cols-6 gap-6">
        <div
          className="cursor-pointer lg:col-span-2 md:col-span-3"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          onClick={() => navigate("/kepegawaian/pegawai")}
        >
          <CompCardDonutChart
            cardColor="to-gray-100"
            title={"Jumlah Pegawai"}
            icon={icons.fausers}
            // dataSeries={totalPegawai}
            dataSeries={["20"]}
            dataLabels={["Laki-laki", "Perempuan"]}
            dataColor={["#187498", "#EB72A0"]}
          />
        </div>
        <div
          className="cursor-pointer lg:col-span-2 md:col-span-3"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          onClick={() => navigate("/kepegawaian/pegawai")}
        >
          <CompCardDonutChart
            cardColor="to-gray-100"
            title={"Status Pegawai"}
            icon={icons.fauseredit}
            // dataSeries={statusPegawai}
            dataSeries={["10"]}
            dataLabels={["Permanen", "Kontrak", "Masa Percobaan"]}
            dataColor={["#36AE7C", "#F9D923", "#EB5353"]}
          />
        </div>
        <div
          className="cursor-pointer lg:col-span-2 md:col-span-full"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          onClick={() => navigate("/asesmen/kehadiran")}
        >
          <CompCardDonutChart
            cardColor="to-gray-100"
            title={"Kehadiran Pegawai"}
            icon={icons.fauserclock}
            // dataSeries={kehadiranPegawai}
            dataSeries={["12"]}
            dataLabels={["Hadir", "Alfa", "Cuti"]}
            dataColor={["#36AE7C", "#EB5353", "#FF8AAE"]}
          />
        </div>
        <div className="col-span-full lg:col-span-3">
          <CompCardTable
            filter
            cardColor="to-gray-100"
            title={"Presensi Pegawai"}
            icon={icons.fausercheck}
            dataColumns={[
              { name: "No", value: "no" },
              { name: "Nama Pegawai", value: "nama" },
              { name: "Masuk", value: "masuk" },
              { name: "Keluar", value: "keluar" },
            ]}
          />
        </div>
        <div className="col-span-full lg:col-span-3">
          <CompCardTable
            filter
            cardColor="to-gray-100"
            title={"Absensi Pegawai"}
            icon={icons.fausertimes}
            dataColumns={[
              { name: "ID", value: "id" },
              { name: "Nama Pegawai", value: "nama" },
              { name: "Status", value: "status" },
              { name: "Keterangan", value: "keterangan" },
            ]}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default DashboardPage;
