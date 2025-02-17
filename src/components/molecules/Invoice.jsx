import React, {useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdReturnLeft } from "react-icons/io";
import { Container} from "@/components";

const Invoice = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  
  const componentRef = useRef(); // Create a ref for printing

  const isEdit = pk && pk !== "add";

  const [html, setHtml] = useState(
    `<div style="padding: 1.5rem; padding-top: 2.5rem; padding-bottom: 2.5rem; padding-left: 6rem; padding-right: 6rem; display: flex; flex-wrap: wrap; flex-direction: column;">
     
        <header style="display: flex; justify-content: flex-start; align-items: center; gap: 2.5rem; margin-bottom: 1.25rem;" contentEditable="false">
            <div>
                <img style="width: 11rem;" src="/images/icons/qnn.png" alt="Logo QNN" />
            </div>
            <div style="width: fit-content; text-align: center;">
                <h1 style="font-size: 1.5rem; color: #EF4444; font-weight: bold; white-space: nowrap;">
                    PT. QUEEN <span style="color: #1D4ED8;">NETWORK</span> NUSANTARA
                </h1>
                <address style="font-size: 0.875rem; font-family: 'Tinos', serif;">
                    <p style="white-space: nowrap;">Jalan Alam Gaya Nomor 42 BTN II, Way Halim Permai</p>
                    <p>Kota Bandar Lampung - Lampung Kode Pos 35133</p>
                    <p>Telepon: (0721) 5615819, Website: www.qnn.co.id</p>
                </address>
            </div>
        </header>

        <hr style="border-top: 2px solid #6B7280; margin-bottom: 1rem;" contentEditable="false" />

        <section style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="width: fit-content;">
                <h2 style="font-size: 1.25rem; font-family: 'Tinos', serif; color: #1E293B; font-weight: bold; margin-bottom: -0.25rem;">SURAT KETERANGAN KERJA</h2>
                <hr style="border-top: 1px solid #1E293B; margin-bottom: 0.5rem;" />
            </div>
            <p style="font-family: 'Tinos', serif; font-weight: bold;">No: 01/02/QNN-NOC/11/2024</p>
        </section>

        <div style="margin: 2.25rem 0;">
            <ul style="display: flex; flex-direction: column; gap: 0.75rem; font-family: 'Tinos', serif;">
                <li>Saya yang bertanda tangan di bawah ini:</li>
                <li style="display: flex; width: 100%;">
                    <span style="font-variant-numeric: tabular-nums;">Nama</span>
                    <span style="margin-left: auto; width: 85%; text-transform: capitalize;">: nama orang</span>
                </li>
                <li style="display: flex; width: 100%;">
                    <span style="font-variant-numeric: tabular-nums;">Jabatan</span>
                    <span style="margin-left: auto; width: 85%;">: HRD</span>
                </li>
                <li>Dengan ini menerangkan bahwa:</li>
                <li style="display: flex; width: 100%;">
                    <span style="font-variant-numeric: tabular-nums;">Nama</span>
                    <span style="margin-left: auto; width: 85%; text-transform: capitalize;">
                        : nama orang 1, nama orang 2, nama orang 3
                    </span>
                </li>
                <li style="display: flex; width: 100%;">
                    <span style="font-variant-numeric: tabular-nums;">Alamat</span>
                    <span style="margin-left: auto; width: 85%;">
                        : Jalan Alam Gaya Way Halim Permai Kota Bandar Lampung
                    </span>
                </li>
                <li style="display: flex; width: 100%;">
                    <span style="font-variant-numeric: tabular-nums;">Jabatan</span>
                    <span style="margin-left: auto; width: 85%;">
                        : Staf teknis, staf administrasi, staf keuangan
                    </span>
                </li>
            </ul>
            <ul style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; font-family: 'Tinos', serif;">
                <li style="text-align: justify;">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis saepe architecto aperiam aut unde. Numquam quos at quo ad debitis reprehenderit aut sapiente fuga omnis. Reiciendis natus atque enim modi a eum, nostrum id saepe, tempora facilis aut doloremque ipsa.
                </li>
                <li style="text-align: justify;">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione ab explicabo, quas blanditiis quaerat rerum!
                </li>
            </ul>
        </div>

        <footer style="width: 100%; margin-top: 2rem; display: flex; flex-direction: column; align-items: flex-end; font-family: 'Tinos', serif;">
            <div style="text-align: end;">
                <p>Bandar Lampung, 31 September 2024</p>
                <p>PT. QUEEN NETWORK NUSANTARA</p>
                <div style="height: 7rem;"></div>
                <div style="text-align: center;">
                    <p>HRD</p>
                    <p>[Nama Penandatangan]</p>
                </div>
            </div>
        </footer>
    </div>`
  );

  function onChange(e) {
    setHtml(e.target.value);
  }

  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate("/surat-penugasan/master-template/slug/")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>{isEdit ? "Edit Surat" : "Tambah Surat"}</h1>
        </div>
        <div>
          <form onSubmit={() => null} className="space-y-6">
            
          </form>
        </div>
      </Container>
      {/* Content to print */}
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
};

export default Invoice;
