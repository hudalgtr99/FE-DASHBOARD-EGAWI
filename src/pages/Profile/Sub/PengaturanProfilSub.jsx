import React, { useCallback, useEffect, useState } from 'react';
import { Container } from "@/components";
import { isAuthenticated } from "@/authentication/authenticationApi";
import axiosAPI from "@/authentication/axiosApi";
import { API_URL_getakun } from "@/constants";
import { BsPencil } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const PengaturanProfilSub = () => {
  const [data, setData] = useState(null); // State to store fetched data

  const fetchData = useCallback(async () => {
    try {
      const response = await axiosAPI.get(
        `${API_URL_getakun}${isAuthenticated().user_id}`
      );
      setData(response.data[0]); // Assuming the response is an array, get the first object
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!data) {
    return <div>Loading...</div>; // Loading state
  }

  const {
    datapribadi,
    datapegawai,
    datakeluarga,
    datapendidikan,
    datalainnya,
  } = data;

  const formalEducation = JSON.parse(datapendidikan?.formal || '[]');
  const nonFormalEducation = JSON.parse(datapendidikan?.non_formal || '[]');

  return (
    <div className='space-y-4'>
      <Container>
        <div className='flex justify-between'>
          <div className='font-semibold mb-4'>Data Pribadi</div>
          <div className='text-green-500'>
            <Link
              to="/profile/pribadi"
              state={{ data: datapribadi }}  // Pass "state" directly
            >
              <BsPencil />
            </Link>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Nama:</span>
            <span className='ml-2'>{datapribadi.nama}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Username:</span>
            <span className='ml-2'>{datapribadi.username}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Email:</span>
            <span className='ml-2'>{datapribadi.email}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Jenis Kelamin:</span>
            <span className='ml-2'>{datapribadi.jenis_kelamin}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>No Identitas:</span>
            <span className='ml-2'>{datapribadi.no_identitas}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>NPWP:</span>
            <span className='ml-2'>{datapribadi.npwp}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Agama:</span>
            <span className='ml-2'>{datapribadi.agama}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Alamat KTP:</span>
            <span className='ml-2'>{datapribadi.alamat_ktp}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Alamat Domisili:</span>
            <span className='ml-2'>{datapribadi.alamat_domisili}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>No Telepon:</span>
            <span className='ml-2'>{datapribadi.no_telepon}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Tempat Lahir:</span>
            <span className='ml-2'>{datapribadi.tempat_lahir}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Tanggal Lahir:</span>
            <span className='ml-2'>{new Date(datapribadi.tgl_lahir).toLocaleDateString()}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Cabang:</span>
            <span className='ml-2'>{datapribadi.cabang?.nama}</span>
          </div>
        </div>
      </Container>

      <Container>
        <div className='flex justify-between'>
          <div className='font-semibold mb-4'>Data Pegawai</div>
          <div className='text-green-500'>
            <Link to={'/profile/pegawai'}>
              <BsPencil />
            </Link>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Pangkat:</span>
            <span className='ml-2'>{datapegawai?.pangkat?.nama || '-'}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Jabatan:</span>
            <span className='ml-2'>{datapegawai?.jabatan?.nama || '-'}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Departemen:</span>
            <span className='ml-2'>{datapegawai?.departemen?.nama || '-'}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Divisi:</span>
            <span className='ml-2'>{datapegawai?.divisi?.nama || '-'}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Unit:</span>
            <span className='ml-2'>{datapegawai?.unit?.nama || '-'}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Tanggal Bergabung:</span>
            <span className='ml-2'>{new Date(datapegawai?.tgl_bergabung).toLocaleDateString() || '-'}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Tanggal Resign:</span>
            <span className='ml-2'>{new Date(datapegawai?.tgl_resign).toLocaleDateString() || '-'}</span>
          </div>
        </div>
      </Container>

      <Container>
        <div className='flex justify-between'>
          <div className='font-semibold mb-4'>Data Keluarga</div>
          <div className='text-green-500'>
            <Link to={'/profile/keluarga'}>
              <BsPencil />
            </Link>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Nama Ayah:</span>
            <span className='ml-2'>{datakeluarga?.nama_ayah || '-'}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Nama Ibu:</span>
            <span className='ml-2'>{datakeluarga?.nama_ibu || '-'}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Status Pernikahan:</span>
            <span className='ml-2'>{datakeluarga?.status_pernikahan || '-'}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Nama Pasangan:</span>
            <span className='ml-2'>{datakeluarga?.nama_pasangan || '-'}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Jumlah Anak:</span>
            <span className='ml-2'>{datakeluarga?.anak || '-'}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Nama Kontak Darurat:</span>
            <span className='ml-2'>{datakeluarga?.nama_kontak_emergency || '-'}</span>
          </div>
          <div className='flex bg-gray-100 p-2 rounded-lg'>
            <span className='font-medium'>Nomor Kontak Darurat:</span>
            <span className='ml-2'>{datakeluarga?.no_telepon_emergency || '-'}</span>
          </div>
        </div>
      </Container>

      <Container>
        <div className='flex justify-between'>
          <div className='font-semibold mb-4'>Data Pendidikan</div>
          <div className='text-green-500'>
            <Link to={'/profile/pendidikan'}>
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
                <span className="ml-2">{item.asal_sekolah || '-'}</span>
              </div>
              <div className="flex bg-gray-100 p-2 rounded-lg">
                <span className="font-medium">Masa Waktu:</span>
                <span className="ml-2">{item.masa_waktu || '-'}</span>
              </div>
              <div className="flex bg-gray-100 p-2 rounded-lg">
                <span className="font-medium">Keterangan Pendidikan:</span>
                <span className="ml-2">{item.keterangan_pendidikan || '-'}</span>
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
                <span className="ml-2">{item.nama_lembaga || '-'}</span>
              </div>
              <div className="flex bg-gray-100 p-2 rounded-lg">
                <span className="font-medium">Tahun Lulus:</span>
                <span className="ml-2">{item.tahun_lulus || '-'}</span>
              </div>
              <div className="flex bg-gray-100 p-2 rounded-lg">
                <span className="font-medium">Sertifikat:</span>
                <span className="ml-2">{item.sertifikat || '-'}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </Container>

      <Container>
        <div className='flex justify-between'>
          <div className='font-semibold mb-4'>Data Lainnya</div>
          <div className='text-green-500'>
            <Link to={'/profile/lainnya'}>
              <BsPencil />
            </Link>
          </div>
        </div>
        <div className='flex bg-gray-100 p-2 rounded-lg'>
          <span className='font-medium'>Input data lainnya:</span>
          <span className='ml-2'>{datalainnya?.data_lainnya || '-'}</span>
        </div>
      </Container>
    </div>
  );
};

export default PengaturanProfilSub;
