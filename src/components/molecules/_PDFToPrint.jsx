import React, { useEffect, useState, useRef, useCallback } from "react";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import axiosAPI from "@/authentication/axiosApi";
import { CKEditor } from "ckeditor4-react";
import { API_URL_getalltemplatesurattugas } from "@/constants";
import { Checkbox } from "@/components";

export default function CKEditorInput({
  values = "",
  type,
  noSurat = "",
  isEdit = false,
  pemohon = {
    value: "",
    label: "",
    jabatan: "",
  },
  penerima = [],
  user = {},
}) {
  const [editorKey, setEditorKey] = useState(null);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEditor, setLoadingEditor] = useState(true);
  const [template, setTemplate] = useState([]);

  const [showJabatan, setShowJabatan] = useState(false);
  const [showDepartement, setShowDepartement] = useState(false);
  const [showDivisi, setShowDivisi] = useState(false);
  const [showUnit, setShowUnit] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(
      "ckeditor",
      `
        <div style="padding: 1.5rem; padding-top: 3rem; padding-bottom: 2.5rem; padding-left: 6rem; padding-right: 6rem; display: flex; flex-wrap: wrap; flex-direction: column;">
          <header contenteditable="false" style="display: flex; justify-content: flex-start; align-items: center; gap: 2.5rem; margin-bottom: 1.25rem;">
            <div>
              <img alt="Logo QNN" src="/images/icons/qnn.png" style="width: 11rem;" />
            </div>
            <div style="width: fit-content; text-align: center;">
              <h1 style="font-size: 1.5rem; color: #EF4444; font-weight: bold; white-space: nowrap;">
                PT. QUEEN <span style="color: #1D4ED8;">NETWORK</span> NUSANTARA
              </h1>
              <div style="font-size: .885rem; font-family: 'Tinos', serif;">
                <p>Jalan Alam Gaya Nomor 42 BTN II, Way Halim Permai</p>
                <p>Kota Bandar Lampung - Lampung Kode Pos 35133</p>
                <p>Telepon: (0721) 5615819, Website: www.qnn.co.id</p>
              </div>
            </div>
          </header>
          <hr contenteditable="false" style="border-top: 2px solid #1E293B; margin-bottom: 1rem; width: 100%;" />
          <br>
          <div contenteditable="true">
            ${values}
          </div>
        </div>
      `
    );
  }, []);

  const handleEditorChange = (event) => {
    const newHtml = event.editor.getData();
    setHtml(newHtml); // Update the state with the new HTML
    sessionStorage.setItem("ckeditor", newHtml);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosAPI.get(API_URL_getalltemplatesurattugas);
      setTemplate(response.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (type) {
      const matchedTemplate = template.find((t) => t.id === type);
      let htmlContent = "";
      if (matchedTemplate) {
        htmlContent = matchedTemplate.isi // Mengganti {no_surat} dengan nilai dari noSurat
          // .replace(
          //   /style=["'][^"']*color\s*:\s*[^"']*;?[^"']*["']/g,
          //   (match) => {
          //     return match.replace(/color\s*:\s*[^;]*;?/g, ""); // Menghapus 'color' beserta nilainya dari style
          //   }
          // )
          .replace(/\{no_surat\}/g, noSurat || "")
          .replace(
            /\{nama_pemohon\}/g,
            pemohon.label
              .split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ") || "tidak ada pemohon"
          )
          .replace(
            /\{jabatan_pemohon\}/g,
            pemohon.jabatan || "tidak ada jabatan"
          )
          .replace(
            /\{nama_penerima\}/g,
            penerima
              .map((item) =>
                item.label
                  .split(" ")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ")
              )
              .join(", ") || "tidak ada penerima"
          )
          .replace(
            /\{jabatan_penerima\}/g,
            penerima.map((item) => item.jabatan).join(", ") ||
              "tidak ada jabatan"
          )
          .replace(
            /\{format_date\}/g,
            new Date().toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }) || ""
          )
          .replace(
            /\{nama_perusahaan\}/g,
            user?.perusahaan
              ? user.perusahaan.nama.toUpperCase() || ""
              : "QUEEN NETWORK NUSANTARA"
          )
          .replace(
            /\{nama_kota\}/g,
            user?.perusahaan
              ? user.perusahaan.lokasi
                  .replace("Kota ", "")
                  .split(" ")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ") || ""
              : "Bandar Lampung"
          );
        try {
          setHtml(htmlContent);
          setEditorKey(htmlContent);
          setLoadingEditor(false);
        } catch (error) {
          console.error("Error setting template HTML:", error);
        }
      }
    } else {
      const headerTemplate = `
        <div style="padding: 1.5rem; padding-top: 3rem; padding-bottom: 2.5rem; padding-left: 6rem; padding-right: 6rem; display: flex; flex-wrap: wrap; flex-direction: column;">
          <header contenteditable="false" style="display: flex; justify-content: flex-start; align-items: center; gap: 2.5rem; margin-bottom: 1.25rem;">
            <div>
              <img alt="Logo QNN" src="/images/icons/qnn.png" style="width: 11rem;" />
            </div>
            <div style="width: fit-content; text-align: center;">
              <h1 style="font-size: 1.5rem; color: #EF4444; font-weight: bold; white-space: nowrap;">
                PT. QUEEN <span style="color: #1D4ED8;">NETWORK</span> NUSANTARA
              </h1>
              <div style="font-size: .885rem; font-family: 'Tinos', serif;">
                <p>Jalan Alam Gaya Nomor 42 BTN II, Way Halim Permai</p>
                <p>Kota Bandar Lampung - Lampung Kode Pos 35133</p>
                <p>Telepon: (0721) 5615819, Website: www.qnn.co.id</p>
              </div>
            </div>
          </header>
          <hr contenteditable="false" style="border-top: 2px solid #1E293B; margin-bottom: 1rem; width: 100%;" />
          <br>
          <div contenteditable="true">
            ${values}
          </div>
        </div>
      `;

      const newHtml = isEdit ? values : headerTemplate;
      setHtml(newHtml);
      setLoadingEditor(false);
    }
  }, [values, template, type, isEdit, noSurat, penerima, user]);

  useEffect(() => {
    let htmlChanged = html;

    if (showJabatan) {
      htmlChanged = htmlChanged.replace(
        /(id="jabatan".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
    } else {
      htmlChanged = htmlChanged.replace(
        /(id="jabatan".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
    }

    if (showDepartement) {
      htmlChanged = htmlChanged.replace(
        /(id="departement".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
    } else {
      htmlChanged = htmlChanged.replace(
        /(id="departement".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
    }

    if (showDivisi) {
      htmlChanged = htmlChanged.replace(
        /(id="divisi".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
    } else {
      htmlChanged = htmlChanged.replace(
        /(id="divisi".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
    }

    if (showUnit) {
      htmlChanged = htmlChanged.replace(
        /(id="unit".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
    } else {
      htmlChanged = htmlChanged.replace(
        /(id="unit".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
    }

    
    if (htmlChanged !== html) {
      setHtml(htmlChanged);
      setEditorKey(htmlChanged);
      sessionStorage.setItem("ckeditor", htmlChanged);
    }
  }, [html, showJabatan, showDepartement, showDivisi, showUnit]);

  return (
    <>
      <div className="w-1/2">
        <label
          style={{
            fontSize: "14px",
          }}
          className={`mb-1 font-[400]`}
        >
          Organizations
        </label>
        <div className="grid grid-cols-2 gap-1">
          <Checkbox
            label="Show Jabatan"
            checked={showJabatan}
            onChange={() => setShowJabatan(!showJabatan)}
          />
          <Checkbox
            label="Show Departement"
            checked={showDepartement}
            onChange={() => setShowDepartement(!showDepartement)}
          />
          <Checkbox
            label="Show Divisi"
            checked={showDivisi}
            onChange={() => setShowDivisi(!showDivisi)}
          />
          <Checkbox
            label="Show Unit"
            checked={showUnit}
            onChange={() => setShowUnit(!showUnit)}
          />
        </div>
      </div>
      {!loadingEditor && (
        <>
          <CKEditor
            key={editorKey}
            onAriaEditorHelpLabel={"Help"}
            style={{ fontFamily: "Tinos" }}
            initData={html}
            onChange={handleEditorChange}
            config={{
              allowedContent: true,
              contentsCss: [
                "input, textarea { margin: 0; padding: 0; border: none; }",
                "ul { margin: 0; padding-left: 0; }",
                "li { margin: 0; padding-left: 0; }",
              ],
              extraPlugins: "justify,colorbutton",
              colorButton_colors:
                "1d4ed8,000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969," +
                "B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080," +
                "F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9," +
                "FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3," +
                "FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF",
              colorButton_enableMore: false,
            }}
          />
        </>
      )}
    </>
  );
}

