import { Layout } from "@/components";
import { menu } from "@/constants/menu";
import LoginPage from "@/pages/Login/LoginPage";
import PrivateRoute from "@/pages/Login/PrivateRoute";
import LoginPrivateRoute from "@/pages/Login/LoginPrivateRoute";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import JabatanForm from "@/pages/MasterData/Jabatan/JabatanForm";
import DepartemenSubForm from "@/pages/MasterData/Organization/Sub/DepartemenSubForm";
import DivisiSubForm from "@/pages/MasterData/Organization/Sub/DivisiSubForm";
import UnitSubForm from "@/pages/MasterData/Organization/Sub/UnitSubForm";
import PegawaiForm from "@/pages/Kepegawaian/Pegawai/PegawaiForm";
import PerusahaanForm from "@/pages/MasterData/Perusahaan/PerusahaanForm";
import KalenderForm from "@/pages/Kalender/KalenderForm";
import GajiForm from "@/pages/MasterData/Gaji/GajiForm";
import DetailKehadiran from "@/pages/Asesmen/Kehadiran/DetailKehadiran";
import ExportKehadiran from "@/pages/Asesmen/Kehadiran/ExportKehadiran";
import EditKehadiran from "@/pages/Asesmen/Kehadiran/EditKehadiran";
import ApiForm from "@/pages/Api/Api/ApiForm";
import CallbackForm from "@/pages/Api/Callback/CallbackForm";
import PenugasanForm from "@/pages/Kepegawaian/Penugasan/PenugasanForm";
import PenugasanDetail from "@/pages/Kepegawaian/Penugasan/PenugasanDetail";
import TunjanganForm from "@/pages/MasterData/Tunjangan/TunjanganForm";
import PotonganForm from "@/pages/MasterData/Potongan/PotonganForm";
import ProfilePage from "@/pages/Profile/ProfilePage";
import UbahPasswordPage from "@/pages/UbahPassword/UbahPasswordPage";
import AkunPassword from "@/pages/Akun/AkunPassword";
import EditProfilePribadiPage from "@/pages/Profile/Sub/EditProfilePribadiPage";
import EditProfilePegawaiPage from "@/pages/Profile/Sub/EditProfilePegawaiPage";
import EditProfileKeluargaPage from "@/pages/Profile/Sub/EditProfileKeluargaPage";
import EditProfilePendidikanPage from "@/pages/Profile/Sub/EditProfilePendidikanPage";
import EditProfileLainnyaPage from "@/pages/Profile/Sub/EditProfileLainnyaPage";
import KalenderList from "../pages/Kalender/KalenderList";
import LokasiAbsenForm from "../pages/MasterData/LokasiAbsen/LokasiAbsenForm";
import JamKerjaForm from "../pages/MasterData/JamKerja/JamKerjaForm";
import JamKerjaPage from "../pages/MasterData/JamKerja/JamKerjaPage";
import TemplateSlugForm from "../pages/MasterData/MasterTemplate/MasterTemplateForm";
import SuratPenugasanSlug from "../pages/Kepegawaian/SuratPenugasan/SuratPenugasanPage";
import SuratPenugasanSlugForm from "../pages/Kepegawaian/SuratPenugasan/SuratPenugasanForm";
import Page404 from "@/pages/404/404page";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";

import {
  KalenderPage,
  JabatanPage,
  PenugasanPage,
  LokasiAbsen,
  JamKerja,
  PegawaiPage,
  DepartemenPage,
} from "@/pages";

import MasterTemplate from "../pages/MasterData/MasterTemplate/MasterTemplatePage";
import SuratPenugasanPage from "@/pages/Kepegawaian/SuratPenugasan/SuratPenugasanPage";
import ImportPegawai from "../pages/Kepegawaian/ImportPegawai/ImportPegawaiPage";

let jwt = null; // Initialize jwt variable

