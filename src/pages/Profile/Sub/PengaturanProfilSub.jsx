import React, { useCallback, useEffect, useState } from "react";
import { Container } from "@/components";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { fetchUserDetails } from "@/constants/user";
import { jwtDecode } from "jwt-decode";
import { FileInput, PulseLoading, TextField } from "../../../components";
import { BsPencil } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";

const PengaturanProfilSub = () => {
  const [data, setData] = useState(null);
  const [auth, setAuth] = useState({});
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = isAuthenticated();
    if (token) {
      setAuth(jwtDecode(token));
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (auth?.user_id) {
      try {
        setLoading(true);
        const response = await fetchUserDetails();
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [auth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <PulseLoading />
      </div>
    );
  }

  const {
    datapribadi,
    datapegawai,
    datakeluarga,
    datapendidikan,
    datalainnya,
  } = data || {};

  const formalEducation = JSON.parse(datapendidikan?.formal || "[]");
  const nonFormalEducation = JSON.parse(datapendidikan?.non_formal || "[]");
  const datalainnyaNew = JSON.parse(datalainnya?.data || "[]");

  return (
    <div className="flex flex-col gap-4 lg:w-full">
      <Container>
        <InputWrapper title="Data Pribadi">
          <InputProfile title="Nama">{datapribadi?.nama || "-"}</InputProfile>
          <InputProfile title="Email">{datapribadi?.email || "-"}</InputProfile>
          <InputProfile title="Jenis Kelamin">
            {datapribadi?.jenis_kelamin || "-"}
          </InputProfile>
          <InputProfile title="No Identitas">
            {datapribadi?.no_identitas || "-"}
          </InputProfile>
          <InputProfile title="NPWP">{datapribadi?.npwp || "-"}</InputProfile>
          <InputProfile title="Agama">{datapribadi?.agama || "-"}</InputProfile>
          <InputProfile title="Alamat KTP">
            {datapribadi?.alamat_ktp || "-"}
          </InputProfile>
          <InputProfile title="Alamat Domisili">
            {datapribadi?.alamat_domisili || "-"}
          </InputProfile>
          <InputProfile title="No Telepon">
            {datapribadi?.no_telepon || "-"}
          </InputProfile>
          <InputProfile title="Tempat Lahir">
            {datapribadi?.tempat_lahir || "-"}
          </InputProfile>
          <InputProfile title="Tanggal Lahir">
            {datapribadi?.tgl_lahir
              ? new Date(datapribadi.tgl_lahir).toLocaleDateString()
              : "-"}
          </InputProfile>
          <InputProfile title="Perusahaan">
            {datapribadi?.perusahaan?.nama || "-"}
          </InputProfile>
        </InputWrapper>
      </Container>

      {/* Data Pegawai Section */}
      <Container>
        <InputWrapper title="Data Pegawai" onTab={"1"}>
          <InputProfile title="Jabatan">
            {datapegawai?.jabatan?.nama || "-"}
          </InputProfile>
          <InputProfile title="Departemen">
            {datapegawai?.departemen?.nama || "-"}
          </InputProfile>
          <InputProfile title="Divisi">
            {datapegawai?.divisi?.nama || "-"}
          </InputProfile>
          <InputProfile title="Unit">
            {datapegawai?.unit?.nama || "-"}
          </InputProfile>
          <InputProfile title="Tanggal Bergabung">
            {datapegawai?.tgl_bergabung
              ? new Date(datapegawai.tgl_bergabung).toLocaleDateString()
              : "-"}
          </InputProfile>
          <InputProfile title="Tanggal Resign">
            {datapegawai?.tgl_resign
              ? new Date(datapegawai.tgl_resign).toLocaleDateString()
              : "-"}
          </InputProfile>
        </InputWrapper>
      </Container>

      {/* Data Keluarga Section */}
      <Container>
        <InputWrapper title="Data Keluarga" onTab={"2"}>
          <InputProfile title="Nama Ayah">
            {datakeluarga?.nama_ayah || "-"}
          </InputProfile>
          <InputProfile title="Nama Ibu">
            {datakeluarga?.nama_ibu || "-"}
          </InputProfile>
          <InputProfile title="Status Pernikahan">
            {datakeluarga?.status_pernikahan || "-"}
          </InputProfile>
          <InputProfile title="Nama Pasangan">
            {datakeluarga?.nama_pasangan || "-"}
          </InputProfile>
          <InputProfile title="Jumlah Anak">
            {datakeluarga?.anak || "-"}
          </InputProfile>
          <InputProfile title="Nama Kontak Darurat">
            {datakeluarga?.nama_kontak_emergency || "-"}
          </InputProfile>
          <InputProfile title="Nomor Kontak Darurat">
            {datakeluarga?.no_telepon_emergency || "-"}
          </InputProfile>
        </InputWrapper>
      </Container>

      {/* Pendidikan Formal Section */}
      <Container>
        <InputWrapper title="Pendidikan Formal" onTab={"3"}>
          {formalEducation && formalEducation.length > 0 ? (
            formalEducation.map((item, index) => (
              <div key={index} className="flex flex-col gap-4">
                <InputProfile title="Asal Sekolah">
                  {item.asal_sekolah || "-"}
                </InputProfile>
                <InputProfile title="Masa Waktu">
                  {item.masa_waktu || "-"}
                </InputProfile>
                <InputProfile title="Keterangan Pendidikan">
                  {item.keterangan_pendidikan || "-"}
                </InputProfile>
              </div>
            ))
          ) : (
            <p className="text-start">Tidak ada data</p>
          )}
        </InputWrapper>
      </Container>

      {/* Pendidikan Non-Formal Section */}
      <Container>
        <InputWrapper title="Pendidikan Non-Formal" onTab={"3"}>
          {nonFormalEducation && nonFormalEducation.length > 0 ? (
            nonFormalEducation.map((item, index) => (
              <div key={index} className="flex flex-col gap-4">
                <InputProfile title={`Asal Lembaga ke ${index + 1}`}>
                  {item.nama_lembaga || "-"}
                </InputProfile>
                <InputProfile title={`Tahun Lulus ke ${index + 1}`}>
                  {item.tahun_lulus || "-"}
                </InputProfile>
                <div className="flex items-center w-full gap-2">
                  <p className="w-[40%] md:w-3/6 text-left capitalize text-sm">
                    Sertifikat ke {index + 1}
                  </p>
                  <FileInput
                    height={100}
                    accept={{ "image/jpeg": [], "image/png": [] }}
                    disabled={true}
                    maxFiles={1}
                    minSize={0}
                    maxSize={2097152} // 2 MB
                    multiple={false}
                    value={[item.sertifikat] || "-"}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-start">Tidak ada data</p>
          )}
        </InputWrapper>
      </Container>

      {/* datalainnya Section */}
      <Container>
        <InputWrapper title="Data lainnya" onTab={"4"}>
          {datalainnyaNew && datalainnyaNew.length > 0 ? (
            datalainnyaNew.map((item, index) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="flex items-center w-full gap-2">
                  <p className="w-[40%] md:w-3/6 text-left capitalize text-sm">
                    Data ke {index + 1}
                  </p>
                  <FileInput
                    height={100}
                    accept={{ "image/jpeg": [], "image/png": [] }}
                    disabled={true}
                    maxFiles={1}
                    minSize={0}
                    maxSize={2097152} // 2 MB
                    multiple={false}
                    value={[item.data] || "-"}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-start">Tidak ada data</p>
          )}
        </InputWrapper>
      </Container>
    </div>
  );

  function InputWrapper({ children, title, onTab = null }) {
    return (
      <>
        <div className="flex flex-row justify-between items-center">
          <p className="text-base font-semibold">{title}</p>
          {data?.groups[0]?.name !== "Super Admin" && (
            <Link
              to={`/kepegawaian/pegawai/form/${data?.datapribadi?.no_identitas}`}
              state={{ activeTab: onTab }}
              onClick={() => {
                localStorage.setItem("editUserData", JSON.stringify(data));
                sessionStorage.setItem("url", location.pathname);
                sessionStorage.setItem("activeTab", "1");
              }}
            >
              <BsPencil className="text-green-500" />
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-4 justify-between w-full">
          {children}
        </div>
      </>
    );
  }

  function InputProfile({ children, title }) {
    return (
      <div className="flex items-center w-full gap-2">
        <p className="w-[40%] md:w-3/6 text-left capitalize text-sm">{title}</p>
        <TextField
          required
          name={children}
          value={`${children || ""}`}
          onBlur={(e) => formik.handleBlur}
          disabled
        />
      </div>
    );
  }
};

export default PengaturanProfilSub;
