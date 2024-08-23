import { icons } from "../../public/icons";

export const menu = [
  {
    menuIcon: icons.mdspacedashboard,
    menuName: "Dashboard",
    menuLink: "/",
    subMenu: [],
  },
  {
    menuIcon: icons.hiofficebuilding,
    menuName: "Perusahaan",
    menuLink: "perusahaan",

    subMenu: [
      { subMenuName: "Tentang", subMenuLink: "/perusahaan/tentang" },
      { subMenuName: "Pengurus", subMenuLink: "/perusahaan/pengurus" },
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
        isSuperAdmin: true,
      },
      { subMenuName: "Strata", subMenuLink: "/masterdata/strata" },
      { subMenuName: "Organ", subMenuLink: "/masterdata/organ" },
      { subMenuName: "Gaji", subMenuLink: "/masterdata/gaji" },
      { subMenuName: "Tunjangan", subMenuLink: "/masterdata/tunjangan" },
      { subMenuName: "Potongan", subMenuLink: "/masterdata/potongan" },
      { subMenuName: "Kalender", subMenuLink: "/masterdata/kalender" },
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
