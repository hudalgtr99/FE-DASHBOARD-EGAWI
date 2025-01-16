import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteData, getData } from "@/actions";
import { API_URL_edelsurattugas, API_URL_getsurattugas } from "@/constants";
import {
  Button,
  Container,
  Pagination,
  Tables,
  TextField,
  Tooltip,
  PulseLoading,
} from "@/components";
import { debounce } from "lodash"; // Import lodash debounce
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useReactToPrint } from "react-to-print";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { penugasanReducer } from "@/reducers/penugasanReducers";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/AuthContext";
import { LuPencil, LuPrinter, LuTrash2 } from "react-icons/lu";

const SuratPenugasanPage = () => {
  const { getTugasResult, getTugasLoading, addTugasResult, deleteTugasResult } =
    useSelector((state) => state.tugas);
  const printRef = useRef();
  const { slug } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [printData, setPrintData] = useState("");

  const [jwt, setJwt] = useState({}); // Initialize jwt variable
  const { selectedPerusahaan, loadingPerusahaan } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((value) => {
      const param = {
        param: `?search=${value}&limit=${limit}&offset=${pageActive * limit}`,
      };

      // Jika perusahaan dipilih, tambahkan parameter perusahaan ke dalam query string
      if (selectedPerusahaan) {
        param.param += `&perusahaan=${selectedPerusahaan.value}`;
      }

      get(param);
    }, 1500),
    [limit, pageActive, selectedPerusahaan] // Tambahkan selectedPerusahaan sebagai dependency
  );

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
    setPageActive(0);
  };

  const onAdd = () => {
    sessionStorage.setItem("url", location.pathname);
    const item = slug ? { perusahaan: { slug: slug } } : null;
    navigate("/kepegawaian/surat-penugasan/form", { state: { item } });
  };

  const onEdit = (item) => {
    sessionStorage.setItem("url", location.pathname);
    item.pemohon = item.pemohon;
    item.perusahaan = item.perusahaan ? item.perusahaan.id : "";
    navigate(`/kepegawaian/surat-penugasan/form/${item.slug}`, {
      state: {
        item,
      },
    });
    sessionStorage.setItem("ckeditor", item.isi);
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: penugasanReducer },
      item.slug,
      API_URL_edelsurattugas,
      "DELETE_TUGAS"
    );
  };

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: penugasanReducer },
        param,
        API_URL_getsurattugas,
        "GET_TUGAS"
      );
    },
    [dispatch]
  );

  const handlePageClick = (page) => {
    const offset = (page - 1) * limit; // Calculate the offset based on the page

    // Menyiapkan parameter pencarian dan perusahaan
    const param = {
      param: `?search=${search || ""}&perusahaan=${
        selectedPerusahaan?.value || ""
      }&limit=${limit}&offset=${offset}`,
    };

    get(param);
    setPageActive(page - 1);
  };

  useEffect(() => {
    const offset = pageActive * limit;

    // Menyiapkan parameter pencarian berdasarkan kondisi slug
    const param = selectedPerusahaan?.value
      ? `?search=${search || ""}&perusahaan=${
          selectedPerusahaan?.value || ""
        }&limit=${limit}&offset=${offset}`
      : `?limit=${limit}&search=${search || ""}&offset=${offset}`;

    get({ param });
  }, [slug, selectedPerusahaan, limit, pageActive, search, get]);

  useEffect(() => {
    if (addTugasResult || deleteTugasResult) {
      const param = search
        ? {
            param: `?search=${search}&perusahaan=${
              selectedPerusahaan?.value || ""
            }&limit=${limit}&offset=${pageActive * limit}`,
          }
        : {
            param: `?perusahaan=${
              selectedPerusahaan?.value || ""
            }&limit=${limit}&offset=${pageActive * limit}`,
          };

      get(param);
    }
  }, [
    addTugasResult,
    deleteTugasResult,
    selectedPerusahaan,
    search,
    limit,
    pageActive,
    get,
  ]);

  const dataWithIndex = getTugasResult.results
    ? getTugasResult.results.map((item, index) => ({
        ...item,
        index: pageActive * limit + index + 1,
      }))
    : [];

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Surat Tugas",
  });

  const onPrint = (index) => {
    const selectedData = dataWithIndex[index];
    console.log(selectedData);

    // Validasi dan format ulang data untuk cetak
    const formattedIsi = selectedData?.isi
      ?.replace(
        /\{nama_pemohon\}/g,
        selectedData?.pemohon?.nama
          ?.split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ") || "Tidak ada pemohon"
      )
      .replace(
        /\{jabatan_pemohon\}/g,
        selectedData?.pemohon?.jabatan || "Tidak ada jabatan"
      )
      .replace(
        /<tbody id="table_penerima">\s*.*?<\/tbody>/,
        `
          <tbody>
            ${selectedData?.penerima
              ?.map(
                (item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.nama || "Tidak ada nama"}</td>
                    <td>${item.jabatan || "Tidak ada jabatan"}</td>
                  </tr>`
              )
              .join("")}
          </tbody>
          `
      )
      .replace(
        /\{nama_penerima\}/g,
        selectedData?.penerima
          ?.map((item) =>
            item.nama
              ? item.nama
                  .split(" ")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ")
              : "Tidak ada nama"
          )
          .join(", ") || "Tidak ada penerima"
      )
      .replace(
        /\{jabatan_penerima\}/g,
        selectedData?.penerima
          ?.map((item) => item.jabatan || "Tidak ada jabatan")
          .join(", ") || "Tidak ada jabatan"
      )
      .replace(
        /\{logo\}/g,
        selectedData?.template?.perusahaan?.image
          ? `<img src="${selectedData.template.perusahaan.image}" alt="Logo" />`
          : "&nbsp;<br>&nbsp;"
      )

      .replace(/\{no_surat\}/g, selectedData?.no_surat);

    if (printRef) {
      printRef.current.innerHTML = formattedIsi;
    }

    setPrintData({ ...selectedData, formattedIsi });

    // Cetak dokumen
    handlePrint();
  };

  return (
    <div>
      <Container>
        <div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <div className={`w-full flex gap-2 sm:w-60`}>
            <TextField
              onChange={doSearch}
              placeholder="Search"
              value={search}
              icon={<CiSearch />}
            />
          </div>
          <Button onClick={() => onAdd()}>
            <div className="flex items-center gap-2">
              <FaPlus /> Tambah Surat
            </div>
          </Button>
        </div>
        {getTugasLoading ? (
          <div className="flex justify-center py-4">
            <PulseLoading />
          </div>
        ) : (
          <Tables>
            <Tables.Head>
              <tr>
                <Tables.Header>No</Tables.Header>
                {!jwt.perusahaan && (
                  <Tables.Header>Nama perusahaan</Tables.Header>
                )}
                <Tables.Header>Nama template</Tables.Header>
                <Tables.Header>Pengirim</Tables.Header>
                <Tables.Header>Nama Surat</Tables.Header>
                <Tables.Header>Penerima</Tables.Header>
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {dataWithIndex.length > 0 ? (
                dataWithIndex.map((item, i) => (
                  <Tables.Row key={item.id}>
                    <Tables.Data>{item.index}</Tables.Data>
                    {!jwt.perusahaan && (
                      <Tables.Data>
                        {(item?.template?.perusahaan &&
                          item?.template?.perusahaan?.nama) ||
                          "-"}
                      </Tables.Data>
                    )}
                    <Tables.Data>{item?.template?.nama}</Tables.Data>
                    <Tables.Data>{item?.pemohon?.nama}</Tables.Data>
                    <Tables.Data>
                      <p className="line-clamp-1">{item.nama}</p>
                    </Tables.Data>
                    <Tables.Data>
                      <p className="line-clamp-1">
                        {item?.penerima?.map((p) => p.nama).join(", ") || ""}
                      </p>
                    </Tables.Data>
                    <Tables.Data center>
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip tooltip="Print">
                          <Button
                            size={30}
                            variant="tonal"
                            color={"info"}
                            onClick={() => onPrint(i)}
                            className="cursor-pointer"
                          >
                            <LuPrinter />
                          </Button>
                        </Tooltip>
                        <Tooltip tooltip="Edit">
                          <Button
                            size={30}
                            variant="tonal"
                            color={"success"}
                            onClick={() => onEdit(item)}
                            className="cursor-pointer"
                          >
                            <LuPencil />
                          </Button>
                        </Tooltip>
                        <Tooltip tooltip="Delete">
                          <Button
                            size={30}
                            variant="tonal"
                            color={"danger"}
                            onClick={() => doDelete(item)}
                            className="cursor-pointer"
                          >
                            <LuTrash2 />
                          </Button>
                        </Tooltip>
                      </div>
                    </Tables.Data>
                  </Tables.Row>
                ))
              ) : (
                <Tables.Row>
                  <td colSpan={7} className="text-center">
                    Tidak ada data yang tersedia
                  </td>
                </Tables.Row>
              )}
            </Tables.Body>
          </Tables>
        )}
        <div ref={printRef} className="print-only">
          <div
            dangerouslySetInnerHTML={{
              __html: printData?.formattedIsi || "<p>Data tidak tersedia</p>",
            }}
          />
        </div>
        <div className="flex justify-end items-center mt-4">
          <Pagination
            totalCount={getTugasResult.count || 0}
            pageSize={limit}
            currentPage={pageActive + 1}
            onPageChange={handlePageClick}
            siblingCount={1}
            activeColor="primary"
            rounded="md"
            variant="flat"
            size="md"
          />
        </div>
      </Container>
    </div>
  );
};

export default SuratPenugasanPage;
