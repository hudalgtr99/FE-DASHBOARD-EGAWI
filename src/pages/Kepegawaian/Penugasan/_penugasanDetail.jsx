import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Chip,
  Container,
  Modal,
  Tooltip,
} from "../../../components";
import { API_URL_getdetailtugas } from "../../../constants";
import axiosAPI from "@/authentication/axiosApi";
import { useParams } from "react-router-dom";
import moment from "moment";
import { TbUsers } from "react-icons/tb";
const PenugasanDetail = () => {
  const [detail, setDetail] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const { pk } = useParams();
  const [loading, setLoading] = useState(false);
  const statuses = [
    { label: "Menunggu Persetujuan", value: 0, color: "bg-amber-500" },
    { label: "Proses", value: 1, color: "info" },
    { label: "Meminta Ulasan", value: 2, color: "bg-amber-500" },
    { label: "Selesai", value: 3, color: "success" },
    { label: "Ditolak", value: 4, color: "danger" },
  ];

  const prioritases = [
    { value: "1", label: "Tinggi", color: "danger" },
    { value: "2", label: "Sedang", color: "success" },
    { value: "3", label: "Rendah", color: "info" },
  ];

  const fetchData = async () => {
    try {
      const res = await axiosAPI.post(API_URL_getdetailtugas, {
        tugas_id: pk,
      });
      setDetail(res.data);
      setLoading(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!loading) {
    return null;
  }

  // Find the status label based on the numeric value
  const statusObject = statuses.find(
    (status) => status.value === detail?.status
  );
  const statusLabel = statusObject ? statusObject.label : "Unknown Status";

  const prioritasObject = prioritases.find(
    (prioritas) => prioritas.value === detail?.prioritas
  );
  const prioritasLabel = prioritasObject
    ? prioritasObject.label
    : "Unknown Prioritas";

  return (
    <div className="flex flex-col gap-3">
      <Container>
        <div className="flex justify-center items-start gap-2">
          <div className="flex-1 mt-[2px]">
            <Avatar size="md">
              {detail?.pengirim.image ? (
                <img
                  src={detail?.pengirim.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                detail?.pengirim.nama.substring(0, 2).toUpperCase()
              )}
            </Avatar>
          </div>
          <div className="flex flex-col gap-1 w-[94%]">
            <div className="flex gap-2 items-center">
              <p className=" font-bold capitalize ">{detail?.pengirim.nama}</p>
              <Tooltip tooltip="Prioritas">
                <Chip color={prioritasObject.color} rounded="md">
                  {prioritasLabel}
                </Chip>
              </Tooltip>
            </div>
            <div className="flex gap-2 items-center">
              <p className="text-[12px]">
                {moment(detail?.start_date).format("D MMMM YYYY")} -{" "}
                {moment(detail?.end_date).format("D MMMM YYYY")}
              </p>
              <Tooltip tooltip="Penerima">
                <Chip rounded="md">
                  <TbUsers
                    onClick={() => setBasicModal(true)}
                    className="text-sm cursor-pointer"
                  />
                </Chip>
              </Tooltip>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <p className="uppercase font-bold">{detail?.judul}</p>
              {/* <Collapsible>
                {["Item 1"].map((item, index) => (
                  <Collapsible.Item key={index} header={item}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, voluptatum.
                  </Collapsible.Item>
                ))}
              </Collapsible> */}
            </div>
            <div className="mt-1 flex flex-wrap">
              <p className="text-justify">{detail.deskripsi}</p>
            </div>
            {/* <div className="flex justify-end">
                <Button>Lihat file</Button>
            </div> */}
          </div>
        </div>
      </Container>
      {detail.file && (
        <Container>
          <iframe
            src={detail?.file}
            frameborder="0"
            height={400}
            className="w-full"
          ></iframe>
        </Container>
      )}
      <Modal show={basicModal} setShow={setBasicModal} width="sm">
        <div className="text-lg font-normal p-5">
          <div className="mb-3 font-semibold">List penerima</div>
          <div className="flex flex-col gap-1">
            {detail?.penerima.map((penerima) => (
              <div
                key={penerima.id}
                className="flex justify-center items-start gap-2 mb-3"
              >
                <div className="flex-1 mt-[2px]">
                  <Avatar size="md">
                    {penerima.image ? (
                      <img
                        src={penerima.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      penerima.nama.substring(0, 2).toUpperCase() || "-"
                    )}
                  </Avatar>
                </div>
                <div className="flex flex-col gap-1 w-[94%]">
                  <div className="flex flex-col text-sm items-start">
                    <p className=" font-bold capitalize ">
                      {penerima.nama || "-"}
                    </p>
                    <p className="capitalize">{penerima ? penerima.role[0] : "-"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PenugasanDetail;
