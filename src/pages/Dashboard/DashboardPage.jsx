import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// plugins
import moment from "moment";

// components
import { DonutChart, CardTable } from "@/components";
import { icons } from "../../../public/icons";

// functions
import { getData } from "@/actions";
import { userReducer } from "@/reducers/authReducers";
import {
  API_URL_getdataabsensi,
  API_URL_getdatadashboard,
  API_URL_getdatapresensi,
} from "@/constants";
import axiosAPI from "@/authentication/axiosApi";

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    getDataPresensiResult,
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [limitPresensi, setLimitPresensi] = useState(10);
  const [dataAbsensi, setDataAbsensi] = useState([]);
  const [offset, setOffset] = useState(0);

  // Data
  const [totalPegawai, setTotalPegawai] = useState([0, 0]);
  const [statusPegawai, setStatusPegawai] = useState([0, 0, 0]);
  const [kehadiranPegawai, setKehadiranPegawai] = useState([0, 0, 0]);

  const [filterValue, setFilterValue] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const get = (param) => {
    getData(
      { dispatch, redux: userReducer },
      param,
      API_URL_getdatapresensi,
      "GET_PRESENSI"
    );
  };

  const handleFilterDate = (e) => {
    const param = {
      param:
        "?date=" +
        moment(new Date(e)).format("YYYY-MM-DD") +
        "&limit=" +
        limitPresensi,
    };
    setFilterValue(e);
    get(param);

    axiosAPI
      .get(
        API_URL_getdataabsensi +
        "?date=" +
        moment(new Date(e)).format("YYYY-MM-DD")
      )
      .then((res) => {
        setDataAbsensi(res.data);
      });
  };

  const handlePageClick = (e) => {
    const offset = e.selected * limitPresensi;
    setOffset(offset);
    const param = {
      param:
        "?date=" +
        moment(new Date(filterValue)).format("YYYY-MM-DD") +
        "&limit=" +
        limitPresensi +
        "&offset=" +
        offset,
    };
    get(param);
  };

  const handleSelectPresensi = (e) => {
    const param = {
      param:
        "?date=" +
        moment(new Date(filterValue)).format("YYYY-MM-DD") +
        "&limit=" +
        e,
    };
    get(param);
    setLimitPresensi(e);
  };

  useEffect(() => {
    get({
      param:
        "?date=" +
        moment(new Date(filterValue)).format("YYYY-MM-DD") +
        "&limit=" +
        limitPresensi,
    });

    axiosAPI
      .get(
        API_URL_getdataabsensi +
        "?date=" +
        moment(new Date(filterValue)).format("YYYY-MM-DD")
      )
      .then((res) => {
        setDataAbsensi(res.data);
      });

    axiosAPI
      .get(
        API_URL_getdatadashboard +
        "?date=" +
        moment(new Date(filterValue)).format("YYYY-MM-DD")
      )
      .then((res) => {
        setTotalPegawai([
          res.data.totalPegawai["Laki-laki"],
          res.data.totalPegawai["Perempuan"],
        ]);
        setKehadiranPegawai([
          res.data.kehadiranPegawai["Hadir"],
          res.data.kehadiranPegawai["Alfa"],
          res.data.kehadiranPegawai["Cuti"],
        ]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <div className="grid md:grid-cols-6 gap-6">
        <div
          className="cursor-pointer lg:col-span-2 md:col-span-3"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          onClick={() => navigate("/kepegawaian/pegawai")}
        >
          <DonutChart
            cardColor="to-white dark:to-gray-700"
            title={"Jumlah Pegawai"}
            icon={icons.fausers}
            dataSeries={[20, 10]}
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
          <DonutChart
            cardColor="to-white dark:to-gray-700"
            title={"Status Pegawai"}
            icon={icons.fauseredit}
            dataSeries={[20, 10, 10]}
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
          <DonutChart
            cardColor="to-white dark:to-gray-700"
            title={"Kehadiran Pegawai"}
            icon={icons.fauserclock}
            dataSeries={[20, 10, 10]}
            dataLabels={["Hadir", "Alfa", "Cuti"]}
            dataColor={["#36AE7C", "#EB5353", "#FF8AAE"]}
          />
        </div>
        <div className="col-span-full lg:col-span-3">
          <CardTable
            filter
            cardColor="to-white dark:to-gray-700"
            title={"Presensi Pegawai"}
            icon={icons.fausercheck}
            dataColumns={[
              { name: "No", value: "no" },
              { name: "Nama Pegawai", value: "nama" },
              { name: "Masuk", value: "masuk" },
              { name: "Keluar", value: "keluar" },
            ]}
            dataTables={
              getDataPresensiResult.count > 0
                ? getDataPresensiResult.results
                : null
            }
            setFilterValue={handleFilterDate}
            filterValue={filterValue}
            handlePageClick={handlePageClick}
            pageCount={
              getDataPresensiResult.count > 0 ? getDataPresensiResult.count : 0
            }
            limit={limitPresensi}
            setLimit={handleSelectPresensi}
            offset={offset}
          />
        </div>
        <div className="col-span-full lg:col-span-3">
          <CardTable
            filter
            cardColor="to-white dark:to-gray-700"
            title={"Absensi Pegawai"}
            icon={icons.fausertimes}
            dataColumns={[
              { name: "ID", value: "id" },
              { name: "Nama Pegawai", value: "nama" },
              { name: "Status", value: "status" },
              { name: "Keterangan", value: "keterangan" },
            ]}
            dataTables={dataAbsensi}
            setFilterValue={handleFilterDate}
            filterValue={filterValue}
            pageCount={dataAbsensi.length > 0 ? dataAbsensi.length : 0}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default DashboardPage;
