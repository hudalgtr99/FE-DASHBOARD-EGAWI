import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteData, getData } from "@/actions";
import {
  API_URL_edelsurattugas,
  API_URL_getsurattugas,
  API_URL_getperusahaan,
} from "@/constants";
import { icons } from "../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  Select,
  TextField,
  Tooltip,
  PulseLoading,
} from "@/components";
import { debounce } from "lodash"; // Import lodash debounce
import { FaPlus, FaEdit, FaPrint, FaTrash } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import axiosAPI from "@/authentication/axiosApi";
import { useReactToPrint } from "react-to-print";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import { penugasanReducer } from "@/reducers/penugasanReducers";

const SuratPenugasanPage = () => {
  const { getTugasResult, getTugasLoading, addTugasResult, deleteTugasResult } =
    useSelector((state) => state.tugas);
  const printRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [printData, setPrintData] = useState("");
  const [perusahaanOptions, setPerusahaanOptions] = useState([]);
  const [selectedPerusahaan, setSelectedPerusahaan] = useState(null);

  const [jwt, setJwt] = useState({}); // Initialize jwt variable

  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAPI.get(API_URL_getperusahaan);
        const options = response.data.map((item) => ({
          value: item.slug,
          label: item.nama,
        }));
        setPerusahaanOptions(options);
      } catch (error) {
        console.error("Error fetching perusahaan data:", error);
      }
    };
    fetchData();
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
    }, 300),
    [limit, pageActive, selectedPerusahaan] // Tambahkan selectedPerusahaan sebagai dependency
  );

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
    setPageActive(0);
  };

  const onAdd = () => {
    navigate("/masterdata/jabatan/form");
  };

  const onEdit = (item) => {
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

  const handleSelect = (selectedOption) => {
    setSelectedPerusahaan(selectedOption);
    const offset = pageActive * limit;
    const param = {
      param: `?search=${search || ""}&perusahaan=${
        selectedOption?.value || ""
      }&limit=${limit}&offset=${offset}`,
    };

    get(param);
  };

  useEffect(() => {
    const param = selectedPerusahaan
      ? {
          param: `?perusahaan=${
            selectedPerusahaan.value
          }&limit=${limit}&offset=${pageActive * limit}`,
        }
      : { param: `?limit=${limit}&offset=${pageActive * limit}` };
    get(param);
  }, [limit, pageActive, search, selectedPerusahaan, get]);

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

    // Validasi dan format ulang data untuk cetak
    const formattedIsi = selectedData.isi
      ?.replace(
        /\{nama_pemohon\}/g,
        selectedData.pemohon?.nama
          ?.split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ") || "Tidak ada pemohon"
      )
      .replace(
        /\{jabatan_pemohon\}/g,
        selectedData.pemohon?.jabatan || "Tidak ada jabatan"
      )
      .replace(
        /\{departement_pemohon\}/g,
        selectedData.pemohon?.departemen || "Tidak ada departemen"
      )
      .replace(
        /\{divisi_pemohon\}/g,
        selectedData.pemohon?.divisi || "Tidak ada divisi"
      )
      .replace(
        /\{unit_pemohon\}/g,
        selectedData.pemohon?.unit || "Tidak ada unit"
      )
      .replace(
        /<tbody>\s*.*?<\/tbody>/,
        `
          <tbody>
            ${selectedData.penerima
              ?.map(
                (item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.nama || "Tidak ada nama"}</td>
                    <td>${item.jabatan || "Tidak ada jabatan"}</td>
                    <td>${item.departemen || "Tidak ada departemen"}</td>
                    <td>${item.divisi || "Tidak ada divisi"}</td>
                    <td>${item.unit || "Tidak ada unit"}</td>
                  </tr>`
              )
              .join("")}
          </tbody>
          `
      );

    if (printRef.current) {
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
          <div
            className={`w-full flex gap-2 ${
              jwt.perusahaan ? "sm:w-60" : "sm:w-1/2"
            }`}
          >
            <TextField
              onChange={doSearch}
              placeholder="Search"
              value={search}
              icon={<CiSearch />}
            />
            {!jwt.perusahaan && (
              <Select
                options={perusahaanOptions}
                placeholder="Filter perusahaan"
                onChange={handleSelect} // Memanggil handleSelect saat ada perubahan
                value={selectedPerusahaan} // Menampilkan perusahaan yang dipilih
              />
            )}
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
                          <div
                            onClick={() => onPrint(i)}
                            className="text-blue-500 cursor-pointer"
                          >
                            <FaPrint />
                          </div>
                        </Tooltip>
                        <Tooltip tooltip="Edit">
                          <div
                            onClick={() => onEdit(item)}
                            className="text-yellow-500 cursor-pointer"
                          >
                            <FaEdit />
                          </div>
                        </Tooltip>
                        <Tooltip tooltip="Delete">
                          <div
                            onClick={() => doDelete(item)}
                            className="text-red-500 cursor-pointer"
                          >
                            <FaTrash />
                          </div>
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
              __html: printData.formattedIsi || "<p>Data tidak tersedia</p>",
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
