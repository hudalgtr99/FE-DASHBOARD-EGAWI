import { icons } from "../../public/icons";
import Dashboard from "../pages/Dashboard/DashboardPage";
import TentangPage from "../pages/Perusahaan/Tentang/TentangPage";
import PengurusPage from "../pages/Perusahaan/Pengurus/PengurusPage";
import KalenderPage from "../pages/MasterData/Kalender/KalenderPage";
import OrganPage from "../pages/MasterData/Organ/OrganPage";
import StrataPage from "../pages/MasterData/Strata/StrataPage";
import CabangPage from "../pages/MasterData/Cabang/CabangPage";

export const menu = [
  {
    menuIcon: icons.mdspacedashboard,
    menuName: "Dashboard",
    menuLink: "/",
    element: <Dashboard />,
    subMenu: [],
  },
  {
    menuIcon: icons.hiofficebuilding,
    menuName: "Perusahaan",
    menuLink: "perusahaan",

    subMenu: [
      { subMenuName: "Tentang", subMenuLink: "/perusahaan/tentang", element: <TentangPage /> },
      { subMenuName: "Pengurus", subMenuLink: "/perusahaan/pengurus", element: <PengurusPage /> },
    ],
  },
  {
    menuIcon: icons.aifilldatabase,
    menuName: "Master Data",
    menuLink: "masterdata",

    subMenu: [
      { subMenuName: "Bagan", subMenuLink: "/masterdata/bagan" },
      {
        subMenuName: "Cabang",
        subMenuLink: "/masterdata/cabang",
        element: <CabangPage />,
        isSuperAdmin: true,
      },
      { subMenuName: "Strata", subMenuLink: "/masterdata/strata", element: <StrataPage /> },
      { subMenuName: "Organ", subMenuLink: "/masterdata/organ", element: <OrganPage /> },
      { subMenuName: "Gaji", subMenuLink: "/masterdata/gaji" },
      { subMenuName: "Tunjangan", subMenuLink: "/masterdata/tunjangan" },
      { subMenuName: "Potongan", subMenuLink: "/masterdata/potongan" },
      { subMenuName: "Kalender", subMenuLink: "/masterdata/kalender", element: <KalenderPage /> },
    ],
  },
  {
    menuIcon: icons.hiusergroup,
    menuName: "Kepegawaian",
    menuLink: "kepegawaian",

    subMenu: [
      { subMenuName: "Pegawai", subMenuLink: "/kepegawaian/pegawai" },
      { subMenuName: "Payroll", subMenuLink: "/kepegawaian/payroll" },
      { subMenuName: "Penugasan", subMenuLink: "/kepegawaian/penugasan" },
      { subMenuName: "Rekrutmen", subMenuLink: "/kepegawaian/rekrutmen" },
    ],
  },
  {
    menuIcon: icons.faclipboardlist,
    menuName: "Asesmen",
    menuLink: "asesmen",

    subMenu: [
      { subMenuName: "Cuti", subMenuLink: "/asesmen/cuti" },
      { subMenuName: "Kehadiran", subMenuLink: "/asesmen/kehadiran" },
      { subMenuName: "Kinerja", subMenuLink: "/asesmen/kinerja" },
      { subMenuName: "Karir", subMenuLink: "/asesmen/karir" },
    ],
  },
  {
    menuIcon: icons.fiactivity,
    menuName: "Kompetensi",
    menuLink: "kompetensi",

    subMenu: [
      { subMenuName: "Sebaran", subMenuLink: "/kompetensi/sebaran" },
      { subMenuName: "Program", subMenuLink: "/kompetensi/program" },
      { subMenuName: "Kegiatan", subMenuLink: "/kompetensi/kegiatan" },
    ],
  },
  {
    menuIcon: icons.fahandshake,
    menuName: "Kemitraan",
    menuLink: "kemitraan",

    subMenu: [
      { subMenuName: "Perusahaan", subMenuLink: "/kemitraan/perusahaan" },
      { subMenuName: "Perseorangan", subMenuLink: "/kemitraan/perseorangan" },
    ],
  },
  {
    menuIcon: icons.iodocumenttext,
    menuName: "Dokumentasi",
    menuLink: "dokumentasi",

    subMenu: [
      {
        subMenuName: "Administratif",
        subMenuLink: "/dokumentasi/administratif",
      },
      { subMenuName: "Kegiatan", subMenuLink: "/dokumentasi/kegiatan" },
      { subMenuName: "Transaksi", subMenuLink: "/dokumentasi/transaksi" },
      { subMenuName: "Raport", subMenuLink: "/dokumentasi/raport" },
    ],
  },
  {
    menuIcon: icons.aitwotoneapi,
    menuName: "API",
    menuLink: "api",
    isSuperAdmin: true,
    subMenu: [
      { subMenuName: "Api", subMenuLink: "/api/api" },
      {
        subMenuName: "Callback",
        subMenuLink: "/api/callback",
      },
    ],
  },
  {
    menuIcon: icons.fausers,
    menuName: "Akun",
    menuLink: "/akun",
    subMenu: [],
  },
];
