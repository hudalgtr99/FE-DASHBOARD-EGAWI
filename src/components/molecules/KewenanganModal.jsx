import React from "react";
import Button from "../atoms/Button";
import Modal from "../atoms/Modal";

const KewenanganModal = ({ showModal, setShowModal }) => {
  return (
    <Modal
      show={showModal}
      setShow={setShowModal}
      width="md"
      btnClose={true}
      persistent={false}
    >
      <div className="text-lg font-normal p-5">
        <div className="mb-3 font-semibold text-center text-xl">
          Informasi Tingkat Kewenangan
        </div>
        <div className="mb-4">
          <p className="mb-2">
            Berikut adalah detail tingkat kewenangan dalam jabatan:
          </p>
          <ul className="list-disc list-inside">
            <li className="mb-4">
              <strong>Tingkat 1: Penuh</strong> - Memiliki kewenangan penuh
              dalam pengambilan keputusan strategis. Posisi ini biasanya
              dipegang oleh eksekutif seperti Direktur, yang bertanggung jawab
              atas keseluruhan arah dan kebijakan perusahaan.
            </li>
            <li className="mb-4">
              <strong>Tingkat 2: Tinggi</strong> - Memiliki kewenangan tinggi,
              tetapi masih dalam batasan tertentu. Posisi ini biasanya dipegang
              oleh Komisaris, yang memiliki tanggung jawab untuk mengawasi tim
              dan memastikan bahwa tujuan departemen tercapai.
            </li>
            <li className="mb-4">
              <strong>Tingkat 3: Menengah</strong> - Memiliki kewenangan yang
              terbatas dan biasanya di bawah pengawasan. Posisi ini mencakup
              Manajer atau Kepala Departemen, yang bertanggung jawab untuk
              melaksanakan rencana yang telah ditetapkan oleh tingkat yang lebih
              tinggi.
            </li>
            <li className="mb-4">
              <strong>Tingkat 4: Dasar</strong> - Kewenangan minimal, biasanya
              untuk posisi entry-level seperti Staff Magang atau Staff Junior.
              Posisi ini lebih fokus pada pelaksanaan tugas sehari-hari dan
              belajar dari pengalaman.
            </li>
          </ul>
        </div>
        <div className="flex flex-row justify-end gap-5 mt-4">
          <Button color="base" onClick={() => setShowModal(false)}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default KewenanganModal;
