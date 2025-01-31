import { Button, Slip } from "@/components";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const SlipGaji = () => {
  const ref = useRef();

  const [slip] = useState({
    id: 1,
    pegawai: {
      id: 47,
      name: "Ayu Fitriani",
      id_pegawai: "92093093039",
      address: "Desain Grafis / Staff",
      tgl_masuk: "16 Januari 2020",
      periode_gaji: "Desember 2024",
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

  const handlePrint = useReactToPrint({
    content: () => ref.current,
    documentTitle: `Slip Gaji ${slip.pegawai.name} Periode ${slip.pegawai.periode_gaji}`, // Set the document title directly
  });

  const [company] = useState({
    name: "PT. Queen Network Nusantara",
    address:
      "Jl. Alam Gaya No. 42 BTN II Way Halim Permai Bandar Lampung, Lampung 35135",
  });

  return (
    <div>
      <div className="shadow-lg rounded-lg bg-white dark:bg-base-600 overflow-hidden">
        <div className="pt-3 flex items-start justify-start mb-1 px-6 md:px-10">
          <Button size="xs" onClick={handlePrint}>
            Print
          </Button>
        </div>
        <Slip ref={ref} data={slip} company={company} />
      </div>
    </div>
  );
};

export default SlipGaji;
