import {
  Avatar,
  Button,
  Card,
  Container,
  PulseLoading,
} from "../../../components";
import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import {
  LuArrowDown,
  LuArrowDownUp,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
  LuClipboardList,
} from "react-icons/lu";
import { API_URL_getdetailtugas } from "../../../constants";
import axiosAPI from "@/authentication/axiosApi";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

const PenugasanDetail = () => {
  const { themeColor } = useContext(ThemeContext);
  const [detail, setDetail] = useState([]);
  const [progress, setProgress] = useState({
    daysRemaining: 0,
    totalDuration: 0,
  });
  const [statusTugas, setStatusTugas] = useState(0);
  const { pk } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
          totalDuration: totalDays, // Total durasi proyek
        });
        return;
      }
      if (today > endDate) {
        setProgress({
          daysRemaining: 0,
          totalDuration: totalDays, // Total durasi proyek
        });
        return;
      }

      const daysPassed = (today - startDate) / (1000 * 60 * 60 * 24);
      const daysRemaining = Math.ceil(totalDays - daysPassed);

      setProgress({
        daysRemaining: daysRemaining,
        totalDuration: totalDays, // Total durasi proyek
      });
    };

    const StatusTugas = () => {
      switch (detail.status) {
        case 0:
          setStatusTugas(0);
          break;
        case 1:
          setStatusTugas(50);
          break;
        case 2:
          setStatusTugas(75);
          break;
        case 3:
          setStatusTugas(100);
          break;
        case 4:
          setStatusTugas(0);
          break;
        default:
          break;
      }
    };

    StatusTugas();
    calculateProgress();
  }, [detail]);

  if (!loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <PulseLoading />
      </div>
    );
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
    console.log(statusTugas),
    <div className="flex flex-col gap-4">
      <Card
        density={"loose"}
        onClick={false}
        reverse={true}
        variant={"gradient"}
      >
        <div className="flex justify-between items-start">
          <Button
            onClick={() => navigate("/kepegawaian/penugasan")}
            size={30}
            color="white"
          >
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
                class="absolute top-0 left-0 h-3 bg-green-400 rounded-full"
                style={{ width: `${statusTugas}%` }}
              ></div>
            </div>
            <div class="text-sm font-semibold">
              {progress.daysRemaining <= 0
                ? "Sudah Selesai"
                : progress.daysRemaining + " Hari Lagi"}{" "}
              <span class="float-right">{statusTugas}%</span>
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
          <Button disabled color={statusObject?.color}>
            {statusLabel}
          </Button>
        </div>
        <ProfileHeader
          pengirim
          image={detail?.pengirim.image}
          nama={detail?.pengirim.nama}
        />

        <div className="flex flex-col gap-2 items-start ml-[.7rem] -my-2">
          <LuArrowDownUp className="text-gray-400 text-lg"></LuArrowDownUp>
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
            detail.file.endsWith(".pdf") ? (
              <iframe
                src={detail?.file}
                frameborder="0"
                height={400}
                className="w-full"
              ></iframe>
            ) : (
              <img
                src={detail?.file}
                alt="file preview"
                className="w-full object-contain max-w-[500px]"
              />
            )
          ) : (
            <div className="flex w-1/3 h-[50px] justify-center items-center border-2 border-gray-300 dark:border-gray-700 rounded-md">
              No data
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 h-fit">
          <p className="text-base font-bold">Riwayat</p>
          <div className="ml-1">
            <TimelineContainer>
              {/* First Timeline Item */}
              <div className="flex flex-col">
                <Timeline />
                <TimelineBody
                  date="20-Desember-2022 - 22-Desember-2022"
                  title="Judul Riwayat"
                  description="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                />
              </div>

              {/* Second Timeline Item */}
              <div className="flex flex-col">
                <Timeline />
                <TimelineBody
                  date="20-Desember-2022 - 22-Desember-2022"
                  title="Judul Riwayat"
                  description="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                />
              </div>

              {/* Third Timeline Item */}
              <div className="flex flex-col">
                <Timeline />
                <TimelineBody
                  date="20-Desember-2022 - 22-Desember-2022"
                  title="Judul Riwayat"
                  description="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                />
              </div>
            </TimelineContainer>
          </div>
        </div>
      </Container>
    </div>
  );
};

// TimelineContainer Component (For Timeline Structure)
const TimelineContainer = ({ children }) => (
  <div className="flex flex-col gap-4 mx-4 sm:flex-row">
    <div className="flex-1 sm:w-9/12">
      <div className="relative px-4 sm:space-y-8 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:w-0.5 sm:before:-left-3 before:bg-gray-500 dark:before:bg-gray-400">
        {children}
      </div>
    </div>
  </div>
);

// TimelineBody Component (For Title, Description, and Date)
const TimelineBody = ({ date, title, description }) => (
  <div className="flex flex-col items-start gap-1 text-justify max-w-[50%] flex-wrap break-words mt-2">
    <p className="text-xs">{date}</p>
    <p className="text-sm font-bold">{title}</p>
    <p className="text-sm">{description}</p>
  </div>
);

const Timeline = () => (
  <div className="sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:bg-gray-500 dark:before:bg-gray-400" />
);

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
