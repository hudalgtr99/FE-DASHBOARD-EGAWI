import { isAuthenticated } from "@/authentication/authenticationApi";
import {
	AkunPage,
	CutiPage,
	Dashboard,
	DepartemenPage,
	JabatanPage,
	JamKerja,
	KalenderPage,
	KehadiranPage,
	LokasiAbsen,
	PegawaiPage,
	PerusahaanPage,
} from "@/pages";
import DaftarCalonTugasPage from "@/pages/ManajemenTugas/DaftarCalonTugas/DaftarCalonTugasPage";
import DaftarProyekPage from "@/pages/ManajemenTugas/DaftarProyek/DaftarProyekPage";
import KomponenGaji from "@/pages/Payroll/KomponenGaji/KomponenGaji";
import MasterGajiPage from "@/pages/Payroll/MasterGaji/MasterGaji";
import PayrollGajiPage from "@/pages/Payroll/Payroll/PayrollGajiPage";
import DiagnosticEmail from "@/pages/Pengaturan/DiagnosticEmail/DiagnosticEmail";
import MasterEmailPage from "@/pages/Pengaturan/MasterEmail/MasterEmail";
import TemplatePage from "@/pages/Pengaturan/Templates/TemplatePage";
import { jwtDecode } from "jwt-decode";
import { FaCogs } from "react-icons/fa";
import { LuDollarSign, LuFolder } from "react-icons/lu";
import { icons } from "../../public/icons";
import { JobdeskPegawaiPage } from "../pages";
import LemburPage from "../pages/Asesmen/Lembur/LemburPage";
import ReimbursementPage from "../pages/Asesmen/Reimbursement/ReimbursementPage";
import SuratPenugasanPage from "../pages/Kepegawaian/SuratPenugasan/SuratPenugasanPage";
import MasterTemplate from "../pages/MasterData/MasterTemplate/MasterTemplatePage";

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
		icon: icons.lubuilding,
		menuLink: "perusahaan",
		name: "perusahaan",
		title: "Perusahaan",
		element: <PerusahaanPage />,
		sub: [],
	},
	{
		icon: icons.ludatabase,
		menuLink: "master-data",
		name: "master-data",
		title: "Master Data",
		element: null, // Change to null if there's no component to render
		sub: [
			{
				menuLink: "/master-data/lokasi-absen",
				name: "lokasi-absen",
				title: "Lokasi Absen",
				element: <LokasiAbsen />,
				isSuperAdmin: true,
				sub: [],
			},
			{
				menuLink: "/master-data/jabatan",
				name: "jabatan",
				title: "Jabatan",
				element: <JabatanPage />,
				sub: [],
			},
			{
				menuLink: "/master-data/departemen",
				name: "departemen",
				title: "Departemen",
				element: <DepartemenPage />,
				sub: [],
			},
			...(jwt && jwt.level !== "Super Admin"
				? [
						{
							menuLink: "/master-data/jam-kerja",
							name: "jam-kerja",
							title: "Jam Kerja",
							element: <JamKerja />,
							sub: [],
						},
				  ]
				: []),
			{
				menuLink: "/master-data/master-template",
				name: "master-template",
				title: "Master Template",
				element: <MasterTemplate />,
				sub: [],
			},
		],
	},
	{
		icon: icons.luusers,
		menuLink: "kepegawaian",
		name: "kepegawaian",
		title: "Kepegawaian",
		element: null,
		sub: [
			{
				menuLink: "/kepegawaian/data-pegawai",
				name: "data-pegawai",
				title: "Data Pegawai",
				element: <PegawaiPage />,
				sub: [],
			},
			{
				menuLink: "/kepegawaian/jobdesk-pegawai",
				name: "jobdesk-pegawai",
				title: "Jobdesk Pegawai",
				element: <JobdeskPegawaiPage />,
				sub: [],
			},
			// {
			//   menuLink: "/kepegawaian/penugasan",
			//   name: "penugasan pekerjaan",
			//   title: "Penugasan Pekerjaan",
			//   element: <PenugasanPage />,
			//   sub: [],
			// },
			{
				menuLink: "/kepegawaian/surat-penugasan",
				name: "surat-penugasan",
				title: "Surat Penugasan",
				element: <SuratPenugasanPage />,
				sub: [],
			},
			// {
			//   menuLink: "/kepegawaian/rekrutmen",
			//   name: "rekrutmen",
			//   title: "Rekrutmen",
			//   element: <RekerutmenPage />,
			//   sub: [],
			// },
		],
	},
	{
		icon: <LuDollarSign />,
		menuLink: "payroll",
		name: "payroll",
		title: "Payroll",
		element: null, // Change to null if there's no component to render
		sub: [
			{
				menuLink: "/payroll/master-gaji",
				name: "master-gaji",
				title: "Master Gaji",
				element: <MasterGajiPage />,
				sub: [],
			},
			{
				menuLink: "/payroll/komponen-gaji",
				name: "komponen-gaji",
				title: "Komponen Gaji",
				element: <KomponenGaji />,
				sub: [],
			},
			{
				menuLink: "/payroll/payroll-gaji",
				name: "payroll-gaji",
				title: "Payroll Gaji",
				element: <PayrollGajiPage />,
				sub: [],
			},
		],
	},
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
			{
				menuLink: "/asesmen/lembur",
				name: "lembur",
				title: "Lembur",
				element: <LemburPage />,
				sub: [],
			},
			{
				menuLink: "/asesmen/reimbursement",
				name: "reimbursement",
				title: "Reimbursement",
				element: <ReimbursementPage />,
				sub: [],
			},
		],
	},
	{
		icon: <LuFolder />,
		menuLink: "manajemen-tugas",
		name: "manajemen-tugas",
		title: "Manajemen Tugas",
		element: null, // Change to null if there's no component to render
		sub: [
			{
				menuLink: "/manajemen-tugas/daftar-calon-tugas",
				name: "daftar-calon-tugas",
				title: "Daftar Calon Tugas",
				element: <DaftarCalonTugasPage />,
				sub: [],
			},
			{
				menuLink: "/manajemen-tugas/daftar-proyek",
				name: "daftar-proyek",
				title: "Daftar Proyek",
				element: <DaftarProyekPage />,
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
	{
		icon: icons.luCalendarDays,
		menuLink: "/kalender",
		name: "kalender",
		title: "Kalender",
		element: <KalenderPage />,
		sub: [],
	},
	...(jwt && jwt.level === "Super Admin"
		? [
				{
					icon: <FaCogs />,
					menuLink: "/pengaturan",
					name: "pengaturan",
					title: "pengaturan",
					element: null,
					sub: [
						{
							menuLink: "/pengaturan/master-email",
							name: "master-email",
							title: "Master Email",
							element: <MasterEmailPage />,
							sub: [],
						},
						{
							menuLink: "/pengaturan/diagnostic-email",
							name: "diagnostic-email",
							title: "Diagnostic Email",
							element: <DiagnosticEmail />,
							sub: [],
						},
						{
							menuLink: "/pengaturan/template-email",
							name: "template-email",
							title: "Template Email",
							element: <TemplatePage />,
							sub: [],
						},
					],
				},
		  ]
		: []),
];
