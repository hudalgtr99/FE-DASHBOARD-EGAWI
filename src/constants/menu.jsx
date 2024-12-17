import { icons } from "../../public/icons";
import {
  PerusahaanPage,
  Dashboard,
  KalenderPage,
  OrganPage,
  PegawaiPage,
  JabatanPage,
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
  PotonganPage,
  TunjanganPage,
  LokasiAbsen,
  JamKerja,
  Kemitraan,
  Dokumentasi,
} from "@/pages";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import MasterTemplate from "../pages/MasterData/MasterTemplate/MasterTemplatePage";
import SuratPenugasanSlug from "../pages/Kepegawaian/SuratPenugasan/SuratPenugasanPage";
import ImportPegawai from "../pages/Kepegawaian/ImportPegawai/ImportPegawaiPage";

let jwt = null; // Initialize jwt variable

if (isAuthenticated()) {
  const token = isAuthenticated();
  jwt = jwtDecode(token);
}

export const menu = [
  {
    icon: icons.lulayoutdashboard,
    menuLink: "/",
    name: "dashboard",
    title: "Dashboard",
    element: <Dashboard />,
    sub: [],
  },
  {
    icon: icons.ludatabase,
    menuLink: "masterdata",
    name: "masterdata",
    title: "Masterdata",
    element: null, // Change to null if there's no component to render
    sub: [
      {
        menuLink: "masterdata/data-perusahaan",
        name: "data perusahaan",
        title: "Data perusahaan",
        element: <PerusahaanPage />,
        sub: [],
      },
      {
        menuLink: "masterdata/lokasi-absen",
        name: "lokasi absen",
        title: "Lokasi absen",
        element: <LokasiAbsen />,
        isSuperAdmin: true,
        sub: [],
      },
      {
        menuLink: "masterdata/jabatan",
        name: "jabatan",
        title: "Jabatan",
        element: <JabatanPage />,
        sub: [],
      },
      {
        menuLink: "masterdata/organization",
        name: "organization",
        title: "Organization",
        element: <OrganPage />,
        sub: [],
      },
      {
        menuLink: "masterdata/jam-kerja",
        name: "jam kerja",
        title: "Jam kerja",
        element: <JamKerja />,
        sub: [],
      },
      ...(jwt && jwt.level === "Super Admin"
        ? [
            {
              menuLink: "/masterdata/master-template",
              name: "master template",
              title: "Master Template",
              element: <MasterTemplate />,
              sub: [],
            },
          ]
        : []),
    ],
  },
  {
    icon: icons.luusers,
    menuLink: "kepegawaian",
    name: "kepegawaian",
    title: "Kepegawaian",
    element: null, // Change to null if there's no component to render
    sub: [
      {
        menuLink: "/kepegawaian/pegawai",
        name: "data pegawai",
        title: "Data Pegawai",
        element: <PegawaiPage />,
        sub: [],
      },
      {
        menuLink: "/masterdata/import-pegawai",
        name: "import pegawai",
        title: "Import Pegawai",
        element: <ImportPegawai />,
        sub: [],
      },
      {
        menuLink: "/kepegawaian/penugasan",
        name: "penugasan pekerjaan",
        title: "Penugasan Pekerjaan",
        element: <PenugasanPage />,
        sub: [],
      },
      {
        menuLink: "/kepegawaian/surat-penugasan",
        name: "surat penugasan",
        title: "Surat Penugasan",
        element: <SuratPenugasanSlug />,
        sub: [],
      },
      {
        menuLink: "/kepegawaian/rekrutmen",
        name: "rekrutmen",
        title: "Rekrutmen",
        element: <RekerutmenPage />,
        sub: [],
      },
    ],
  },
  // {
  //   icon: icons.luNewspaper,
  //   menuLink: "suratPenugasan",
  //   name: "surat penugasan",
  //   title: "Surat Penugasan",
  //   element: null, // Change to null if there's no component to render
  //   sub: [
  //     {
  //       icon: icons.luSmartHome,
  //       menuLink: "/surat-penugasan/master-template",
  //       name: "master template",
  //       title: "Master Template",
  //       element: <MasterTemplate />,
  //       sub: [],
  //     },
  //   ],
  // },
  {
    icon: icons.luclipboardlist,
    menuLink: "asesmen",
    name: "asesmen",
    title: "Asesmen",
    element: null, // Change to null if there's no component to render
    sub: [
      {
        menuLink: "/asesmen/kehadiran",
        name: "kehadiran",
        title: "Kehadiran",
        element: <KehadiranPage />,
        sub: [],
      },
      {
        menuLink: "/asesmen/cuti",
        name: "cuti",
        title: "Cuti",
        element: <CutiPage />,
        sub: [],
      },
    ],
  },
  {
    icon: icons.luhearthandshake,
    menuLink: "/kemitraan",
    name: "kemitraan",
    title: "Kemitraan",
    element: <Kemitraan />,
    sub: [],
  },
  {
    icon: icons.lufiletext,
    menuLink: "/dokumentasi",
    name: "dokumentasi",
    title: "Dokumentasi",
    element: <Dokumentasi />,
    sub: [],
  },
  ...(jwt && jwt.level === "Super Admin"
    ? [
        {
          icon: icons.luunplug,
          menuLink: "api",
          name: "api",
          title: "API",
          isSuperAdmin: true,
          element: null, // Change to null if there's no component to render
          sub: [
            {
              icon: icons.luSmartHome,
              menuLink: "/api/api",
              name: "api",
              title: "Api",
              element: <ApiPage />,
              sub: [],
            },
            {
              icon: icons.luSmartHome,
              menuLink: "/api/callback",
              name: "callback",
              title: "Callback",
              element: <CallbackPage />,
              sub: [],
            },
          ],
        },
        {
          icon: icons.luusers2,
          menuLink: "/akun",
          name: "akun",
          title: "Akun",
          element: <AkunPage />,
          sub: [],
        },
      ]
    : []),
  {
    icon: icons.luCalendarDays,
    menuLink: "/kalender",
    name: "kalender",
    title: "Kalender",
    element: <KalenderPage />,
    sub: [],
  },
];