if (isAuthenticated()) {
  const token = isAuthenticated();
  jwt = jwtDecode(token);
}
import SlipGaji from "@/pages/MasterData/Gaji/SlipGaji";
import FormJobdeskPegawaiPage from "../pages/Kepegawaian/JobdeskPegawai/FormJobdeskPegawaiPage";
import FormMasterGajiPage from "@/pages/Payroll/MasterGaji/FormMasterGaji";
import FormCalonTugasPage from "@/pages/ManajemenTugas/DaftarCalonTugas/FormCalonTugasPage";
import DetailProyekPage from "@/pages/ManajemenTugas/DaftarProyek/DetailProyekPage";

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
                return (
                  <Route
                    key={index}
                    path={sub.menuLink}
                    element={sub.element}
                  />
                );
              });
            } else {
              return (
                <Route
                  key={index}
                  path={item.menuLink}
                  element={item.element}
                />
              );
            }
          })}

          {/* Jabatan */}
          <Route path="/masterdata/jabatan/form" element={<JabatanForm />} />
          <Route
            path="/masterdata/jabatan/form/:pk"
            element={<JabatanForm />}
          />

          {/* Organ */}
          <Route
            path="/masterdata/departemen/form"
            element={<DepartemenSubForm />}
          />
          <Route
            path="/masterdata/departemen/form/:pk"
            element={<DepartemenSubForm />}
          />
          <Route
            path="/masterdata/organization/divisi/form"
            element={<DivisiSubForm />}
          />
          <Route
            path="/masterdata/organization/divisi/form/:pk"
            element={<DivisiSubForm />}
          />
          <Route
            path="/masterdata/organization/unit/form"
            element={<UnitSubForm />}
          />
          <Route
            path="/masterdata/organization/unit/form/:pk"
            element={<UnitSubForm />}
          />

          {/* Pegawai */}
          <Route path="/kepegawaian/pegawai/form" element={<PegawaiForm />} />
          <Route
            path="/kepegawaian/pegawai/form/:pk"
            element={<PegawaiForm />}
          />
          {/* Jobdesk Pegawai */}
          <Route
            path="/kepegawaian/jobdeskpegawai/form"
            element={<FormJobdeskPegawaiPage />}
          />
          <Route
            path="/kepegawaian/jobdeskpegawai/form/:pk"
            element={<FormJobdeskPegawaiPage />}
          />
          {/* Master Gaji */}
          <Route
            path="/payroll/mastergaji/form"
            element={<FormMasterGajiPage />}
          />
          <Route
            path="/payroll/mastergaji/form/:pk"
            element={<FormMasterGajiPage />}
          />
          {/* Master Gaji */}
          <Route
            path="/manajementugas/daftarcalontugas/form"
            element={<FormCalonTugasPage />}
          />
          <Route
            path="/manajementugas/daftarcalontugas/form/:pk"
            element={<FormCalonTugasPage />}
          />

          {/* Master Gaji */}
          <Route
            path="/manajementugas/daftarproyek/detail"
            element={<DetailProyekPage />}
          />
          <Route
            path="/manajementugas/daftarproyek/detail/:pk"
            element={<DetailProyekPage />}
          />

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
          <Route
            path="/asesmen/kehadiran/detail"
            element={<DetailKehadiran />}
          />
          <Route
            path="/asesmen/kehadiran/export"
            element={<ExportKehadiran />}
          />
          <Route path="/asesmen/kehadiran/edit" element={<EditKehadiran />} />

          {/* Api */}
          <Route path="/api/form" element={<ApiForm />} />
          <Route path="/api/form/:pk" element={<ApiForm />} />

          {/* Callback */}
          <Route path="/callback/form" element={<CallbackForm />} />
          <Route path="/callback/form/:pk" element={<CallbackForm />} />

          {/* Penugasan */}
          <Route
            path="/kepegawaian/penugasan/form"
            element={<PenugasanForm />}
          />
          <Route
            path="/kepegawaian/penugasan/form/:id"
            element={<PenugasanForm />}
          />
          {/* <Route path="/kepegawaian/penugasan/detail/:pk" element={<PenugasanPDF />} /> */}
          <Route
            path="/kepegawaian/penugasan/:pk"
            element={<PenugasanDetail />}
          />

          {/* Tunjangan */}
          <Route path="/tunjangan/form" element={<TunjanganForm />} />

          {/* Potongan */}
          <Route path="/potongan/form" element={<PotonganForm />} />

          {/* lokasi absen */}
          <Route
            path="/masterdata/lokasi-absen/form"
            element={<LokasiAbsenForm />}
          />
          <Route
            path="/masterdata/lokasi-absen/form/:pk"
            element={<LokasiAbsenForm />}
          />

          {/* jam kerja */}
          <Route
            path="/masterdata/jam-kerja/:slug"
            element={<JamKerjaPage />}
          />
          <Route path="/masterdata/jam-kerja/form" element={<JamKerjaForm />} />
          <Route
            path="/masterdata/jam-kerja/form/:pk"
            element={<JamKerjaForm />}
          />
          {/* <Route path="/masterdata/jam-kerja/:pk" element={<JamKerjaPage />} /> */}

          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/password" element={<UbahPasswordPage />} />
          <Route path="/profile/pribadi" element={<EditProfilePribadiPage />} />
          <Route path="/profile/pegawai" element={<EditProfilePegawaiPage />} />
          <Route
            path="/profile/keluarga"
            element={<EditProfileKeluargaPage />}
          />
          <Route
            path="/profile/pendidikan"
            element={<EditProfilePendidikanPage />}
          />
          <Route path="/profile/lainnya" element={<EditProfileLainnyaPage />} />

          <Route
            path="/masterdata/master-template/form"
            element={<TemplateSlugForm />}
          />
          <Route
            path="/masterdata/master-template/form/:pk"
            element={<TemplateSlugForm />}
          />

          {/* Surat Penugasan */}
          <Route
            path="/surat-penugasan/master-template/:pk"
            element={<SuratPenugasanSlug />}
          />
          <Route
            path="/kepegawaian/surat-penugasan/form/:id"
            element={<SuratPenugasanSlugForm />}
          />
          <Route
            path="/kepegawaian/surat-penugasan/form"
            element={<SuratPenugasanSlugForm />}
          />
          <Route
            path="/kepegawaian/pegawai/changepassword/:id"
            element={<AkunPassword />}
          />
          <Route path="/akun/import-pegawai" element={<ImportPegawai />} />

          {/* super admin menu */}
          {jwt && jwt.level === "Super Admin" && (
            <>
              <Route
                path="/perusahaan/lokasi-absen/:slug"
                element={<LokasiAbsen />}
              />
              <Route
                path="/perusahaan/jabatan/:slug"
                element={<JabatanPage />}
              />
              <Route
                path="/perusahaan/jam-kerja/:slug"
                element={<JamKerjaPage />}
              />
              <Route
                path="/perusahaan/departemen/:slug"
                element={<DepartemenPage />}
              />
              <Route
                path="/perusahaan/penugasan/:slug"
                element={<PenugasanPage />}
              />
              <Route
                path="/perusahaan/pegawai/:slug"
                element={<PegawaiPage />}
              />
              <Route
                path="/perusahaan/surat-penugasan/:slug"
                element={<SuratPenugasanPage />}
              />
              <Route
                path="/perusahaan/master-template/:slug"
                element={<MasterTemplate />}
              />
              <Route
                path="/perusahaan/kalender/:pk"
                element={<KalenderPage />}
              />
            </>
          )}
          <Route
            path="/kepegawaian/pegawai/import-pegawai"
            element={<ImportPegawai />}
          />

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
