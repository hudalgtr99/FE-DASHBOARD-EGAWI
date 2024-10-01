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
          <div className='flex'>
            <span>Nama:</span>
            <span className='ml-2'>{datapribadi.nama}</span>
          </div>
          <div className='flex'>
            <span>Username:</span>
            <span className='ml-2'>{datapribadi.username}</span>
          </div>
          <div className='flex'>
            <span>Email:</span>
            <span className='ml-2'>{datapribadi.email}</span>
          </div>
          <div className='flex'>
            <span>Jenis Kelamin:</span>
            <span className='ml-2'>{datapribadi.jenis_kelamin}</span>
          </div>
          <div className='flex'>
            <span>No Identitas:</span>
            <span className='ml-2'>{datapribadi.no_identitas}</span>
          </div>
          <div className='flex'>
            <span>NPWP:</span>
            <span className='ml-2'>{datapribadi.npwp}</span>
          </div>
          <div className='flex'>
            <span>Agama:</span>
            <span className='ml-2'>{datapribadi.agama}</span>
          </div>
          <div className='flex'>
            <span>Alamat KTP:</span>
            <span className='ml-2'>{datapribadi.alamat_ktp}</span>
          </div>
          <div className='flex'>
            <span>Alamat Domisili:</span>
            <span className='ml-2'>{datapribadi.alamat_domisili}</span>
          </div>
          <div className='flex'>
            <span>No Telepon:</span>
            <span className='ml-2'>{datapribadi.no_telepon}</span>
          </div>
          <div className='flex'>
            <span>Tempat Lahir:</span>
            <span className='ml-2'>{datapribadi.tempat_lahir}</span>
          </div>
          <div className='flex'>
            <span>Tanggal Lahir:</span>
            <span className='ml-2'>{new Date(datapribadi.tgl_lahir).toLocaleDateString()}</span>
          </div>
          <div className='flex'>
            <span>Cabang:</span>
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
          <div className='flex'>
            <span>Pangkat:</span>
            <span className='ml-2'>{datapegawai?.pangkat?.nama || '-'}</span>
          </div>
          <div className='flex'>
            <span>Jabatan:</span>
            <span className='ml-2'>{datapegawai?.jabatan?.nama || '-'}</span>
          </div>
          <div className='flex'>
            <span>Departemen:</span>
            <span className='ml-2'>{datapegawai?.departemen?.nama || '-'}</span>
          </div>
          <div className='flex'>
            <span>Divisi:</span>
            <span className='ml-2'>{datapegawai?.divisi?.nama || '-'}</span>
          </div>
          <div className='flex'>
            <span>Unit:</span>
            <span className='ml-2'>{datapegawai?.unit?.nama || '-'}</span>
          </div>
          <div className='flex'>
            <span>Tanggal Bergabung:</span>
            <span className='ml-2'>{datapegawai?.tgl_bergabung || '-'}</span>
          </div>
          <div className='flex'>
            <span>Tanggal Resign:</span>
            <span className='ml-2'>{datapegawai?.tgl_resign || '-'}</span>
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
          <div className='flex'>
            <span>Nama Ayah:</span>
            <span className='ml-2'>{datakeluarga?.nama_ayah || '-'}</span>
          </div>
          <div className='flex'>
            <span>Nama Ibu:</span>
            <span className='ml-2'>{datakeluarga?.nama_ibu || '-'}</span>
          </div>
          <div className='flex'>
            <span>Status Pernikahan:</span>
            <span className='ml-2'>{datakeluarga?.status_pernikahan || '-'}</span>
          </div>
          <div className='flex'>
            <span>Nama Pasangan:</span>
            <span className='ml-2'>{datakeluarga?.nama_pasangan || '-'}</span>
          </div>
          <div className='flex'>
            <span>Jumlah Anak:</span>
            <span className='ml-2'>{datakeluarga?.anak || '-'}</span>
          </div>
          <div className='flex'>
            <span>Nama Kontak Darurat:</span>
            <span className='ml-2'>{datakeluarga?.nama_kontak_emergency || '-'}</span>
          </div>
          <div className='flex'>
            <span>Nomor Kontak Darurat:</span>
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
        <div className='font-semibold mb-4'>Pendidikan Formal</div>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4'>
          <div className='flex'>
            <span>Asal Sekolah:</span>
            <span className='ml-2'>{datapendidikan?.asal_sekolah || '-'}</span>
          </div>
          <div className='flex'>
            <span>Masa Waktu:</span>
            <span className='ml-2'>{datapendidikan?.masa_waktu || '-'}</span>
          </div>
          <div className='flex'>
            <span>Keterangan Pendidikan:</span>
            <span className='ml-2'>{datapendidikan?.keterangan_pendidikan || '-'}</span>
          </div>
        </div>

        <div className='font-semibold mb-4'>Pendidikan Non Formal</div>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div className='flex'>
            <span>Asal Lembaga:</span>
            <span className='ml-2'>{datapendidikan?.nama_lembaga || '-'}</span>
          </div>
          <div className='flex'>
            <span>Tahun Lulus:</span>
            <span className='ml-2'>{datapendidikan?.tahun_lulus || '-'}</span>
          </div>
          <div className='flex'>
            <span>Sertifikat:</span>
            <span className='ml-2'>{datapendidikan?.sertifikat || '-'}</span>
          </div>
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
        <div className='flex'>
          <span>Input data lainnya:</span>
          <span className='ml-2'>{datalainnya?.data_lainnya || '-'}</span>
        </div>
      </Container>
    </div>
  );
};

export default PengaturanProfilSub;
