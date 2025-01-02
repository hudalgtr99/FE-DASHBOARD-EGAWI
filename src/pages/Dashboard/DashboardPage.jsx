import { CardDonuts } from "../../template";
import { LuBuilding, LuUserCheck, LuUsers, LuUserX } from "react-icons/lu";
import { Container, Tables } from "@/components";
import { useState, useEffect } from "react";
import moment from "moment";
import axiosAPI from "@/authentication/axiosApi";
import {
  API_URL_getdataabsensi,
  API_URL_getdatadashboard,
  API_URL_getdatapresensi,
} from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { userReducer } from "@/reducers/authReducers";
import { getData } from "../../actions";
import { Pagination, PulseLoading } from "../../components";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../context/AuthContext";

const DashboardPage = () => {
  const {
    getDataPresensiResult,
    getDataPresensiLoading,
    getDataAbsensiResult,
    getDataAbsensiLoading,
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // State variables
  const [limitPresensi, setLimitPresensi] = useState(10);
  const [limitAbsensi, setLimitAbsensi] = useState(10); // Limit for absensi
  const [pageAbsensiActive, setPageAbsensiActive] = useState(0);
  const [pagePresensiActive, setPagePresensiActive] = useState(0);
  const [offset, setOffset] = useState(0);
  const [error, setError] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Data
  const [totalPegawai, setTotalPegawai] = useState([]);
  const [totalPerusahaan, setTotalPerusahaan] = useState([]);
  const [statusPegawai, setStatusPegawai] = useState([]);
  const [kehadiranPegawai, setKehadiranPegawai] = useState([]);
  const { selectedPerusahaan, loadingPerusahaan } = useAuth();

  console.log(statusPegawai);

  const [filterValue, setFilterValue] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const [jwt, setJwt] = useState({}); // Initialize jwt variable

  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, []);

  const getPresensi = (param) => {
    getData(
      { dispatch, redux: userReducer },
      param,
      API_URL_getdatapresensi,
      "GET_PRESENSI"
    );
  };
  const getAbsensi = (param) => {
    getData(
      { dispatch, redux: userReducer },
      param,
      API_URL_getdataabsensi,
      "GET_ABSENSI"
    );
  };

  const handleFilterDate = (e) => {
    const date = moment(new Date(e)).format("YYYY-MM-DD");
    setFilterValue(e);
    setOffset(0); // Reset offset when filter changes
    fetchData(date); // Fetch data for both presensi and absensi
  };

  const fetchData = (date, selectedPerusahaan) => {
    // Fetch presensi data
    try {
      const param = {
        param: `?date=${date}&limit=${limitPresensi}&offset=${offset}&perusahaan=${
          selectedPerusahaan?.value || ""
        }`,
      };
      getPresensi(param);
      getAbsensi(param);
    } catch {}
  };

  const handleSelectPresensi = (newLimit) => {
    const date = moment(new Date(filterValue)).format("YYYY-MM-DD");
    setLimitPresensi(newLimit); // Hanya ubah limit presensi
    setOffset(0); // Reset offset untuk presensi

    const param = {
      param: `?date=${date}&limit=${newLimit}&offset=0`,
    };
    get(param);
  };

  const handleSelectAbsensi = (newLimit) => {
    const date = moment(new Date(filterValue)).format("YYYY-MM-DD");
    setLimitAbsensi(newLimit); // Hanya ubah limit absensi
  };
  const handlePageAbsensiClick = (page) => {
    const date = moment(new Date(filterValue)).format("YYYY-MM-DD");
    const offset = (page - 1) * limitAbsensi; // Calculate the offset based on the page
    const param = {
      param: `?date=${date}&perusahaan=${
        selectedPerusahaan?.value || ""
      }&limit=${limitAbsensi}&offset=${offset}`,
    };

    getAbsensi(param);
    setPageAbsensiActive(page - 1); // Set the active page
  };

  const handlePagePresensiClick = (page) => {
    const date = moment(new Date(filterValue)).format("YYYY-MM-DD");
    const offset = (page - 1) * limitPresensi; // Calculate the offset based on the page
    const param = {
      param: `?date=${date}&perusahaan=${
        selectedPerusahaan?.value || ""
      }&limit=${limitPresensi}&offset=${offset}`,
    };

    getPresensi(param);
    setPagePresensiActive(page - 1); // Set the active page
  };

  useEffect(() => {
    const date = moment(new Date(filterValue)).format("YYYY-MM-DD");
    fetchData(date, selectedPerusahaan); // Fetch data for both presensi and absensi

    axiosAPI
      .get(
        `${API_URL_getdatadashboard}?date=${date}&perusahaan=${
          selectedPerusahaan?.value || ""
        }`
      )
      .then((res) => {
        setKehadiranPegawai([
          res.data.kehadiranPegawai["Hadir"] || 0,
          res.data.kehadiranPegawai["Alfa"] || 0,
          res.data.kehadiranPegawai["Cuti"] || 0,
        ]);
        setTotalPegawai([
          res.data.totalPegawai["laki laki"] || 0,
          res.data.totalPegawai["perempuan"] || 0,
        ]);
        setStatusPegawai([
          res.data.statusPegawai["Percobaan"] || 0,
          res.data.statusPegawai["Kontrak"] || 0,
          res.data.statusPegawai["Permanen"] || 0,
        ]);
        setTotalPerusahaan([
          res.data.totalPerusahaan["Aktif"] || 0,
          res.data.totalPerusahaan["Nonaktif"] || 0,
        ]);
        setDashboardLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard data.");
      });
  }, [filterValue, limitPresensi, limitAbsensi, offset, selectedPerusahaan]); // Add offset to dependencies

  const isEqualArray = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  useEffect(() => {
    if (isEqualArray(kehadiranPegawai, [0, 0, 0])) setKehadiranPegawai([]);
    if (isEqualArray(statusPegawai, [0, 0, 0])) setStatusPegawai([]);
    if (isEqualArray(totalPerusahaan, [0, 0])) setTotalPerusahaan([]);
    if (isEqualArray(totalPegawai, [0, 0])) setTotalPegawai([]);
  }, [kehadiranPegawai, statusPegawai, totalPerusahaan, totalPegawai]);

  const AbsensiWithIndex = getDataAbsensiResult.results
    ? getDataAbsensiResult.results.map((item, index) => ({
        ...item,
        index: pageAbsensiActive * limitAbsensi + index + 1,
      }))
    : [];

  const PresensiWithIndex = getDataPresensiResult.results
    ? getDataPresensiResult.results.map((item, index) => ({
        ...item,
        index: pageAbsensiActive * limitPresensi + index + 1,
      }))
    : [];

  if (dashboardLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <PulseLoading />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:gap-6">
        <div
          className={`grid ${
            jwt.perusahaan ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"
          } gap-4`}
        >
          <CardDonuts
            noDataText="Tidak ada data hari ini"
            title="Jumlah Pegawai"
            icon={<LuUsers />}
            dataSeries={totalPegawai}
            dataLabels={["Laki Laki", "Perempuan"]}
            dataColor={["#36AE7C", "#EB5353"]}
          />
          <CardDonuts
            noDataText="Tidak ada data hari ini"
            title={"Status Pegawai"}
            icon={<LuUsers />}
            dataSeries={statusPegawai}
            dataLabels={["Permanen", "Kontrak", "Percobaan"]}
            dataColor={["#36AE7C", "#F9D923", "#EB5353"]}
          />
          <CardDonuts
            noDataText="Tidak ada data hari ini"
            title="Kehadiran Pegawai"
            icon={<LuUsers />}
            dataSeries={kehadiranPegawai}
            dataLabels={["Hadir", "Alfa", "Cuti"]}
            dataColor={["#36AE7C", "#EB5353", "#FF8AAE"]}
          />
          {!jwt.perusahaan && (
            <CardDonuts
              noDataText="Tidak ada data hari ini"
              title={"Jumlah Perusahaan"}
              icon={<LuBuilding />}
              dataSeries={totalPerusahaan}
              dataLabels={["Aktif", "Nonaktif"]}
              dataColor={["#36AE7C", "#EB5353"]}
            />
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Presensi Table */}
          <Container>
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xl">
                  <LuUserCheck />
                </span>
                <span>Presensi Pegawai</span>
              </div>
              <input
                className="bg-white dark:bg-base-600 text-sm outline-none font-light"
                type="date"
                value={filterValue}
                onChange={(e) => handleFilterDate(e.target.value)}
              />
            </div>
            {getDataPresensiLoading ? (
              <div className="flex justify-center items-center py-10">
                <PulseLoading size={13} />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Tables>
                  <Tables.Head>
                    <Tables.Row>
                      <Tables.Header>No</Tables.Header>
                      <Tables.Header>Nama Pegawai</Tables.Header>
                      <Tables.Header>Tanggal</Tables.Header>
                      <Tables.Header>Status</Tables.Header>
                    </Tables.Row>
                  </Tables.Head>
                  <Tables.Body>
                    {PresensiWithIndex.length > 0 ? (
                      PresensiWithIndex.map((item, index) => (
                        <Tables.Row key={index}>
                          <Tables.Data>{index + 1}</Tables.Data>
                          <Tables.Data>{item.nama}</Tables.Data>
                          <Tables.Data>{item.tanggal}</Tables.Data>
                          <Tables.Data>{item.keterangan}</Tables.Data>
                        </Tables.Row>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          Tidak ada data hari ini
                        </td>
                      </tr>
                    )}
                  </Tables.Body>
                </Tables>
                {/* <Limit
                limit={limitPresensi}
                setLimit={setLimitPresensi}
                onChange={(newLimit) => {
                  setLimitPresensi(newLimit);
                  handleSelectPresensi(newLimit);
                }}
              /> */}
                <div className="flex justify-end items-center">
                  <Pagination
                    totalCount={getDataPresensiResult.count}
                    pageSize={limitPresensi}
                    currentPage={pagePresensiActive + 1}
                    onPageChange={handlePagePresensiClick}
                    siblingCount={1}
                    activeColor="primary"
                    rounded="md"
                    variant="flat"
                    size="md"
                  />
                </div>
              </div>
            )}
          </Container>

          {/* Absensi Table */}
          <Container>
            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <span className="text-xl">
                  <LuUserX />
                </span>
                <span>Absensi Pegawai</span>
              </div>
              <input
                className="bg-white dark:bg-base-600 text-sm outline-none font-light"
                type="date"
                value={filterValue}
                onChange={(e) => handleFilterDate(e.target.value)}
              />
            </div>
            {getDataAbsensiLoading ? (
              <div className="flex justify-center items-center py-10">
                <PulseLoading size={13} />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Tables>
                  <Tables.Head>
                    <Tables.Row>
                      <Tables.Header>No</Tables.Header>
                      <Tables.Header>Nama Pegawai</Tables.Header>
                      <Tables.Header>Tanggal</Tables.Header>
                      <Tables.Header>Keterangan</Tables.Header>
                      {/* <Tables.Header>Status</Tables.Header> */}
                    </Tables.Row>
                  </Tables.Head>
                  <Tables.Body>
                    {AbsensiWithIndex.length > 0 ? (
                      AbsensiWithIndex.map((item, index) => (
                        <Tables.Row key={index}>
                          <Tables.Data>{index + 1}</Tables.Data>
                          <Tables.Data>{item.nama}</Tables.Data>
                          <Tables.Data>{item.tanggal}</Tables.Data>
                          <Tables.Data>{item.keterangan}</Tables.Data>
                          {/* <Tables.Data>{item.status}</Tables.Data> */}
                        </Tables.Row>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          Tidak ada data hari ini
                        </td>
                      </tr>
                    )}
                  </Tables.Body>
                </Tables>
                {/* <Limit
                limit={limitAbsensi}
                setLimit={setLimitAbsensi}
                onChange={(newLimit) => {
                  setLimitAbsensi(newLimit); // Use setLimitAbsensi here
                  handleSelectAbsensi(newLimit); // Call the function to handle limit change for absensi
                }}
              /> */}
                <div className="flex justify-end items-center">
                  <Pagination
                    totalCount={getDataAbsensiResult.count}
                    pageSize={limitAbsensi}
                    currentPage={pageAbsensiActive + 1}
                    onPageChange={handlePageAbsensiClick}
                    siblingCount={1}
                    activeColor="primary"
                    rounded="md"
                    variant="flat"
                    size="md"
                  />
                </div>
              </div>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
