// DetailModal.js
import React from "react";
import { Button, Modal } from "@/components";

const DetailModal = ({ isOpen, detail, onClose }) => {
    if (!isOpen || !detail) return null;

    return (
        <Modal title="Penugasan Kehadiran" isOpen={isOpen} onClose={onClose}>
            <div className="p-4">
                <div className="mb-2">
                    <strong>Tanggal:</strong> {detail.tanggal}
                </div>
                <div className="mb-2">
                    <strong>Waktu Masuk:</strong> {detail.waktu_masuk || "-"}
                </div>
                <div className="mb-2">
                    <strong>Alamat Masuk:</strong> {detail.alamat_masuk}
                </div>
                <div className="mb-2">
                    <strong>Waktu Keluar:</strong> {detail.waktu_keluar || "-"}
                </div>
                <div className="mb-2">
                    <strong>Alamat Keluar:</strong> {detail.alamat_keluar}
                </div>
                <Button onClick={onClose} className="mt-4">
                    Close
                </Button>
            </div>
        </Modal >
    );
};

export default DetailModal;
