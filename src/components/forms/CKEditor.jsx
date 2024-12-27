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
  perusahaan = {},
}) {
  const headerHtml = ` ${
    values
      ? `${values}`
      : `<div style="padding: 1.5rem; padding-top: 3rem; padding-bottom: 2.5rem; padding-left: 6rem; padding-right: 6rem; display: flex; flex-wrap: wrap; flex-direction: column;">
    <header style="display: flex; justify-content: flex-start; align-items: center; gap: 2.5rem; margin-bottom: 1.25rem;">
      <div>
        <img alt="Logo" src="${
          perusahaan?.image || "/images/icons/qnn.png"
        }" style="width: 11rem;" />
      </div>
      <div style="width: fit-content; text-align: center;">
        <h1 style="font-size: 1.5rem; font-weight: bold; white-space: nowrap;">
          ${
            perusahaan?.nama
              ? perusahaan?.nama.toUpperCase()
              : `<span style="color: #ff0000;">PT. QUEEN </span><span style="color: #09017b;">NETWORK</span> <span style="color: #ff0000;">NUSANTARA</span>`
          }
        </h1>
        <div style="font-size: .885rem; font-family: 'Tinos', serif;">
          <p>${
            perusahaan?.alamat?.split(",")[0] ||
            "Jalan Alam Gaya Nomor 42 BTN II"
          }, ${perusahaan?.alamat?.split(",")[1] || "Way Halim Permai"}</p>
          <p>${perusahaan?.alamat?.split(",")[2] || "Kota Bandar Lampung"}, ${
          perusahaan?.alamat?.split(",")[3] || "Lampung"
        }, ${perusahaan?.alamat?.split(",")[4] || "Kode Pos 35133"}</p>
          <p>Telepon: (0721) 5615819, Website: www.qnn.co.id</p>
        </div>
      </div>
    </header>
    <div style="border-bottom: 2px solid #1E293B; width: 100%;">&nbsp;</div>
    <br>
    <div contenteditable="true">${values}</div>
  </div>`
  }`;

  const [editorKey, setEditorKey] = useState(null);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEditor, setLoadingEditor] = useState(true);
  const [template, setTemplate] = useState([]);

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
          // .replace(/\{no_surat\}/g, noSurat || "")
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
      htmlContent = isEdit ? values : headerHtml;
    }

    if (htmlContent !== html) {
      setHtml(htmlContent);
      if (htmlContent !== sessionStorage.getItem("ckeditor")) {
        setEditorKey(htmlContent);
      }
      sessionStorage.setItem("ckeditor", htmlContent);
    }
    setLoadingEditor(false);
  }, [html, values, template, type, isEdit, noSurat, penerima, user]);

  return (
    <>
      {!loadingEditor && (
        <>
          <label
            htmlFor="editor"
            style={{
              fontSize: "15px",
            }}
            className={``}
          >
            Isi surat
          </label>
          <br />
          <label
            htmlFor="editor"
            style={{
              fontSize: "15px",
            }}
            className={`mb-1`}
          >
            Note: <code>{`{nama_pemohon}`}</code>,{" "}
            <code>{`{jabatan_pemohon}`}</code>, <code>{`{nama_penerima}`}</code>
            , <code>{`{jabatan_penerima}`}</code>,{" "}, <code>{`{no_surat}`}</code>,{" "}
            <code>{`{format_date}`}</code>, <code>{`{nama_perusahaan}`}</code>,{" "}
            <code>{`{nama_kota}`}</code>
          </label>
          <div className="ckeditor-container">
            <CKEditor
              id="editor"
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
          </div>
        </>
      )}
    </>
  );
}
