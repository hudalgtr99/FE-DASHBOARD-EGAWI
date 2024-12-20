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
  isTemplate = false,
  perusahaan={},
}) {

  console.log("perusahaan", perusahaan);
  
  const headerHtml = `
          <div style="padding: 1.5rem; padding-top: 3rem; padding-bottom: 2.5rem; padding-left: 6rem; padding-right: 6rem; display: flex; flex-wrap: wrap; flex-direction: column;">
            <header style="display: flex; justify-content: flex-start; align-items: center; gap: 2.5rem; margin-bottom: 1.25rem;">
              <div>
                <img alt="Logo QNN" src="${perusahaan.image || "/images/icons/qnn.png"}" style="width: 11rem;" />
              </div>
              <div style="width: fit-content; text-align: center;">
                <h1 style="font-size: 1.5rem; font-weight: bold; white-space: nowrap;">
                 ${'PT. ' + perusahaan?.nama?.toUpperCase() || `<span style="color: #ff0000;">QUEEN </span><span style="color: #09017b;">NETWORK</span> <span style="color: #ff0000;">NUSANTARA</span>`}
                </h1>
                <div style="font-size: .885rem; font-family: 'Tinos', serif;">
                      <p>${perusahaan?.alamat?.split(',')[0] || 'Jalan Alam Gaya Nomor 42 BTN II' }, ${perusahaan?.alamat?.split(',')[1] || 'Way Halim Permai'}</p>
                      <p>${perusahaan?.alamat?.split(',')[2] || 'Kota Bandar Lampung'}, ${perusahaan?.alamat?.split(',')[3] || 'Lampung'}, ${perusahaan?.alamat?.split(',')[4] || 'Kode Pos 35133'}</p>
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
  const [loading, setLoading] = useState(false);
  const [loadingEditor, setLoadingEditor] = useState(true);
  const [template, setTemplate] = useState([]);

  const [showJabatan, setShowJabatan] = useState(false);
  const [showDepartement, setShowDepartement] = useState(false);
  const [showDivisi, setShowDivisi] = useState(false);
  const [showUnit, setShowUnit] = useState(false);

  const [docJabatan, setDocJabatan] = useState(false);
  const [docDepartement, setDocDepartement] = useState(false);
  const [docDivisi, setDocDivisi] = useState(false);
  const [docUnit, setDocUnit] = useState(false);

  const [clickJabatan, setClickJabatan] = useState(false);
  const [clickDepartement, setClickDepartement] = useState(false);
  const [clickDivisi, setClickDivisi] = useState(false);
  const [clickUnit, setClickUnit] = useState(false);

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
      }
      setTimeout(() => {
        setPrevType(type);
      }, 100);
    } else {
      htmlContent = isEdit
        ? values
        : headerHtml;
    }
    if (clickJabatan) {
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
    }

    if (clickDepartement) {
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
    }

    if (clickDivisi) {
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
    }

    if (clickUnit) {
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
    clickJabatan,
    clickDepartement,
    clickDivisi,
    clickUnit,
  ]);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const isVisible = (element) => element && element.style.display !== "none";

    const jabatan = doc.getElementById("jabatan");
    const departement = doc.getElementById("departement");
    const divisi = doc.getElementById("divisi");
    const unit = doc.getElementById("unit");

    setDocJabatan(doc.getElementById("jabatan") !== null);
    setDocDepartement(doc.getElementById("departement") !== null);
    setDocDivisi(doc.getElementById("divisi") !== null);
    setDocUnit(doc.getElementById("unit") !== null);

    setShowJabatan(isVisible(jabatan));
    setShowDepartement(isVisible(departement));
    setShowDivisi(isVisible(divisi));
    setShowUnit(isVisible(unit));
  }, [html]);

  return (
    <>
      {(docJabatan || docDepartement || docDivisi || docUnit) && (
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
            {docJabatan && (
              <Checkbox
                label="Show Jabatan"
                checked={showJabatan}
                onChange={() => {
                  setShowJabatan(!showJabatan);
                  setClickJabatan(true);
                }}
              />
            )}
            {docDepartement && (
              <Checkbox
                label="Show Departement"
                checked={showDepartement}
                onChange={() => {
                  setShowDepartement(!showDepartement);
                  setClickDepartement(true);
                }}
              />
            )}
            {docDivisi && (
              <Checkbox
                label="Show Divisi"
                checked={showDivisi}
                onChange={() => {
                  setShowDivisi(!showDivisi);
                  setClickDivisi(true);
                }}
              />
            )}
            {docUnit && (
              <Checkbox
                label="Show Unit"
                checked={showUnit}
                onChange={() => {
                  setShowUnit(!showUnit);
                  setClickUnit(true);
                }}
              />
            )}
          </div>
        </div>
      )}

      {!loadingEditor && (
        <>
          <CKEditor
            key={editorKey}
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
