import { Layout } from "@/components";
import { menu } from "@/constants/menu";
import Page404 from "@/pages/404/404page";
import AkunPassword from "@/pages/Akun/AkunPassword";
import ApiForm from "@/pages/Api/Api/ApiForm";
import CallbackForm from "@/pages/Api/Callback/CallbackForm";
import DetailKehadiran from "@/pages/Asesmen/Kehadiran/DetailKehadiran";
import EditKehadiran from "@/pages/Asesmen/Kehadiran/EditKehadiran";
import ExportKehadiran from "@/pages/Asesmen/Kehadiran/ExportKehadiran";
import KalenderForm from "@/pages/Kalender/KalenderForm";
import PegawaiForm from "@/pages/Kepegawaian/Pegawai/PegawaiForm";
import PenugasanDetail from "@/pages/Kepegawaian/Penugasan/PenugasanDetail";
import PenugasanForm from "@/pages/Kepegawaian/Penugasan/PenugasanForm";
import LoginPage from "@/pages/Login/LoginPage";
import LoginPrivateRoute from "@/pages/Login/LoginPrivateRoute";
import PrivateRoute from "@/pages/Login/PrivateRoute";
import GajiForm from "@/pages/MasterData/Gaji/GajiForm";
import JabatanForm from "@/pages/MasterData/Jabatan/JabatanForm";
import DepartemenSubForm from "@/pages/MasterData/Organization/Sub/DepartemenSubForm";
import DivisiSubForm from "@/pages/MasterData/Organization/Sub/DivisiSubForm";
import UnitSubForm from "@/pages/MasterData/Organization/Sub/UnitSubForm";
import PerusahaanForm from "@/pages/MasterData/Perusahaan/PerusahaanForm";
import PotonganForm from "@/pages/MasterData/Potongan/PotonganForm";
import TunjanganForm from "@/pages/MasterData/Tunjangan/TunjanganForm";
import ProfilePage from "@/pages/Profile/ProfilePage";
import EditProfileKeluargaPage from "@/pages/Profile/Sub/EditProfileKeluargaPage";
import EditProfileLainnyaPage from "@/pages/Profile/Sub/EditProfileLainnyaPage";
import EditProfilePegawaiPage from "@/pages/Profile/Sub/EditProfilePegawaiPage";
import EditProfilePendidikanPage from "@/pages/Profile/Sub/EditProfilePendidikanPage";
import EditProfilePribadiPage from "@/pages/Profile/Sub/EditProfilePribadiPage";
import UbahPasswordPage from "@/pages/UbahPassword/UbahPasswordPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import KalenderList from "../pages/Kalender/KalenderList";
import SuratPenugasanSlugForm from "../pages/Kepegawaian/SuratPenugasan/SuratPenugasanForm";
import SuratPenugasanSlug from "../pages/Kepegawaian/SuratPenugasan/SuratPenugasanPage";
import JamKerjaForm from "../pages/MasterData/JamKerja/JamKerjaForm";
import JamKerjaPage from "../pages/MasterData/JamKerja/JamKerjaPage";
import LokasiAbsenForm from "../pages/MasterData/LokasiAbsen/LokasiAbsenForm";
import TemplateSlugForm from "../pages/MasterData/MasterTemplate/MasterTemplateForm";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";

import { DepartemenPage, JabatanPage, KalenderPage, LokasiAbsen, PegawaiPage, PenugasanPage } from "@/pages";

import SuratPenugasanPage from "@/pages/Kepegawaian/SuratPenugasan/SuratPenugasanPage";
import FormCalonTugasPage from "@/pages/ManajemenTugas/DaftarCalonTugas/FormCalonTugasPage";
import DetailProyekPage from "@/pages/ManajemenTugas/DaftarProyek/DetailProyekPage";
import SlipGaji from "@/pages/MasterData/Gaji/SlipGaji";
import FormMasterGajiPage from "@/pages/Payroll/MasterGaji/FormMasterGaji";
import DetailPayrollGajiPage from "@/pages/Payroll/Payroll/DetailPayrollGajiPage";
import FormPayrollGajiPage from "@/pages/Payroll/Payroll/FormPayrollGajiPage";
import FormMasterEmailPage from "@/pages/Pengaturan/MasterEmail/FormMasterEmail";
import FormTemplatePage from "@/pages/Pengaturan/Templates/FormTemplatePage";
import ImportPegawai from "../pages/Kepegawaian/ImportPegawai/ImportPegawaiPage";
import FormJobdeskPegawaiPage from "../pages/Kepegawaian/JobdeskPegawai/FormJobdeskPegawaiPage";
import MasterTemplate from "../pages/MasterData/MasterTemplate/MasterTemplatePage";

let jwt = null; // Initialize jwt variable

