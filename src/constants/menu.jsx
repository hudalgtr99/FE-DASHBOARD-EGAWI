import { icons } from "../../public/icons";
import {
  CabangPage,
  Dashboard,
  KalenderPage,
  OrganPage,
  PegawaiPage,
  PengurusPage,
  StrataPage,
  TentangPage,
} from "@/pages";

export const menu = [
  {
    menuIcon: icons.lulayoutdashboard,
    menuName: "Dashboard",
    menuLink: "/",
    element: <Dashboard />,
    subMenu: [],
  },
  {
    menuIcon: icons.lubuilding,
    menuName: "Perusahaan",
    menuLink: "perusahaan",

    subMenu: [
      { subMenuName: "Tentang", subMenuLink: "/perusahaan/tentang", element: <TentangPage /> },
      { subMenuName: "Pengurus", subMenuLink: "/perusahaan/pengurus", element: <PengurusPage /> },
    ],
  },
  {
    menuIcon: icons.ludatabase,
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
    menuIcon: icons.luusers,
    menuName: "Kepegawaian",
    menuLink: "kepegawaian",

    subMenu: [
      { subMenuName: "Pegawai", subMenuLink: "/kepegawaian/pegawai", element: <PegawaiPage /> },
      { subMenuName: "Payroll", subMenuLink: "/kepegawaian/payroll" },
      { subMenuName: "Penugasan", subMenuLink: "/kepegawaian/penugasan" },
      { subMenuName: "Rekrutmen", subMenuLink: "/kepegawaian/rekrutmen" },
    ],
  },
  {
    menuIcon: icons.luclipboardlist,
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
    menuIcon: icons.luactivity,
    menuName: "Kompetensi",
    menuLink: "kompetensi",

    subMenu: [
      { subMenuName: "Sebaran", subMenuLink: "/kompetensi/sebaran" },
      { subMenuName: "Program", subMenuLink: "/kompetensi/program" },
      { subMenuName: "Kegiatan", subMenuLink: "/kompetensi/kegiatan" },
    ],
  },
  {
    menuIcon: icons.luhearthandshake,
    menuName: "Kemitraan",
    menuLink: "kemitraan",

    subMenu: [
      { subMenuName: "Perusahaan", subMenuLink: "/kemitraan/perusahaan" },
      { subMenuName: "Perseorangan", subMenuLink: "/kemitraan/perseorangan" },
    ],
  },
  {
    menuIcon: icons.lufiletext,
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
    menuIcon: icons.luunplug,
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
    menuIcon: icons.luusers2,
    menuName: "Akun",
    menuLink: "/akun",
    subMenu: [],
  },
];
