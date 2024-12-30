import { Avatar, Button, Card, Container } from "../../../components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import {
  LuArrowDown,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
  LuClipboardList,
} from "react-icons/lu";
import { API_URL_getdetailtugas } from "../../../constants";
import axiosAPI from "@/authentication/axiosApi";
import { useParams } from "react-router-dom";
import moment from "moment";

const PenugasanDetail = () => {
  const { themeColor } = useContext(ThemeContext);
  const [detail, setDetail] = useState([]);
  const [progress, setProgress] = useState({
    daysRemaining: 0,
    percentage: 0,
    totalDuration: 0,
  });
  const { pk } = useParams();
  const [loading, setLoading] = useState(false);
  const statuses = [
    { label: "Menunggu Persetujuan", value: 0, color: "#f59e0b" },
    { label: "Proses", value: 1, color: "info" },
    { label: "Meminta Ulasan", value: 2, color: "#f59e0b" },
    { label: "Selesai", value: 3, color: "success" },
    { label: "Ditolak", value: 4, color: "danger" },
  ];

  const prioritases = [
    {
      value: "1",
      label: "Tinggi",
      color: "text-[#F26969]",
      icon: LuArrowUp,
    },
    {
      value: "2",
      label: "Sedang",
      color: "text-[#4ED17E]",
      icon: LuArrowRight,
    },
    {
      value: "3",
      label: "Rendah",
      color: "text-[#629BF8]",
      icon: LuArrowDown,
    },
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

  useEffect(() => {
    const calculateProgress = () => {
      const startDate = new Date(detail.start_date);
      const endDate = new Date(detail.end_date);
      const today = new Date();

      const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24); // Durasi total dalam hari

      if (today < startDate) {
        setProgress({
          daysRemaining: Math.ceil((startDate - today) / (1000 * 60 * 60 * 24)),
          percentage: 0, // Belum dimulai
          totalDuration: totalDays, // Total durasi proyek
        });
        return;
      }
      if (today > endDate) {
        setProgress({
          daysRemaining: 0,
          percentage: 100, // Sudah selesai
          totalDuration: totalDays, // Total durasi proyek
        });
        return;
      }

      const daysPassed = (today - startDate) / (1000 * 60 * 60 * 24);
      const daysRemaining = Math.ceil(totalDays - daysPassed);
      const progressPercentage = (daysPassed / totalDays) * 100;

      setProgress({
        daysRemaining: daysRemaining,
        percentage: progressPercentage.toFixed(2), // Maksimal 2 desimal
        totalDuration: totalDays, // Total durasi proyek
      });
    };

    calculateProgress();
  }, [detail]);

  if (!loading) {
    return null;
  }

  const statusObject = statuses.find(
    (status) => status.value === detail?.status
  );
  const statusLabel = statusObject ? statusObject.label : "Unknown Status";

  const prioritasObject = prioritases.find(
    (prioritas) => prioritas.value === detail?.prioritas
  );

  const PrioritasIcon = prioritasObject?.icon;

  const prioritasLabel = prioritasObject
    ? prioritasObject.label
    : "Unknown Prioritas";

  return (
    <div className="flex flex-col gap-4">
      <Card density={"loose"} onClick={false} reverse={true} variant={"gradient"}>
        <div className="flex justify-between items-start">
          <Button size={30} color="white">
            <LuArrowLeft style={{ color: themeColor }} />
          </Button>
          <img
            src="/images/icons/backgroundassets-egawi.png"
            alt=""
            className="-m-4 w-64"
          />
        </div>
        <div className="absolute bottom-4 -mx-3 w-full pl-3 pr-9">
          <div className="text-base font-bold mb-1">{detail.judul}</div>
          <div className="text-sm mb-4 text-justify">{detail.deskripsi}</div>
          <div class="flex flex-col bg-white p-4 rounded-md bg-opacity-20 gap-1">
            <div class="text-sm font-bold">Progress Tugas</div>
            <div class="relative h-3 bg-gray-300 rounded-full">
              <div
                class={`absolute top-0 left-0 h-3 bg-green-400 rounded-full progress-bar w-[${progress.percentage}%]`}
              ></div>
            </div>
            <div class="text-sm font-semibold">
              {progress.daysRemaining <= 0
                ? "Sudah Selesai"
                : progress.daysRemaining + " Hari Lagi"}{" "}
              <span class="float-right">{progress.percentage}%</span>
            </div>
          </div>
        </div>
      </Card>
      <Container>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LuClipboardList className="text-xl" />
            <p className="text-base font-bold">Informasi</p>
          </div>
          <Button disabled color={statusObject?.color}>{statusLabel}</Button>
        </div>
        <ProfileHeader
          pengirim
          image={detail?.pengirim.image}
          nama={detail?.pengirim.nama}
        />

        <div className="flex flex-col gap-2 items-start ml-[1.2rem] -my-2">
          <div className="h-3 w-[3px] bg-base-200 dark:bg-base-200 rounded-md"></div>
          <div className="h-3 w-[3px] bg-base-200 dark:bg-base-200 rounded-md"></div>
          <div className="h-3 w-[3px] bg-base-200 dark:bg-base-200 rounded-md"></div>
        </div>

        <div className="flex flex-col gap-3">
          {detail?.penerima.map((penerima) => (
            <ProfileHeader
              key={penerima.id}
              image={penerima.image}
              nama={penerima.nama}
            />
          ))}
        </div>
        <div className="flex flex-col">
          <p className="text-base font-bold">Waktu</p>
          <p className="text-sm">
            {moment(detail?.start_date).format("D MMMM YYYY")} -{" "}
            {moment(detail?.end_date).format("D MMMM YYYY")}
          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-base font-bold">Prioritas</p>
          <div className="flex items-center gap-1">
            {PrioritasIcon && (
              // Ensure that PrioritasIcon is treated as a valid React component
              <PrioritasIcon className={`text-base ${prioritasObject.color}`} />
            )}
            <p className="text-sm ">{prioritasLabel}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-base font-bold">Durasi</p>
          <p className="text-sm">{progress.totalDuration} Hari</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-base font-bold">Lampiran</p>
          {detail.file ? (
            <iframe
              src={detail?.file}
              frameborder="0"
              height={400}
              className="w-full"
            ></iframe>
          ) : "-"}
        </div>
      </Container>
    </div>
  );
};

import React from "react";

const ProfileHeader = ({ image, nama, pengirim = false }) => {
  return (
    <div className="flex justify-center items-start gap-2">
      <div className="flex-1 mt-[2px]">
        <Avatar size="md">
          {image ? (
            <img src={image} alt="" className="w-full h-full object-cover" />
          ) : (
            nama?.substring(0, 2).toUpperCase() || "-"
          )}
        </Avatar>
      </div>
      <div className="flex flex-col gap-1 w-[94.5%]">
        <div className="flex flex-col text-sm items-start">
          <p className="font-bold capitalize">
            {pengirim ? "Pengirim" : "Penerima"}
          </p>
          <p className="capitalize">{nama || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default PenugasanDetail;