if (isAuthenticated()) {
	const token = isAuthenticated();
	jwt = jwtDecode(token);
}

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* Private route for the main layout */}
				<Route
					path="/"
					element={
						<PrivateRoute>
							<Layout />
						</PrivateRoute>
					}
				>
					{menu.map((item, index) => {
						if (item.sub?.length > 0) {
							return item.sub.map((sub, index) => {
								return <Route key={index} path={sub.menuLink} element={sub.element} />;
							});
						} else {
							return <Route key={index} path={item.menuLink} element={item.element} />;
						}
					})}

					{/* Jabatan */}
					<Route path="/master-data/jabatan/form" element={<JabatanForm />} />
					<Route path="/master-data/jabatan/form/:pk" element={<JabatanForm />} />

					{/* Organ */}
					<Route path="/master-data/departemen/form" element={<DepartemenSubForm />} />
					<Route path="/master-data/departemen/form/:pk" element={<DepartemenSubForm />} />
					<Route path="/master-data/organization/divisi/form" element={<DivisiSubForm />} />
					<Route path="/master-data/organization/divisi/form/:pk" element={<DivisiSubForm />} />
					<Route path="/master-data/organization/unit/form" element={<UnitSubForm />} />
					<Route path="/master-data/organization/unit/form/:pk" element={<UnitSubForm />} />

					{/* Pegawai */}
					<Route path="/kepegawaian/data-pegawai/form" element={<PegawaiForm />} />
					<Route path="/kepegawaian/data-pegawai/form/:pk" element={<PegawaiForm />} />
					{/* Jobdesk Pegawai */}
					<Route path="/kepegawaian/jobdesk-pegawai/form" element={<FormJobdeskPegawaiPage />} />
					<Route path="/kepegawaian/jobdesk-pegawai/form/:pk" element={<FormJobdeskPegawaiPage />} />
					{/* Master Gaji */}
					<Route path="/payroll/master-gaji/form" element={<FormMasterGajiPage />} />
					<Route path="/payroll/master-gaji/form/:pk" element={<FormMasterGajiPage />} />

					{/* Pengaturan Template Email */}
					<Route path="/pengaturan/template-email/form" element={<FormTemplatePage />} />
					<Route path="/pengaturan/template-email/form/:pk" element={<FormTemplatePage />} />

					{/* Master Email  */}
					<Route path="/pengaturan/masteremail/form" element={<FormMasterEmailPage />} />
					<Route path="/pengaturan/masteremail/form/:pk" element={<FormMasterEmailPage />} />
					{/* Payroll Gaji */}
					<Route path="/payroll/payrollgaji/form" element={<FormPayrollGajiPage />} />
					<Route path="/payroll/payrollgaji/form/:pk" element={<FormPayrollGajiPage />} />

					{/* Detail Payroll Gaji */}
					<Route path="/payroll/payrollgaji/detail" element={<DetailPayrollGajiPage />} />
					<Route path="/payroll/payrollgaji/detail/:pk" element={<DetailPayrollGajiPage />} />
					{/* Master Gaji */}
					<Route path="/manajementugas/daftarcalontugas/form" element={<FormCalonTugasPage />} />
					<Route path="/manajementugas/daftarcalontugas/form/:pk" element={<FormCalonTugasPage />} />

					{/* Master Gaji */}
					<Route path="/manajementugas/daftarproyek/detail" element={<DetailProyekPage />} />
					<Route path="/manajementugas/daftarproyek/detail/:pk" element={<DetailProyekPage />} />

					{/* <Route path="/profile/" /> */}

					{/* perusahaan */}
					{jwt && jwt.level === "Super Admin" && (
						<>
							<Route path="/perusahaan/form" element={<PerusahaanForm />} />
							<Route path="/perusahaan/form/:pk" element={<PerusahaanForm />} />
						</>
					)}
					{/* Kalender */}
					<Route path="/kalender/form" element={<KalenderForm />} />
					<Route path="/kalender/form/:pk" element={<KalenderForm />} />
					<Route path="/kalender/list" element={<KalenderList />} />
					<Route path="/kalender/list/:pk" element={<KalenderList />} />
					{jwt && jwt.level === "Super Admin" && (
						<>
							<Route path="/kalender/:pk" element={<KalenderPage />} />
						</>
					)}
					{/* Gaji */}
					<Route path="/gaji/form" element={<GajiForm />} />
					<Route path="/gaji/slip" element={<SlipGaji />} />

					{/* Gaji */}
					<Route path="/gaji/form" element={<GajiForm />} />

					{/* Kehadiran */}
					<Route path="/asesmen/kehadiran/detail" element={<DetailKehadiran />} />
					<Route path="/asesmen/kehadiran/export" element={<ExportKehadiran />} />
					<Route path="/asesmen/kehadiran/edit" element={<EditKehadiran />} />

					{/* Api */}
					<Route path="/api/form" element={<ApiForm />} />
					<Route path="/api/form/:pk" element={<ApiForm />} />

					{/* Callback */}
					<Route path="/callback/form" element={<CallbackForm />} />
					<Route path="/callback/form/:pk" element={<CallbackForm />} />

					{/* Penugasan */}
					<Route path="/kepegawaian/penugasan/form" element={<PenugasanForm />} />
					<Route path="/kepegawaian/penugasan/form/:id" element={<PenugasanForm />} />
					{/* <Route path="/kepegawaian/penugasan/detail/:pk" element={<PenugasanPDF />} /> */}
					<Route path="/kepegawaian/penugasan/:pk" element={<PenugasanDetail />} />
					<Route path="/manajemen-tugas/daftar-calon-tugas/form" element={<FormCalonTugasPage />} />

					<Route path="/manajemen-tugas/daftar-proyek/form" element={<DetailProyekPage />} />

					{/* Tunjangan */}
					<Route path="/tunjangan/form" element={<TunjanganForm />} />

					{/* manajementugas */}
					<Route path="manajemen-tugas/daftar-proyek/detail" element={<DetailProyekPage />} />

					{/* Potongan */}
					<Route path="/potongan/form" element={<PotonganForm />} />

					{/* lokasi absen */}
					<Route path="/master-data/lokasi-absen/form" element={<LokasiAbsenForm />} />
					<Route path="/master-data/lokasi-absen/form/:pk" element={<LokasiAbsenForm />} />

					{/* jam kerja */}
					<Route path="/master-data/jam-kerja/:slug" element={<JamKerjaPage />} />
					<Route path="/master-data/jam-kerja/form" element={<JamKerjaForm />} />
					<Route path="/master-data/jam-kerja/form/:pk" element={<JamKerjaForm />} />
					{/* <Route path="/master-data/jam-kerja/:pk" element={<JamKerjaPage />} /> */}

					{/* Profile */}
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/profile/password" element={<UbahPasswordPage />} />
					<Route path="/profile/pribadi" element={<EditProfilePribadiPage />} />
					<Route path="/profile/pegawai" element={<EditProfilePegawaiPage />} />
					<Route path="/profile/keluarga" element={<EditProfileKeluargaPage />} />
					<Route path="/profile/pendidikan" element={<EditProfilePendidikanPage />} />
					<Route path="/profile/lainnya" element={<EditProfileLainnyaPage />} />

					<Route path="/master-data/master-template/form" element={<TemplateSlugForm />} />
					<Route path="/master-data/master-template/form/:pk" element={<TemplateSlugForm />} />

					{/* Surat Penugasan */}
					<Route path="/surat-penugasan/master-template/:pk" element={<SuratPenugasanSlug />} />
					<Route path="/kepegawaian/surat-penugasan/form/:id" element={<SuratPenugasanSlugForm />} />
					<Route path="/kepegawaian/surat-penugasan/form" element={<SuratPenugasanSlugForm />} />
					<Route path="/kepegawaian/data-pegawai/changepassword/:id" element={<AkunPassword />} />
					<Route path="/akun/import-pegawai" element={<ImportPegawai />} />

					{/* super admin menu */}
					{jwt && jwt.level === "Super Admin" && (
						<>
							<Route path="/perusahaan/lokasi-absen/:slug" element={<LokasiAbsen />} />
							<Route path="/perusahaan/jabatan/:slug" element={<JabatanPage />} />
							<Route path="/perusahaan/jam-kerja/:slug" element={<JamKerjaPage />} />
							<Route path="/perusahaan/departemen/:slug" element={<DepartemenPage />} />
							<Route path="/perusahaan/penugasan/:slug" element={<PenugasanPage />} />
							<Route path="/perusahaan/pegawai/:slug" element={<PegawaiPage />} />
							<Route path="/perusahaan/surat-penugasan/:slug" element={<SuratPenugasanPage />} />
							<Route path="/perusahaan/master-template/:slug" element={<MasterTemplate />} />
							<Route path="/perusahaan/kalender/:pk" element={<KalenderPage />} />
						</>
					)}
					<Route path="/kepegawaian/data-pegawai/import-pegawai" element={<ImportPegawai />} />

					{/* end super admin menu */}
				</Route>

				{/* Login route with PrivateRoute */}
				<Route
					path="/login"
					element={
						<LoginPrivateRoute>
							<LoginPage />
						</LoginPrivateRoute>
					}
				/>

				{/* 404 Route */}
				<Route path="*" element={<Page404 />} />
			</Routes>
		</BrowserRouter>
	);
};

export default Router;
