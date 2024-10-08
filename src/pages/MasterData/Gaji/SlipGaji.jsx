import { Button, Slip } from "@/components";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const SlipGaji = () => {
    const [selectedTemplate, setSelectedTemplate] = useState({
        value: 1,
        label: "Slip Gaji Karyawan",
    });
    const ref = useRef();
    const handlePrint = useReactToPrint({
        content: () => ref.current,
        documentTitle: selectedTemplate.label,
    });
    const [slip] = useState({
        id: 1,
        pegawai: {
            id: 47,
            name: "Ayu Fitriani",
            address: "Jl. Pulau Legundi gg family no 56",
            tgl_masuk: "1 Januari 2020",
            periode_gaji: "5 Desember 2023",
        },
        date: "20 November 2023",
        pendapatan: [
            {
                id: 1,
                name: "Gaji Pokok",
                price: 5000000,
            },
            {
                id: 2,
                name: "Tunjangan Kesehatan",
                price: 1000000,
            },
        ],
        potongan: [
            {
                id: 1,
                name: "Potongan Pajak",
                price: 500000,
            },
            {
                id: 2,
                name: "Potongan BPJS",
                price: 150000,
            },
        ],
    });
    const [company] = useState({
        name: "PT. Queen Network Nusantara",
        address:
            "Jl. Alam Gaya No. 42 BTN II Way Halim Permai Bandar Lampung, Lampung 35135",
    });

    return (
        <div>
            <div className="flex items-start justify-end mb-3">
                <Button onClick={handlePrint}>Print</Button>
            </div>
            <div className="shadow-lg rounded-lg bg-white dark:bg-base-600 overflow-hidden">
                <Slip
                    type={selectedTemplate.value}
                    data={slip}
                    company={company}
                    ref={ref}
                />
            </div>
        </div>
    );
};

export default SlipGaji;
