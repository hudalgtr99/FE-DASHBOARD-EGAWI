import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { DonutChart, Tables, Container, Limit, Pagination } from "@/components"; // Assuming Pagination component is available
import { icons } from "../../../public/icons";
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
  const { getDataPresensiResult } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [limitPresensi, setLimitPresensi] = useState(10);
  const [dataAbsensi, setDataAbsensi] = useState([]);
  const [offset, setOffset] = useState(0);
  const [totalPegawai, setTotalPegawai] = useState([0, 0]);
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

  // Pagination handler
  const handlePageClick = (e) => {
    const newOffset = e.selected * limitPresensi;
    setOffset(newOffset);
    const param = {
      param:
        "?date=" +
        moment(new Date(filterValue)).format("YYYY-MM-DD") +
        "&limit=" +
        limitPresensi +
        "&offset=" +
        newOffset,
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
    setOffset(0); // Reset offset when changing limit
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
  }, [filterValue, limitPresensi]);

  return (
    <Fragment>
      <div className="grid md:grid-cols-6 gap-6">
        {/* DonutChart components */}
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
            dataLabels={["Permanen", "Kontrak", "Percobaan"]}
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

        {/* Presensi Pegawai Table */}
        <div className="col-span-full lg:col-span-3">
          <Container>
            <div className="flex justify-between">
              <div className="items-center gap-2 flex">
                {icons.fausercheck} Presensi Pegawai
              </div>
              <input
                className="bg-white text-sm outline-none font-light"
                type="date"
                value={filterValue}
                onChange={(e) => handleFilterDate(e.target.value)}
              />
            </div>
            <Tables size="md" density="normal" tablefix={false} height="auto">
              <Tables.Head>
                <Tables.Row>
                  <Tables.Header>No</Tables.Header>
                  <Tables.Header>Nama Pegawai</Tables.Header>
                  <Tables.Header>Masuk</Tables.Header>
                  <Tables.Header>Keluar</Tables.Header>
                </Tables.Row>
              </Tables.Head>
              <Tables.Body>
                {getDataPresensiResult && getDataPresensiResult.count > 0 &&
                  getDataPresensiResult.results.map((item, index) => (
                    <Tables.Row key={index}>
                      <Tables.Data>{index + 1}</Tables.Data>
                      <Tables.Data>{item.nama}</Tables.Data>
                      <Tables.Data>{item.masuk}</Tables.Data>
                      <Tables.Data>{item.keluar}</Tables.Data>
                    </Tables.Row>
                  ))
                }
              </Tables.Body>
            </Tables>
            {/* <div className="mt-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
              <div className="flex gap-2 items-baseline text-sm">
                <Limit
                  limit={limitPresensi}
                  setLimit={handleSelectPresensi}
                  onChange={() => setOffset(0)}
                />
                {getDataPresensiResult && getDataPresensiResult.count} entries
              </div>
              <Pagination
                totalPages={Math.ceil(getDataPresensiResult.count / limitPresensi)}
                onPageChange={handlePageClick}
              />
            </div> */}
          </Container>
        </div>

        {/* Absensi Pegawai Table */}
        <div className="col-span-full lg:col-span-3">
          <Container>
            <div className="flex items-center gap-2">
              {icons.fausertimes} Absensi Pegawai
            </div>
            <Tables>
              <Tables.Head>
                <Tables.Row>
                  <Tables.Header>ID</Tables.Header>
                  <Tables.Header>Nama Pegawai</Tables.Header>
                  <Tables.Header>Status</Tables.Header>
                  <Tables.Header>Keterangan</Tables.Header>
                </Tables.Row>
              </Tables.Head>
              {/* <Tables.Body>
                {dataAbsensi.length > 0 &&
                  dataAbsensi.map((item, index) => (
                    <Tables.Row key={index}>
                      <Tables.Data>{item.id}</Tables.Data>
                      <Tables.Data>{item.nama}</Tables.Data>
                      <Tables.Data>{item.status}</Tables.Data>
                      <Tables.Data>{item.keterangan}</Tables.Data>
                    </Tables.Row>
                  ))
                }
              </Tables.Body> */}
            </Tables>
          </Container>
        </div>
      </div>
    </Fragment>
  );
};

export default DashboardPage;
