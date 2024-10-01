import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { DonutChart, Tables, Container, Limit, Pagination } from "@/components";
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
    const date = moment(new Date(e)).format("YYYY-MM-DD");
    const param = {
      param: `?date=${date}&limit=${limitPresensi}`,
    };
    setFilterValue(e);
    setOffset(0); // Reset offset when filter changes
    get(param);

    axiosAPI
      .get(`${API_URL_getdataabsensi}?date=${date}`)
      .then((res) => setDataAbsensi(res.data));
  };

  // Pagination handler
  const handlePageClick = (e) => {
    const newOffset = e.selected * limitPresensi;
    setOffset(newOffset);
    const date = moment(new Date(filterValue)).format("YYYY-MM-DD");
    const param = {
      param: `?date=${date}&limit=${limitPresensi}&offset=${newOffset}`,
    };
    get(param);
  };

  const handleSelectPresensi = (e) => {
    const date = moment(new Date(filterValue)).format("YYYY-MM-DD");
    const param = {
      param: `?date=${date}&limit=${e}`,
    };
    setLimitPresensi(e);
    setOffset(0); // Reset offset when limit changes
    get(param);
  };

  useEffect(() => {
    const date = moment(new Date(filterValue)).format("YYYY-MM-DD");
    get({
      param: `?date=${date}&limit=${limitPresensi}`,
    });

    axiosAPI.get(`${API_URL_getdataabsensi}?date=${date}`).then((res) => {
      setDataAbsensi(res.data);
    });

    axiosAPI.get(`${API_URL_getdatadashboard}?date=${date}`).then((res) => {
      setTotalPegawai([
        res.data.totalPegawai["Laki Laki"],
        // res.data.totalPegawai["Perempuan"],
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
          onClick={() => navigate("/kepegawaian/pegawai")}
        >
          <DonutChart
            cardColor="to-white dark:to-gray-700"
            title={"Jumlah Pegawai"}
            icon={icons.fausers}
            dataSeries={totalPegawai}
            dataLabels={["Laki Laki", "Perempuan"]}
            dataColor={["#187498", "#EB72A0"]}
          />
        </div>

        <div
          className="cursor-pointer lg:col-span-2 md:col-span-3"
          onClick={() => navigate("/kepegawaian/pegawai")}
        >
          <DonutChart
            cardColor="to-white dark:to-gray-700"
            title={"Status Pegawai"}
            icon={icons.fauseredit}
            dataSeries={[10, 10, 10]}
            dataLabels={["Permanen", "Kontrak", "Percobaan"]}
            dataColor={["#36AE7C", "#F9D923", "#EB5353"]}
          />
        </div>

        <div
          className="cursor-pointer lg:col-span-2 md:col-span-full"
          onClick={() => navigate("/asesmen/kehadiran")}
        >
          <DonutChart
            cardColor="to-white dark:to-gray-700"
            title={"Kehadiran Pegawai"}
            icon={icons.fauserclock}
            dataSeries={kehadiranPegawai}
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
                className="bg-white dark:bg-gray-600 text-sm outline-none font-light"
                type="date"
                value={filterValue}
                onChange={(e) => handleFilterDate(e.target.value)}
              />
            </div>
            <Tables>
              <Tables.Head>
                <Tables.Row>
                  <Tables.Header>No</Tables.Header>
                  <Tables.Header>Nama Pegawai</Tables.Header>
                  <Tables.Header>Masuk</Tables.Header>
                  <Tables.Header>Keluar</Tables.Header>
                </Tables.Row>
              </Tables.Head>
              <Tables.Body>
                {getDataPresensiResult && getDataPresensiResult.count > 0
                  ? getDataPresensiResult.results.map((item, index) => (
                    <Tables.Row key={index}>
                      <Tables.Data>{index + 1}</Tables.Data>
                      <Tables.Data>{item.nama}</Tables.Data>
                      <Tables.Data>{item.masuk}</Tables.Data>
                      <Tables.Data>{item.keluar}</Tables.Data>
                    </Tables.Row>
                  ))
                  : (
                    <tr>
                      <td colSpan="4" className="text-center">No Data Available</td>
                    </tr>
                  )}
              </Tables.Body>
            </Tables>
            <div className="flex justify-between items-center mt-4">
              <Limit
                limit={limitPresensi}
                setLimit={setLimitPresensi}
                onChange={handleSelectPresensi}
              />
              {getDataPresensiResult && getDataPresensiResult.count > 0 && (
                <Pagination
                  totalCount={getDataPresensiResult.count}
                  pageSize={limitPresensi}
                  currentPage={Math.floor(offset / limitPresensi) + 1}
                  onPageChange={handlePageClick}
                  siblingCount={1}
                  activeColor="primary"
                  rounded="md"
                  variant="flat"
                  size="md"
                />
              )}
            </div>
          </Container>
        </div>

        {/* Absensi Pegawai Table */}
        <div className="col-span-full lg:col-span-3">
          <Container>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                {icons.fausertimes} Absensi Pegawai
              </div>
              <input
                className="bg-white dark:bg-gray-600 text-sm outline-none font-light"
                type="date"
                value={filterValue}
                onChange={(e) => handleFilterDate(e.target.value)}
              />
            </div>
            <Tables>
              <Tables.Head>
                <Tables.Row>
                  <Tables.Header>No</Tables.Header>
                  <Tables.Header>Nama Pegawai</Tables.Header>
                  <Tables.Header>Status</Tables.Header>
                  <Tables.Header>Keterangan</Tables.Header>
                </Tables.Row>
              </Tables.Head>
              <Tables.Body>
                {dataAbsensi && dataAbsensi.length > 0
                  ? dataAbsensi.map((item, index) => (
                    <Tables.Row key={index}>
                      <Tables.Data>{index + 1}</Tables.Data>
                      <Tables.Data>{item.nama}</Tables.Data>
                      <Tables.Data>{item.status}</Tables.Data>
                      <Tables.Data>{item.keterangan}</Tables.Data>
                    </Tables.Row>
                  ))
                  : (
                    <tr>
                      <td colSpan="4" className="text-center">No Data Available</td>
                    </tr>
                  )}
              </Tables.Body>
            </Tables>
            <div className="flex justify-between items-center mt-4">
              <Limit
                limit={limitPresensi}
                setLimit={setLimitPresensi}
                onChange={handleSelectPresensi}
              />
              {dataAbsensi && dataAbsensi.count > 0 && (
                <Pagination
                  totalCount={dataAbsensi.count}
                  pageSize={limitPresensi}
                  currentPage={Math.floor(offset / limitPresensi) + 1}
                  onPageChange={handlePageClick}
                  siblingCount={1}
                  activeColor="primary"
                  rounded="md"
                  variant="flat"
                  size="md"
                />
              )}
            </div>
          </Container>
        </div>
      </div>
    </Fragment>
  );
};

export default DashboardPage;
