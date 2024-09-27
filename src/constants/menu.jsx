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
  CutiPage,
  KinerjaPage,
  GajiPage,
  KehadiranPage,
  AkunPage,
  ApiPage,
  CallbackPage,
  PenugasanPage,
  PayrollPage,
  RekerutmenPage,
  BaganPage,
  PotonganPage,
  TunjanganPage,
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
      { subMenuName: "Bagan", subMenuLink: "/masterdata/bagan", element: <BaganPage /> },
      {
        subMenuName: "Cabang",
        subMenuLink: "/masterdata/cabang",
        element: <CabangPage />,
        isSuperAdmin: true,
      },
      { subMenuName: "Strata", subMenuLink: "/masterdata/strata", element: <StrataPage /> },
      { subMenuName: "Organ", subMenuLink: "/masterdata/organ", element: <OrganPage /> },
      { subMenuName: "Gaji", subMenuLink: "/masterdata/gaji", element: <GajiPage /> },
      { subMenuName: "Tunjangan", subMenuLink: "/masterdata/tunjangan", element: <TunjanganPage /> },
      { subMenuName: "Potongan", subMenuLink: "/masterdata/potongan", element: <PotonganPage /> },
      { subMenuName: "Kalender", subMenuLink: "/masterdata/kalender", element: <KalenderPage /> },
    ],
  },
  {
    menuIcon: icons.luusers,
    menuName: "Kepegawaian",
    menuLink: "kepegawaian",

    subMenu: [
      { subMenuName: "Pegawai", subMenuLink: "/kepegawaian/pegawai", element: <PegawaiPage /> },
      { subMenuName: "Payroll", subMenuLink: "/kepegawaian/payroll", element: <PayrollPage /> },
      { subMenuName: "Penugasan", subMenuLink: "/kepegawaian/penugasan", element: <PenugasanPage /> },
      { subMenuName: "Rekrutmen", subMenuLink: "/kepegawaian/rekrutmen", element: <RekerutmenPage /> },
    ],
  },
  {
    menuIcon: icons.luclipboardlist,
    menuName: "Asesmen",
    menuLink: "asesmen",

    subMenu: [
      { subMenuName: "Cuti", subMenuLink: "/asesmen/cuti", element: <CutiPage /> },
      { subMenuName: "Kehadiran", subMenuLink: "/asesmen/kehadiran", element: <KehadiranPage /> },
      { subMenuName: "Kinerja", subMenuLink: "/asesmen/kinerja", element: <KinerjaPage /> },
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
      {
        subMenuName: "Api",
        subMenuLink: "/api/api",
        element: <ApiPage />
      },
      {
        subMenuName: "Callback",
        subMenuLink: "/api/callback",
        element: <CallbackPage />
      },
    ],
  },
  {
    menuIcon: icons.luusers2,
    menuName: "Akun",
    menuLink: "/akun",
    element: <AkunPage />,
    subMenu: [],
  },
];
