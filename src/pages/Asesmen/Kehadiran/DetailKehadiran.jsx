import {
  Container,
  Tables,
} from "@/components";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { icons } from "../../../../public/icons";
import {
  API_URL_createabsensi,
  API_URL_getdetailkehadiran,
} from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";
import axiosAPI from "@/authentication/axiosApi";
import DetailModal from "./DetailModal"; // Adjust the import path as necessary
import { IoMdReturnLeft } from "react-icons/io";

const DetailKehadiran = () => {
  const { addUserAbsensiResult } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dataTables, setDataTables] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosAPI.post(API_URL_getdetailkehadiran, {
        "date-month": location.state.date,
        user_id: location.state.user_id,
      });
      setDataTables(res.data);
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (addUserAbsensiResult) {
      fetchData();
    }
  }, [addUserAbsensiResult]);

  const showDetail = (item) => {
    setSelectedDetail(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDetail(null);
  };

  return (
    <Fragment>
      <Container>
        <div className="flex justify-between items-center">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate(-1)}
          >
            <IoMdReturnLeft />
          </button>
          <div
            className="text-grey-600 cursor-pointer"
            onClick={() => navigate('/asesmen/kehadiran/edit', { state: { detail: dataTables, user_id: location.state.user_id } })}
          >
            {icons.fiedit}
          </div>
        </div>

        {/* Data */}
        <div className="pt-4 pb-2 w-auto">
          {loading ? (
            <div className="flex justify-center items-center">
              <PulseLoader loading={loading} color="#111827" />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center text-red-500">{error}</div>
          ) : (
            <Tables size="md" density="normal" tablefix={true}>
              <Tables.Head>
                <Tables.Row>
                  <Tables.Header>Tanggal</Tables.Header>
                  <Tables.Header>Waktu Masuk</Tables.Header>
                  <Tables.Header>Alamat Masuk</Tables.Header>
                  <Tables.Header>Waktu Keluar</Tables.Header>
                  <Tables.Header>Alamat Keluar</Tables.Header>
                </Tables.Row>
              </Tables.Head>
              <Tables.Body>
                {dataTables.length > 0 ? (
                  dataTables.map((item, idx) => (
                    <Tables.Row key={idx}>
                      <Tables.Data>{item.tanggal}</Tables.Data>
                      <Tables.Data>{item.waktu_masuk || "-"}</Tables.Data>
                      <Tables.Data>{item.alamat_masuk}</Tables.Data>
                      <Tables.Data>{item.waktu_keluar || "-"}</Tables.Data>
                      <Tables.Data>{item.alamat_keluar}</Tables.Data>
                    </Tables.Row>
                  ))
                ) : (
                  <Tables.Row>
                    <Tables.Data colspan={5} center={true}>
                      No Data Available
                    </Tables.Data>
                  </Tables.Row>
                )}
              </Tables.Body>
            </Tables>
          )}
        </div>

        {/* Modal for Detail */}
        <DetailModal isOpen={isModalOpen} detail={selectedDetail} onClose={closeModal} />
      </Container>
    </Fragment>
  );
};

export default DetailKehadiran;
