import { icons } from "../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  Limit,
  TextField,
  Tooltip,
  PulseLoading,
} from "@/components";
import { debounce, set } from "lodash";
import { FaEdit, FaPlus, FaPrint, FaTrash } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useCallback, useEffect, useRef, useState } from "react";
import { penugasanReducer } from "@/reducers/penugasanReducers";
import { getData, deleteData } from "@/actions";
import { API_URL_getsurattugas, API_URL_edelsurattugas } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";

export default function MasterTemplateSlug() {
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [printPDF, setPrintPDF] = useState(2);
  const { getTugasResult, addTugasResult, deleteTugasResult, getTugasLoading } =
    useSelector((state) => state.tugas);

  const onAdd = () => {
    navigate(`/surat-penugasan/surat-penugasan/form`);
    sessionStorage.removeItem("ckeditor");
  };

  const onEdit = (item) => {
    item.pemohon = item.pemohon.id;
    navigate(`/surat-penugasan/surat-penugasan/form/${item.id}`, {
      state: {
        item,
      },
    });
    sessionStorage.setItem("ckeditor", item.isi);
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: penugasanReducer },
      item.id,
      API_URL_edelsurattugas,
      "DELETE_TUGAS"
    );
  };

  const contentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
  });

  // Debounce search function
  const debouncedSearch = useCallback(
    debounce((value) => fetchTugas(value), 300),
    [limit]
  );

  const fetchTugas = (searchValue = "") => {
    setLoading(true);
    const param = searchValue
      ? {
          param: `?search=${searchValue}&limit=${limit}&offset=${
            pageActive * limit
          }`,
        }
      : { param: `?limit=${limit}&offset=${pageActive * limit}` };
    getData(
      { dispatch, redux: penugasanReducer },
      param,
      `${API_URL_getsurattugas}/`,
      "GET_TUGAS"
    );

    setLoading(false);
  };

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
    setPageActive(0);
  };

  const handlePageClick = (page) => {
    setPageActive(page - 1);
  };

  const handleSelect = (newLimit) => {
    setLimit(newLimit);
    setPageActive(0);
    fetchTugas(search);
  };

  useEffect(() => {
    fetchTugas(search);
  }, [limit, pageActive, search]);

  useEffect(() => {
    if (addTugasResult || deleteTugasResult) {
      fetchTugas(search); // Refetch the data after add/delete
    }
  }, [addTugasResult, deleteTugasResult, search]);

  const dataWithIndex = getTugasResult.results
    ? getTugasResult.results.map((item, index) => ({
        ...item,
        index: pageActive * limit + index + 1,
      }))
    : [];

  // Fungsi untuk sinkronisasi display antara <th> dan <tr>
function syncDisplay() {
  // Ambil semua elemen <th> yang memiliki atribut id
  const thElements = document.querySelectorAll("th[id]");
  
  // Iterasi setiap <th> dan sinkronisasi <tr> dengan id yang sama
  thElements.forEach((th) => {
    const id = th.id; // Ambil id <th>
    const thDisplay = window.getComputedStyle(th).display; // Dapatkan style display <th>

    // Cari semua <td> di dalam <tr> dengan id yang sesuai
    const tdElements = document.querySelectorAll(`td#${id}`);

    // Sesuaikan display <td> berdasarkan <th>
    tdElements.forEach((td) => {
      td.style.display = thDisplay; // Atur display <td> sesuai <th>
    });
  });
}

syncDisplay();

  return (
    <div>
      <Container>
        <div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <div className="w-full sm:w-60">
            <TextField
              placeholder="Search"
              icon={<CiSearch />}
              onChange={doSearch}
            />
          </div>
          <Button onClick={() => onAdd()}>
            <div className="flex items-center gap-2">
              <FaPlus /> Tambah Surat
            </div>
          </Button>
        </div>

        {getTugasLoading ? ( // Show loading indicator if loading is true
          <div className="flex justify-center py-4">
            <PulseLoading />
          </div>
        ) : (
          <Tables>
            <Tables.Head>
              <tr>
                <Tables.Header>No</Tables.Header>
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
                            onClick={() => {
                              setPrintPDF(i), handlePrint();
                            }}
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
        <div ref={contentRef} className="print-only">
          {dataWithIndex[0] && (
            <div
            dangerouslySetInnerHTML={{
              __html: dataWithIndex[0]?.isi
                ?.replace(
                  /\{nama_pemohon\}/g,
                  dataWithIndex[0]?.pemohon?.nama
                    ?.split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    )
                    .join(" ") || "Tidak ada pemohon"
                )
                .replace(
                  /\{jabatan_pemohon\}/g,
                  dataWithIndex[0]?.pemohon?.jabatan || "Tidak ada jabatan"
                )
                .replace(
                  /\{departement_pemohon\}/g,
                  dataWithIndex[0]?.pemohon?.departemen || "Tidak ada departemen"
                )
                .replace(
                  /\{divisi_pemohon\}/g,
                  dataWithIndex[0]?.pemohon?.divisi || "Tidak ada divisi"
                )
                .replace(
                  /\{unit_pemohon\}/g,
                  dataWithIndex[0]?.pemohon?.unit || "Tidak ada unit"
                )
                .replace(
                  /<tbody>\s*.*?<\/tbody>/,
                  `
                  <tbody>
                    ${dataWithIndex[0]?.penerima
                      ?.map(
                        (item, index) => `
                          <tr>
                            <td>${index + 1}</td>
                            <td>${item.nama
                              ?.split(" ")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() +
                                  word.slice(1).toLowerCase()
                              )
                              .join(" ") || "Tidak ada nama"}</td>
                            <td id="table_jabatan" style="display: none;">
                              ${item.jabatan || "Tidak ada jabatan"}
                            </td>
                            <td id="table_departement" style="display: none;">
                              ${item.departemen || "Tidak ada departemen"}
                            </td>
                            <td id="table_divisi" style="display: none;">
                              ${item.divisi || "Tidak ada divisi"}
                            </td>
                            <td id="table_unit" style="display: none;">
                              ${item.unit || "Tidak ada unit"}
                            </td>
                          </tr>`
                      )
                      .join("")}
                  </tbody>
                  `
                ),
            }}
          />          
          )}
        </div>

        <div className="flex justify-end items-center mt-4">
          <Pagination
            totalCount={getTugasResult.count || 0} // Dynamic total count
            pageSize={limit} // Use current limit for page size
            currentPage={pageActive + 1} // Adjust for zero-indexed pages
            onPageChange={handlePageClick} // Handle page changes
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
}
