// DetailModal.js
import React from "react";
import { Button } from "@/components";

const DetailModal = ({ isOpen, detail, onClose }) => {
    if (!isOpen || !detail) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg shadow-lg w-11/12 max-w-lg">
                <h2 className="text-lg font-semibold mb-2">Detail Kehadiran</h2>
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
        </div>
    );
};

export default DetailModal;
