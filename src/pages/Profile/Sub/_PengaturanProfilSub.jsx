import React, { useCallback, useEffect, useState } from "react";
import { Container } from "@/components";
import { isAuthenticated } from "@/authentication/authenticationApi";
import axiosAPI from "@/authentication/axiosApi";
import { API_URL_getakun } from "@/constants";
import { BsPencil } from "react-icons/bs";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PengaturanProfilSub = () => {
	const [data, setData] = useState(null);
	const [auth, setAuth] = useState({});
	const [loading, setLoading] = useState(true); // State loading

	useEffect(() => {
		const token = isAuthenticated();
		if (token) {
			setAuth(jwtDecode(token));
		}
	}, []);

	const fetchData = useCallback(async () => {
		if (auth?.user_id) {
			try {
				setLoading(true); // Set loading state to true
				const response = await axiosAPI.get(`${API_URL_getakun}${28}`);
				setData(response.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false); // Set loading state to false
			}
		}
	}, [auth]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	if (loading) {
		return <div>Loading...</div>; // Loading state
	}

	const { datapribadi, datapegawai, datakeluarga, datapendidikan, datalainnya } = data || {};

	const formalEducation = JSON.parse(datapendidikan?.formal || "[]");
	const nonFormalEducation = JSON.parse(datapendidikan?.non_formal || "[]");

	return (
		<div className="space-y-4">
			<Container>
				<div className="flex justify-between">
					<div className="font-semibold mb-4">Data Pribadi</div>
					<div className="text-green-500">
						<Link
							to="/kepegawaian/data-pegawai/form"
							onClick={() => {
								sessionStorage.removeItem("activeTab");
								localStorage.setItem("editUserData", JSON.stringify(data));
							}}
						>
							<BsPencil />
						</Link>
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Nama:</span>
						<span className="ml-4">{datapribadi.nama}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Username:</span>
						<span className="ml-4">{datapribadi.username}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Email:</span>
						<span className="ml-4">{datapribadi.email}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Jenis Kelamin:</span>
						<span className="ml-4">{datapribadi.jenis_kelamin}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">No Identitas:</span>
						<span className="ml-4">{datapribadi.no_identitas}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">NPWP:</span>
						<span className="ml-4">{datapribadi.npwp}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Agama:</span>
						<span className="ml-4">{datapribadi.agama}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Alamat KTP:</span>
						<span className="ml-4">{datapribadi.alamat_ktp}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Alamat Domisili:</span>
						<span className="ml-4">{datapribadi.alamat_domisili}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">No Telepon:</span>
						<span className="ml-4">{datapribadi.no_telepon}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Tempat Lahir:</span>
						<span className="ml-4">{datapribadi.tempat_lahir}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Tanggal Lahir:</span>
						<span className="ml-4">{new Date(datapribadi.tgl_lahir).toLocaleDateString()}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">perusahaan:</span>
						<span className="ml-4">{datapribadi.perusahaan?.nama}</span>
					</div>
				</div>
			</Container>

			<Container>
				<div className="flex justify-between">
					<div className="font-semibold mb-4">Data Pegawai</div>
					<div className="text-green-500">
						<Link
							to={{
								pathname: "/kepegawaian/data-pegawai/form",
							}}
							onClick={() => {
								sessionStorage.setItem("activeTab", "1");
								localStorage.setItem("editUserData", JSON.stringify(data));
							}}
						>
							<BsPencil />
						</Link>
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Pangkat:</span>
						<span className="ml-4">{datapegawai?.pangkat?.nama || "-"}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Jabatan:</span>
						<span className="ml-4">{datapegawai?.jabatan?.nama || "-"}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Departemen:</span>
						<span className="ml-4">{datapegawai?.departemen?.nama || "-"}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Divisi:</span>
						<span className="ml-4">{datapegawai?.divisi?.nama || "-"}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Unit:</span>
						<span className="ml-4">{datapegawai?.unit?.nama || "-"}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Tanggal Bergabung:</span>
						<span className="ml-4">{new Date(datapegawai?.tgl_bergabung).toLocaleDateString() || "-"}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Tanggal Resign:</span>
						<span className="ml-4">{new Date(datapegawai?.tgl_resign).toLocaleDateString() || "-"}</span>
					</div>
				</div>
			</Container>

			<Container>
				<div className="flex justify-between">
					<div className="font-semibold mb-4">Data Keluarga</div>
					<div className="text-green-500">
						<Link
							to="/kepegawaian/data-pegawai/form"
							onClick={() => {
								sessionStorage.setItem("activeTab", "2");
								localStorage.setItem("editUserData", JSON.stringify(data));
							}} // Pass "state" directly
						>
							<BsPencil />
						</Link>
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Nama Ayah:</span>
						<span className="ml-4">{datakeluarga?.nama_ayah || "-"}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Nama Ibu:</span>
						<span className="ml-4">{datakeluarga?.nama_ibu || "-"}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Status Pernikahan:</span>
						<span className="ml-4">{datakeluarga?.status_pernikahan || "-"}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Nama Pasangan:</span>
						<span className="ml-4">{datakeluarga?.nama_pasangan || "-"}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Jumlah Anak:</span>
						<span className="ml-4">{datakeluarga?.anak || "-"}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Nama Kontak Darurat:</span>
						<span className="ml-4">{datakeluarga?.nama_kontak_emergency || "-"}</span>
					</div>
					<div className="flex bg-gray-100 p-2 rounded-lg">
						<span className="font-medium">Nomor Kontak Darurat:</span>
						<span className="ml-4">{datakeluarga?.no_telepon_emergency || "-"}</span>
					</div>
				</div>
			</Container>

			<Container>
				<div className="flex justify-between">
					<div className="font-semibold mb-4">Data Pendidikan</div>
					<div className="text-green-500">
						<Link
							to="/kepegawaian/data-pegawai/form"
							onClick={() => {
								sessionStorage.setItem("activeTab", "3");
								localStorage.setItem("editUserData", JSON.stringify(data));
							}} // Pass "state" directly
						>
							<BsPencil />
						</Link>
					</div>
				</div>
				<div className="font-semibold mb-4">Pendidikan Formal</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
					{formalEducation.map((item, index) => (
						<React.Fragment key={index}>
							<div className="flex bg-gray-100 p-2 rounded-lg">
								<span className="font-medium">Asal Sekolah:</span>
								<span className="ml-4">{item.asal_sekolah || "-"}</span>
							</div>
							<div className="flex bg-gray-100 p-2 rounded-lg">
								<span className="font-medium">Masa Waktu:</span>
								<span className="ml-4">{item.masa_waktu || "-"}</span>
							</div>
							<div className="flex bg-gray-100 p-2 rounded-lg">
								<span className="font-medium">Keterangan Pendidikan:</span>
								<span className="ml-4">{item.keterangan_pendidikan || "-"}</span>
							</div>
						</React.Fragment>
					))}
				</div>

				<div className="font-semibold mb-4">Pendidikan Non Formal</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					{nonFormalEducation.map((item, index) => (
						<React.Fragment key={index}>
							<div className="flex bg-gray-100 p-2 rounded-lg">
								<span className="font-medium">Asal Lembaga:</span>
								<span className="ml-4">{item.nama_lembaga || "-"}</span>
							</div>
							<div className="flex bg-gray-100 p-2 rounded-lg">
								<span className="font-medium">Tahun Lulus:</span>
								<span className="ml-4">{item.tahun_lulus || "-"}</span>
							</div>
							<div className="flex bg-gray-100 p-2 rounded-lg">
								<span className="font-medium">Sertifikat:</span>
								<span className="ml-4">{item.sertifikat || "-"}</span>
							</div>
						</React.Fragment>
					))}
				</div>
			</Container>

			<Container>
				<div className="flex justify-between">
					<div className="font-semibold mb-4">Data Lainnya</div>
					<div className="text-green-500">
						<Link
							to="/kepegawaian/data-pegawai/form"
							onClick={() => {
								sessionStorage.setItem("activeTab", "4");
								localStorage.setItem("editUserData", JSON.stringify(data));
							}} // Pass "state" directly
						>
							<BsPencil />
						</Link>
					</div>
				</div>
				<div className="flex bg-gray-100 p-2 rounded-lg">
					<span className="font-medium">Input data lainnya:</span>
					<span className="ml-4">{datalainnya?.data_lainnya || "-"}</span>
				</div>
			</Container>
		</div>
	);
};

export default PengaturanProfilSub;
