import React, { useEffect, useState, useRef, useCallback } from "react";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import axiosAPI from "@/authentication/axiosApi";
import { CKEditor } from "ckeditor4-react";
import { API_URL_getalltemplatesurattugas } from "@/constants";

const PDFToPrint = ({
  type,
  state,
  user,
  noSurat,
  isEditTemplate = false,
  isEditSurat = false,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [html, setHtml] = useState(""); // Template HTML
  const [namaPenerima, setNamaPenerima] = useState("");
  const [jabatanPenerima, setJabatanPenerima] = useState("");
  const [perusahaan, setPerusahaan] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEditor, setLoadingEditor] = useState(true);
  const [template, setTemplate] = useState([]);

  const [showJabatanPenerima, setShowJabatanPenerima] = useState(false);
  const [showDepartementPenerima, setShowDepartementPenerima] = useState(false);
  const [showDivisiPenerima, setShowDivisiPenerima] = useState(false);
  const [showUnitPenerima, setShowUnitPenerima] = useState(false);
  const [showJabatanPengirim, setShowJabatanPengirim] = useState(false);
  const [showDepartementPengirim, setShowDepartementPengirim] = useState(false);
  const [showDivisiPengirim, setShowDivisiPengirim] = useState(false);
  const [showUnitPengirim, setShowUnitPengirim] = useState(false);
  const [editorKey, setEditorKey] = useState(null);
  const [surat, setSurat] = useState({
    pembuat: {
      nama: user?.datapribadi?.nama || "",
      jabatan: user?.datapegawai?.jabatan?.nama || "",
      perusahaan: user?.datapribadi?.perusahaan?.nama || "",
    },
    formatDate:
      user?.datapribadi?.perusahaan?.lokasi +
      ", " +
      new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
  });

  useEffect(() => {
    setSurat((prevSurat) => ({
      ...prevSurat,
      pembuat: {
        nama: user?.datapribadi?.nama || "",
        jabatan: user?.datapegawai?.jabatan?.nama || "",
        perusahaan: user?.datapribadi?.perusahaan?.nama || "",
      },
      formatDate:
        user?.datapribadi?.perusahaan?.lokasi +
        ", " +
        new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
    }));
  }, [user]);

  const [jwt, setJwt] = useState({});

  useEffect(() => {
    setIsMounted(true);
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, []);

  useEffect(() => {
    const nama = state?.penerima?.map((p) => p.label).join(", ") || "";
    const jabatan = state?.penerima?.map((p) => p.jabatan).join(", ") || "";
    const perusahaan = jwt.perusahaan ? jwt.perusahaan.toUpperCase() || "" : "";

    setNamaPenerima(nama);
    setJabatanPenerima(jabatan);
    setPerusahaan(perusahaan);
  }, [state, jwt]);

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
    if (isEditTemplate === false) {
      if (isEditSurat) {
        console.log(isEditSurat);
        setHtml(isEditSurat);
        setLoadingEditor(false);
      } else {
        const matchedTemplate = template.find((t) => t.id === type);
        if (
          matchedTemplate &&
          noSurat &&
          user.datapribadi &&
          surat &&
          perusahaan
        ) {
          try {
            const formattedIsi = matchedTemplate.isi
              .replace(/\${NO_SURAT\}/g, noSurat || "")
              .replace(
                /\$\{formattedDate\}/g,
                surat.formatDate.replace("Kota", "") || ""
              );
            setHtml(formattedIsi);
          } catch {
          } finally {
            setLoadingEditor(false);
          }
        }
      }
    } else {
      const matchedTemplate = template.find((t) => t.id === type);
      if (matchedTemplate) {
        let htmlContent = "";
        try {
          htmlContent = isEditTemplate
            ? matchedTemplate.isi.replace(
                /contentEditable="false"/g,
                'contentEditable="true"'
              )
            : matchedTemplate.isi;
        } catch {}
        setHtml(htmlContent);
        setLoadingEditor(false);
      } else {
        setLoadingEditor(false);
      }
    }
  }, [type, perusahaan, template, surat, noSurat, user]);

  const handleEditorChange = (event) => {
    setHtml(event.editor.getData());
    sessionStorage.setItem("ckeditor", event.editor.getData());
  };

  const handlejabatanPenerima = () => {
    setShowJabatanPenerima(!showJabatanPenerima);
  };

  const handlejabatanPengirim = () => {
    setShowJabatanPengirim(!showJabatanPengirim);
  };

  const handleDepartementPenerima = () => {
    setShowDepartementPenerima(!showDepartementPenerima);
  };

  const handleDepartementPengirim = () => {
    setShowDepartementPengirim(!showDepartementPengirim);
  };

  const handleDivisiPenerima = () => {
    setShowDivisiPenerima(!showDivisiPenerima);
  };

  const handleDivisiPengirim = () => {
    setShowDivisiPengirim(!showDivisiPengirim);
  };

  const handleUnitPenerima = () => {
    setShowUnitPenerima(!showUnitPenerima);
  };

  const handleUnitPengirim = () => {
    setShowUnitPengirim(!showUnitPengirim);
  };

  useEffect(() => {
    if (html) {
      sessionStorage.setItem("ckeditor", html);
    }
  }, [html]);

  useEffect(() => {
    let htmlChanged = html;

    // Adjusting display logic for all fields
    if (showJabatanPenerima) {
      htmlChanged = htmlChanged.replace(
        /(id="jabatan_penerima".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
    } else {
      htmlChanged = htmlChanged.replace(
        /(id="jabatan_penerima".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
    }

    if (showDepartementPenerima) {
      htmlChanged = htmlChanged.replace(
        /(id="departement_penerima".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
    } else {
      htmlChanged = htmlChanged.replace(
        /(id="departement_penerima".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
    }

    if (showDivisiPenerima) {
      htmlChanged = htmlChanged.replace(
        /(id="divisi_penerima".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
    } else {
      htmlChanged = htmlChanged.replace(
        /(id="divisi_penerima".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
    }

    if (showUnitPenerima) {
      htmlChanged = htmlChanged.replace(
        /(id="unit_penerima".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
    } else {
      htmlChanged = htmlChanged.replace(
        /(id="unit_penerima".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
    }

    // Repeat similar logic for Pengirim (sender)
    if (showJabatanPengirim) {
      htmlChanged = htmlChanged.replace(
        /(id="jabatan_pengirim".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
    } else {
      htmlChanged = htmlChanged.replace(
        /(id="jabatan_pengirim".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
    }

    if (showDepartementPengirim) {
      htmlChanged = htmlChanged.replace(
        /(id="departement_pengirim".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
    } else {
      htmlChanged = htmlChanged.replace(
        /(id="departement_pengirim".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
    }

    if (showDivisiPengirim) {
      htmlChanged = htmlChanged.replace(
        /(id="divisi_pengirim".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
    } else {
      htmlChanged = htmlChanged.replace(
        /(id="divisi_pengirim".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
    }

    if (showUnitPengirim) {
      htmlChanged = htmlChanged.replace(
        /(id="unit_pengirim".*?)display:\s*none;\s*/g,
        "$1display: flex; "
      );
    } else {
      htmlChanged = htmlChanged.replace(
        /(id="unit_pengirim".*?)display:\s*flex;\s*/g,
        "$1display: none; "
      );
    }

    setHtml(htmlChanged);

    if (htmlChanged !== html) {
      setEditorKey(htmlChanged);
      sessionStorage.setItem("ckeditor", htmlChanged);
    }
  }, [
    html,
    showJabatanPenerima,
    showDepartementPenerima,
    showDivisiPenerima,
    showUnitPenerima,
    showJabatanPengirim,
    showDepartementPengirim,
    showDivisiPengirim,
    showUnitPengirim,
  ]);

  return (
    <>
      <div className="flex w-full justify-between items-center mb-3">
        <div className="flex flex-col gap-1">
          <span
            style={{
              fontSize: "15px",
            }}
            className="capitalize"
          >
            pemberi
          </span>
          <div className="grid grid-cols-2 gap-1">
            <Checkbox
              label="Jabatan Pengirim"
              checked={showJabatanPengirim}
              onChange={handlejabatanPengirim}
            />
            <Checkbox
              label="Departement Pengirim"
              checked={showDepartementPengirim}
              onChange={handleDepartementPengirim}
            />
            <Checkbox
              label="Divisi Pengirim"
              checked={showDivisiPengirim}
              onChange={handleDivisiPengirim}
            />
            <Checkbox
              label="Unit Pengirim"
              checked={showUnitPengirim}
              onChange={handleUnitPengirim}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span
            style={{
              fontSize: "15px",
            }}
            className="capitalize"
          >
            penerima
          </span>
          <div className="grid grid-cols-2 gap-1">
            <Checkbox
              label="Jabatan Penerima"
              checked={showJabatanPenerima}
              onChange={handlejabatanPenerima}
            />
            <Checkbox
              label="Departement Penerima"
              checked={showDepartementPenerima}
              onChange={handleDepartementPenerima}
            />
            <Checkbox
              label="Divisi Penerima"
              checked={showDivisiPenerima}
              onChange={handleDivisiPenerima}
            />
            <Checkbox
              label="Unit Penerima"
              checked={showUnitPenerima}
              onChange={handleUnitPenerima}
            />
          </div>
        </div>
      </div>

      {!loadingEditor && (
        <CKEditor
          key={editorKey}
          style={{ fontFamily: "Tinos" }}
          initData={html}
          config={{
            allowedContent: true,
            contentsCss: [
              "input, textarea { margin: 0; padding: 0; border: none; }",
              "ul { margin: 0; padding-left: 0; }",
              "li { margin: 0; padding-left: 0; }",
            ],
            extraPlugins: "justify",
          }}
          onChange={handleEditorChange}
        />
      )}
    </>
  );
};

export default PDFToPrint;