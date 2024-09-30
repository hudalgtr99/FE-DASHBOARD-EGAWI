import React from 'react';
import { Modal } from '@/components'; // Assuming you have a Modal component
import moment from 'moment';

const PenugasanDetail = ({ isOpen, onClose, detail }) => {
    const statuses = [
        { label: "Menunggu Persetujuan", value: 0, color: "bg-amber-500" },
        { label: "Proses", value: 1, color: "bg-blue-500" },
        { label: "Meminta Ulasan", value: 2, color: "bg-amber-500" },
        { label: "Selesai", value: 3, color: "bg-green-500" },
        { label: "Ditolak", value: 4, color: "bg-red-500" },
    ];

    const prioritases = [
        { value: "1", label: "Tinggi", color: "bg-red-500" },
        { value: "2", label: "Sedang", color: "bg-green-500" },
        { value: "3", label: "Rendah", color: "bg-blue-500" },
    ];

    if (!detail) return null;

    // Find the status label based on the numeric value
    const statusObject = statuses.find(status => status.value === detail.status);
    const statusLabel = statusObject ? statusObject.label : "Unknown Status";

    const prioritasObject = prioritases.find(prioritas => prioritas.value === detail.prioritas);
    const prioritasLabel = prioritasObject ? prioritasObject.label : "Unknown Prioritas";

    return (
        <Modal title="Penugasan Detail" isOpen={isOpen} onClose={onClose}>
            <div className="p-4">
                <div className='sm:grid sm:grid-cols-2 gap-4'>
                    <div className="flex">
                        <p><strong>Judul</strong></p>
                        <p className='mx-1'><strong>:</strong></p>
                        <p>{detail.judul}</p>
                    </div>
                    <div className="flex">
                        <p><strong>Pengirim</strong></p>
                        <p className='mx-1'><strong>:</strong></p>
                        <p>{detail.pengirim.nama}</p>
                    </div>
                    <div className="flex">
                        <p><strong>Penerima</strong></p>
                        <p className='mx-1'><strong>:</strong></p>
                        <p>{detail.penerima.map(p => p.nama).join(', ')}</p>
                    </div>
                    <div className="flex">
                        <p><strong>Prioritas</strong></p>
                        <p className='mx-1'><strong>:</strong></p>
                        <p className={`${prioritasObject?.color} px-1 rounded text-white`}>
                            {prioritasLabel}
                        </p>
                    </div>
                    <div className="flex">
                        <p><strong>Mulai</strong></p>
                        <p className='mx-1'><strong>:</strong></p>
                        <p>{moment(detail.start_date).format('D MMMM YYYY')}</p>
                    </div>
                    <div className="flex">
                        <p><strong>Selesai</strong></p>
                        <p className='mx-1'><strong>:</strong></p>
                        <p>{moment(detail.end_date).format('D MMMM YYYY')}</p>
                    </div>
                    <div className="flex">
                        <p><strong>Status</strong></p>
                        <p className='mx-1'><strong>:</strong></p>
                        <p className={`${statusObject?.color} px-1 rounded text-white`}>
                            {statusLabel}
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PenugasanDetail;
