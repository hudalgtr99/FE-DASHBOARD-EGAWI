import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getData } from "@/actions";
import { icons } from "../../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  TextField,
  Tooltip,
} from "@/components";
import { CiSearch } from "react-icons/ci";
import moment from "moment";
import { Modal, Select } from "../../../../components";
import { updateFormData } from "../../../../actions";
import { isAuthenticated } from "../../../../authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../../context/AuthContext";
import { API_URL_reimbursement, baseurl } from "../../../../constants";
import { reimbursementReducer } from "@/reducers/reimbursementReducers";
import SelectMonthYear from "../../../../components/atoms/SelectMonthYear";
import { AiFillFilePdf } from "react-icons/ai";
import getFileIcon from "../../../../utils/getFileIcon";
import formatRupiah from "../../../../utils/formatRupiah";
import path from "path-browserify";

const ValidasiReimbursementSub = ({ type }) => {
  const { getReimbursementResult, addReimbursementResult } = useSelector(
    (state) => state.reimbursement
  );
  const dispatch = useDispatch();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(null);
  const [offset, setOffset] = useState(0);
  const [showModalApproved, setShowModalApproved] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModalReject, setShowModalReject] = useState(false);
  const [showModalFile, setShowModalFile] = useState(false);
  const [file, setFile] = useState("");
  const [catatanDisetujui, setCatatanDisetujui] = useState("");
  const [catatanDitolak, setCatatanDitolak] = useState("");
  const [methodPayment, setMethodPayment] = useState("");
  const [detail, setDetail] = useState("");
  const [jwt, setJwt] = useState({});
  const options = [
    { value: 1, label: "Bayar Langsung" },
    { value: 2, label: "Transfer" },
    { value: 3, label: "Melalui Gaji" },
  ];

  const onTerima = (item) => {
    setDetail(item);
    setShowModalApproved(true);
  };

  const onDetail = (item) => {
    setDetail(item);
    setShowModalDetail(true);
  };

  const onTolak = (item) => {
    setDetail(item);
    setShowModalReject(true);
  };

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    setLimit(10);
    setPageActive(0);
    get({
      param:
        "?search=" +
        value +
        "&date-month=" +
        filter +
        "&type=" +
        type +
        "&perusahaan=" +
        selectedPerusahaan?.value,
    });
  };

  const handleFilterDate = (newFilter) => {
    let dateFilter = newFilter;
    if (newFilter === "YYYY-MM") {
      dateFilter = null;
    }
    const param =
      search === ""
        ? {
            param:
              "?date-month=" +
              dateFilter +
              "&limit=" +
              limit +
              "&type=" +
              type +
              "&perusahaan=" +
              selectedPerusahaan,
          }
        : {
            param:
              "?search=" +
              search +
              "&date-month=" +
              dateFilter +
              "&limit=" +
              limit +
              "&type=" +
              type +
              "&perusahaan=" +
              selectedPerusahaan,
          };
    setFilter(dateFilter);
    get(param);
  };

  const get = useCallback(
    async (param) => {
      // Ensure the default values for search and status
      const queryParams = {
        search: search || "",
        status: "1", // Default to status 1 if not provided
        ...param,
      };

      getData(
        { dispatch, redux: reimbursementReducer },
        queryParams,
        API_URL_reimbursement,
        "GET_REIMBURSEMENT"
      );
    },
    [dispatch, search]
  );

  const handlePageClick = (page) => {
    const offset = (page - 1) * limit;

    const param =
      search === ""
        ? {
            param:
              "?date-month=" +
              filter +
              "&limit=" +
              limit +
              "&offset=" +
              offset +
              "&type=" +
              type +
              "&perusahaan=" +
              selectedPerusahaan?.value,
          }
        : {
            param:
              "?search=" +
              search +
              "&date-month=" +
              filter +
              "&limit=" +
              limit +
              "&offset=" +
              offset +
              "&type=" +
              type +
              "&perusahaan=" +
              selectedPerusahaan?.value,
          };

    get(param);
    setOffset(offset);
    setPageActive(page - 1);
  };

  const isImage = (fileName) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const fileExtension = fileName?.split(".").pop().toLowerCase(); // Mendapatkan ekstensi
    return imageExtensions.includes(fileExtension);
  };

  // Fungsi untuk menangani pratinjau file
  const handlePreviewFile = (fileName) => {
    const fileUrl = `${baseurl}${fileName}`;
    setFile(fileUrl);
    setShowModalFile(true);
  };

  const handleSelect = (selectedOption) => {
    setSelectedPerusahaan(selectedOption);
    const offset = pageActive * limit;

    // Menyiapkan parameter pencarian dan perusahaan
    const param = {
      param: `?search=${search || ""}&perusahaan=${
        selectedOption?.value || ""
      }&limit=${limit}&offset=${offset}&type=${type}&date-month=${filter}`,
    };

    get(param);
    setPageActive(0);
  };

  const fetchData = useCallback(
    async (param = false) => {
      // Fetch data only when the filter and limit are valid
      get(
        param
          ? param
          : {
              param:
                "?date-month=" +
                filter +
                "&limit=" +
                limit +
                "&type=" +
                type +
                "&perusahaan=" +
                selectedPerusahaan?.value,
            }
      );
    },
    [filter, limit, get, type, addReimbursementResult]
  );

  const clearFormModalHandle = () => {
    setCatatanDisetujui("");
    setCatatanDitolak("");
    setDetail("");
    setShowModalReject(false);
    setShowModalApproved(false);
    setMethodPayment(0);
  };

  const approvedHandle = async () => {
    const formData = new FormData();
    formData.append("id", detail?.id);
    formData.append("note", catatanDisetujui);
    formData.append("status", 1);
    formData.append("method_payment", methodPayment);
    try {
      const data = updateFormData(
        { dispatch, redux: reimbursementReducer },
        formData,
        API_URL_reimbursement,
        "ADD_REIMBURSEMENT",
        detail?.id
      );
    } catch (e) {
      console.log(e);
    }
    clearFormModalHandle();
  };

  const rejectHandle = () => {
    const formData = new FormData();
    formData.append("id", detail?.id);
    formData.append("note", catatanDitolak);
    formData.append("status", 2);
    try {
      const data = updateFormData(
        { dispatch, redux: reimbursementReducer },
        formData,
        API_URL_reimbursement,
        "ADD_REIMBURSEMENT",
        detail?.id
      );
    } catch (e) {
      console.log(e);
    }
    clearFormModalHandle();
  };

  const [actions] = useState([
    {
      name: "detail",
      icon: icons.aifilleye,
      color: "primary",
      func: onDetail,
    },
    {
      name: "terima",
      icon: icons.mdcheckcircle,
      color: "success",
      func: onTerima,
    },
    {
      name: "tolak",
      icon: icons.riclosecirclefill,
      color: "danger",
      func: onTolak,
    },
  ]);

  useEffect(() => {
    if (type && limit > 0) {
      fetchData();
    }
  }, [filter, limit, type, addReimbursementResult]);

  const dataWithIndex = getReimbursementResult?.results?.length
    ? getReimbursementResult.results.map((item, index) => ({
        ...item,
        index: pageActive * limit + index + 1,
      }))
    : [];

  const { perusahaan, loadingPerusahaan } = useAuth();
  const [perusahaanOptions, setperusahaanOptions] = useState([]);
  const { slug } = useParams();
  const [selectedPerusahaan, setSelectedPerusahaan] = useState(null);

  useEffect(() => {
    if (!loadingPerusahaan) {
      const options = perusahaan.map((opt) => ({
        value: opt.slug,
        label: opt.nama,
      }));
      setperusahaanOptions(options);
      setSelectedPerusahaan(options.find((opt) => opt?.value === slug) || "");
    }
  }, [loadingPerusahaan]);

  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, []);

  return (
    <div>
      <Container>
        <div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <div className="w-full flex flex-row flex-wrap sm:flex-nowrap gap-4 sm:w-[25rem]">
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
          <div className="w-full sm:w-60">
            <SelectMonthYear onChange={(date) => handleFilterDate(date)} />
          </div>
        </div>
        <Tables>
          <Tables.Head>
            <tr>
              <Tables.Header>No</Tables.Header>
              <Tables.Header>Tanggal</Tables.Header>
              <Tables.Header>Nama</Tables.Header>
              <Tables.Header>Judul</Tables.Header>
              <Tables.Header>Deskripsi</Tables.Header>
              <Tables.Header>Jumlah</Tables.Header>
              {type !== "validasi_reimbursement" && (
                <Tables.Header>Catatan</Tables.Header>
              )}
              <Tables.Header>File</Tables.Header>
              {type === "validasi_reimbursement" && (
                <Tables.Header center>Actions</Tables.Header>
              )}
            </tr>
          </Tables.Head>
          <Tables.Body>
            {dataWithIndex.length > 0 ? (
              dataWithIndex.map((item) => (
                <Tables.Row key={item?.pk}>
                  <Tables.Data>{item?.index}</Tables.Data>
                  <Tables.Data>
                    {moment(item?.created_at).format("DD-MM-YYYY")}
                  </Tables.Data>
                  <Tables.Data>{item?.employee_detail?.first_name}</Tables.Data>
                  <Tables.Data>{item?.title}</Tables.Data>
                  <Tables.Data>{item?.description}</Tables.Data>
                  <Tables.Data>{formatRupiah(item?.amount)}</Tables.Data>
                  {type !== "validasi_reimbursement" && (
                    <Tables.Data>{item?.note ? item?.note : "-"}</Tables.Data>
                  )}
                  <Tables.Data>
                    {Array.isArray(item?.reimbursement_files) &&
                    item?.reimbursement_files.length > 0 ? (
                      <div className="flex flex-col justify-start gap-2">
                        {item?.reimbursement_files?.map((val, i) => (
                          <button
                            key={i}
                            className="flex justify-start"
                            title="Klik untuk pratinjau"
                            onClick={() => handlePreviewFile(val?.file)}
                          >
                            {isImage(val?.file) ? (
                              <img
                                src={`${baseurl}${val?.file}`}
                                alt={val?.file}
                                className="rounded"
                                style={{ width: "auto", height: 40 }}
                              />
                            ) : (
                              <div className="flex justify-start">
                                {getFileIcon(val?.file)}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <>Tidak Ada File</>
                    )}
                  </Tables.Data>
                  {type === "validasi_reimbursement" && (
                    <Tables.Data center>
                      <div className="flex items-center justify-center gap-2">
                        {actions.map((action) => (
                          <Tooltip key={action.name} tooltip={action.name}>
                            <Button
                              size={30}
                              variant="tonal"
                              color={action.color}
                              onClick={() => action.func(item)}
                              className={`cursor-pointer`}
                            >
                              {action.icon}
                            </Button>
                          </Tooltip>
                        ))}
                      </div>
                    </Tables.Data>
                  )}
                  {type !== "validasi_reimbursement" && (
                    <Tables.Data center>
                      <div className="flex items-center justify-center gap-2">
                        {actions
                          .filter((action) => action.name === "detail")
                          .map((action) => (
                            <Tooltip key={action.name} tooltip={action.name}>
                              <Button
                                size={30}
                                variant="tonal"
                                color={action.color}
                                onClick={() => action.func(item)} // Pastikan item sesuai konteks map utama
                                className="cursor-pointer"
                              >
                                {action.icon}
                              </Button>
                            </Tooltip>
                          ))}
                      </div>
                    </Tables.Data>
                  )}
                </Tables.Row>
              ))
            ) : (
              <Tables.Row>
                <Tables.Data colspan={11} center>
                  No Data Available
                </Tables.Data>
              </Tables.Row>
            )}
          </Tables.Body>
        </Tables>
        <div className="flex justify-between items-center mt-4">
          <Pagination
            totalCount={getReimbursementResult.count}
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

      {/* Modal Approved  */}
      <Modal
        show={showModalApproved}
        setShow={setShowModalApproved}
        width="md"
        btnClose={true}
        persistent={false}
      >
        <div className="text-lg font-normal p-5">
          <div className="mb-4">
            <div className="mb-3 font-medium">Catatan Disetujui </div>
            <TextField
              required
              type="text"
              placeholder="Tuliskan catatan disetujuinya ..."
              value={catatanDisetujui}
              onChange={(e) => setCatatanDisetujui(e.target.value)}
            />
          </div>
          <div className="h-[8rem]">
            <div className="mb-3 font-medium">Metode Pembayaran </div>
            <Select
              placeholder="Pilih Metode Pembayaran"
              options={options}
              value={options.filter((item) => item.value === methodPayment)}
              onChange={({ value }) => {
                setMethodPayment(value);
              }}
            />
          </div>

          <div className="flex flex-row justify-end gap-5 mt-4">
            <Button color="base" onClick={() => setShowModalApproved(false)}>
              Cancel
            </Button>
            <Button onClick={() => approvedHandle()}>Approve</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Reject  */}
      <Modal
        show={showModalReject}
        setShow={setShowModalReject}
        width="md"
        btnClose={true}
        persistent={false}
      >
        <div className="text-lg font-normal p-5">
          <div className="mb-3 font-semibold">Catatan Ditolak </div>
          <TextField
            type="text"
            placeholder="Tuliskan catatan ditolaknya ..."
            value={catatanDitolak}
            onChange={(e) => setCatatanDitolak(e.target.value)}
          />
          <div className="flex flex-row justify-end gap-5 mt-4">
            <Button color="base" onClick={() => setShowModalReject(false)}>
              Cancel
            </Button>
            <Button color="danger" onClick={() => rejectHandle()}>
              Reject
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Detail  */}
      <Modal
        show={showModalDetail}
        setShow={setShowModalDetail}
        width="md"
        btnClose={true}
        persistent={false}
      >
        <div className="p-6 bg-white rounded-lg shadow-lg">
          {detail ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                Detail Reimbursement
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Nama:</span>
                  <span className="text-gray-800 font-semibold">
                    {detail.employee_detail?.first_name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Judul:</span>
                  <span className="text-gray-800 font-semibold">
                    {detail.title}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Deskripsi:</span>
                  <span className="text-gray-800 font-semibold">
                    {detail.description}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Jumlah:</span>
                  <span className="text-green-600 font-semibold">
                    {formatRupiah(detail.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">
                    Tanggal Dibuat:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {moment(detail.created_at).format("DD-MMMM-YYYY HH:mm")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">
                    Keputusan dari :
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {detail.decision_detail?.first_name
                      ? detail.decision_detail?.first_name
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">
                    Tanggal Keputusan:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {detail.decision_at
                      ? moment(detail.decision_at).format("DD-MMMM-YYYY HH:mm")
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${
                      detail.status_display === "Disetujui"
                        ? "bg-green-500"
                        : detail.status_display === "Validasi"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {detail.status_display ? detail.status_display : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">
                    Metode Pembayaran:
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {detail.method_payment_display
                      ? detail.method_payment_display
                      : "-"}
                  </span>
                </div>
                <div className="text-gray-500 font-medium">Lampiran</div>
                <div className="flex flex-col items-center">
                  {Array.isArray(detail?.reimbursement_files) &&
                  detail?.reimbursement_files.length > 0 ? (
                    <div className="flex flex-col justify-start gap-2">
                      {detail?.reimbursement_files?.map((val, i) => (
                        <button
                          key={i}
                          className="flex justify-start"
                          title="Klik untuk pratinjau"
                          onClick={() => handlePreviewFile(val?.file)}
                        >
                          {isImage(val?.file) ? (
                            <img
                              src={`${baseurl}${val?.file}`}
                              alt={val?.file}
                              className="rounded"
                              style={{ width: "auto", height: 300 }}
                            />
                          ) : (
                            <div className="mx-auto">
                              <div className="flex justify-center my-4">
                                {getFileIcon(val?.file, 50)}
                              </div>
                              <div>{val?.file && path.basename(val?.file)}</div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>Tidak Ada File</>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  color="base"
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600"
                  onClick={() => setShowModalDetail(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">Data tidak ditemukan.</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal View */}
      <Modal
        show={showModalFile}
        setShow={setShowModalFile}
        width="xl"
        btnClose={true}
        persistent={false}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          {isImage(file) ? (
            // Tampilkan gambar jika file adalah gambar
            <img
              src={file}
              alt={file}
              style={{
                width: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            // Tampilkan iframe jika file adalah PDF
            <iframe
              src={file}
              title={file}
              style={{ width: "100%", height: "500px", border: "none" }}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ValidasiReimbursementSub;
