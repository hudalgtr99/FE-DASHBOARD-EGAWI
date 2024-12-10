import React, { useEffect, useState, useRef, useCallback } from "react";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import axiosAPI from "@/authentication/axiosApi";
import { CKEditor } from "ckeditor4-react";
import { API_URL_getalltemplatesurattugas } from "@/constants";
import { Checkbox } from "@/components";
import { set } from "date-fns";

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
  const headerHtml = `
          <div style="padding: 1.5rem; padding-top: 3rem; padding-bottom: 2.5rem; padding-left: 6rem; padding-right: 6rem; display: flex; flex-wrap: wrap; flex-direction: column;">
            <header contenteditable="false" style="display: flex; justify-content: flex-start; align-items: center; gap: 2.5rem; margin-bottom: 1.25rem;">
              <div>
                <img alt="Logo QNN" src="/images/icons/qnn.png" style="width: 11rem;" />
              </div>
              <div style="width: fit-content; text-align: center;">
                <h1 style="font-size: 1.5rem; color: #ff0000; font-weight: bold; white-space: nowrap;">
                  PT. QUEEN <span style="color: #09017b;">NETWORK</span> NUSANTARA
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
            <div contenteditable="true">${values}</div>
          </div>
        `;

  const [editorKey, setEditorKey] = useState(null);
  const [html, setHtml] = useState("");
  const [htmlModifed, setHtmlModifed] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEditor, setLoadingEditor] = useState(true);
  const [template, setTemplate] = useState([]);

  const [showJabatan, setShowJabatan] = useState(false);
  const [showDepartement, setShowDepartement] = useState(false);
  const [showDivisi, setShowDivisi] = useState(false);
  const [showUnit, setShowUnit] = useState(false);

  const [prevType, setPrevType] = useState(0);
  useEffect(() => {
    sessionStorage.setItem("ckeditor", headerHtml);
  }, []);

  const handleEditorChange = (event) => {
    const newHtml = event.editor.getData();
    setTimeout(() => {
      sessionStorage.setItem("ckeditor", newHtml);
    }, 700);
    setTimeout(() => {
      setHtml(newHtml);
    }, 500);
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
    let htmlContent = "";

    if (type) {
      const matchedTemplate =
        type !== prevType
          ? template.find((t) => t.id === type)
          : { isi: sessionStorage.getItem("ckeditor") };

      if (matchedTemplate) {
        htmlContent = matchedTemplate.isi
          .replace(/\{no_surat\}/g, noSurat || "")
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
        const modifiedHtml = htmlContent
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
            /\{departement_pemohon\}/g,
            pemohon.departement || "tidak ada departement"
          )
          .replace(/\{divisi_pemohon\}/g, pemohon.divisi || "tidak ada divisi")
          .replace(/\{unit_pemohon\}/g, pemohon.unit || "tidak ada unit")
          .replace(
            /<tbody>\s*.*?<\/tbody>/g,
            `<tbody>
              ${penerima
                .map((item, index) => {
                  return `<tr>
                    <td>${index + 1}</td>
                    <td>${
                      item.label
                        .split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        )
                        .join(" ") || "Tidak ada nama"
                    }</td>
                    <td id="table_jabatan" style="display: none;">${
                      item.jabatan || "Tidak ada jabatan"
                    }</td>
                    <td id="table_departement" style="display: none;">${
                      item.departemen || "Tidak ada departemen"
                    }</td>
                    <td id="table_divisi" style="display: none;">${
                      item.divisi || "Tidak ada divisi"
                    }</td>
                    <td id="table_unit" style="display: none;">${
                      item.unit || "Tidak ada unit"
                    }</td>
                  </tr>`;
                })
                .join("")}
            </tbody>`
          )          
          .replace(/\{no_surat\}/g, noSurat || "")
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
        setHtmlModifed(modifiedHtml);
        setEditorKey(modifiedHtml);
      }
      setTimeout(() => {
        setPrevType(type);
      }, 100);
    } else {
      htmlContent = isEdit
        ? values
        : `
          <div style="padding: 1.5rem; padding-top: 3rem; padding-bottom: 2.5rem; padding-left: 6rem; padding-right: 6rem; display: flex; flex-wrap: wrap; flex-direction: column;">
            <header contenteditable="false" style="display: flex; justify-content: flex-start; align-items: center; gap: 2.5rem; margin-bottom: 1.25rem;">
              <div>
                <img alt="Logo QNN" src="/images/icons/qnn.png" style="width: 11rem;" />
              </div>
              <div style="width: fit-content; text-align: center;">
                <h1 style="font-size: 1.5rem; color: #ff0000; font-weight: bold; white-space: nowrap;">
                  PT. QUEEN <span style="color: #09017b;">NETWORK</span> NUSANTARA
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
            <div contenteditable="true">${values}</div>
          </div>
        `;
    }
    if (showJabatan) {
      htmlContent = htmlContent.replace(
        /(id="jabatan".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
      htmlContent = htmlContent.replace(
        /(id="table_jabatan".*?)display:\s*none\s*;/g,
        "$1testing;"
      );
    } else {
      htmlContent = htmlContent.replace(
        /(id="jabatan".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
      htmlContent = htmlContent.replace(
        /(id="table_jabatan".*?)\s*testing;/g,
        "$1display: none;"
      );
    }

    if (showDepartement) {
      htmlContent = htmlContent.replace(
        /(id="departement".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
      htmlContent = htmlContent.replace(
        /(id="table_departement".*?)display:\s*none\s*;/g,
        "$1testing;"
      );
    } else {
      htmlContent = htmlContent.replace(
        /(id="departement".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
      htmlContent = htmlContent.replace(
        /(id="table_departement".*?)\s*testing;/g,
        "$1display: none;"
      );
    }

    if (showDivisi) {
      htmlContent = htmlContent.replace(
        /(id="divisi".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
      htmlContent = htmlContent.replace(
        /(id="table_divisi".*?)display:\s*none\s*;/g,
        "$1testing;"
      );
    } else {
      htmlContent = htmlContent.replace(
        /(id="divisi".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
      htmlContent = htmlContent.replace(
        /(id="table_divisi".*?)\s*testing;/g,
        "$1display: none;"
      );
    }

    if (showUnit) {
      htmlContent = htmlContent.replace(
        /(id="unit".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
      htmlContent = htmlContent.replace(
        /(id="table_unit".*?)display:\s*none\s*;/g,
        "$1testing;"
      );
    } else {
      htmlContent = htmlContent.replace(
        /(id="unit".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
      htmlContent = htmlContent.replace(
        /(id="table_unit".*?)\s*testing;/g,
        "$1display: none;"
      );
    }

    if (htmlContent !== html) {
      setHtml(htmlContent);
      if (htmlContent !== sessionStorage.getItem("ckeditor")) {
        setEditorKey(htmlContent);
      }
      sessionStorage.setItem("ckeditor", htmlContent);
    }
    setLoadingEditor(false);
  }, [
    html,
    values,
    template,
    type,
    isEdit,
    noSurat,
    penerima,
    user,
    showJabatan,
    showDepartement,
    showDivisi,
    showUnit,
  ]);

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
            initData={htmlModifed}
            onChange={handleEditorChange}
            config={{
              allowedContent: true,
              contentsCss: [
                "input, textarea { margin: 0; padding: 0; border: none; }",
                "ul { margin: 0; padding-left: 0; }",
                "li { margin: 0; padding-left: 0; }",
              ],
              extraPlugins: "justify,colorbutton,colordialog",
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
