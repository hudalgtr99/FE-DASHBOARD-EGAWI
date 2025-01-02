import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getData } from "@/actions";
import { pengajuanIzinReducer } from "@/reducers/asesmenReducers";
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
import { API_URL_lembur, baseurl } from "../../../../constants";
import { lemburReducer } from "@/reducers/lemburReducers";
import SelectMonthYear from "../../../../components/atoms/SelectMonthYear";
import getFileIcon from "../../../../utils/getFileIcon";

const ValidasiLemburSub = ({ type }) => {
  const { getLemburResult, addLemburResult } = useSelector(
    (state) => state.lembur
  );
  const dispatch = useDispatch();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(null);
  const [offset, setOffset] = useState(0);
  const [showModalApproved, setShowModalApproved] = useState(false);
  const [showModalReject, setShowModalReject] = useState(false);
  const [showModalFile, setShowModalFile] = useState(false);
  const [file, setFile] = useState("");
  const [catatanDisetujui, setCatatanDisetujui] = useState("");
  const [catatanDitolak, setCatatanDitolak] = useState("");
  const [detail, setDetail] = useState("");
  const [jwt, setJwt] = useState({});

  const onTerima = (item) => {
    setDetail(item);
    setShowModalApproved(true);
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
        { dispatch, redux: lemburReducer },
        queryParams,
        API_URL_lembur,
        "GET_LEMBUR"
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
    [filter, limit, get, type, addLemburResult]
  );

  const clearFormModalHandle = () => {
    setCatatanDisetujui("");
    setCatatanDitolak("");
    setDetail("");
    setShowModalReject(false);
    setShowModalApproved(false);
  };

  const approvedHandle = async () => {
    const formData = new FormData();
    formData.append("id", detail?.id);
    formData.append("note", catatanDisetujui);
    formData.append("status", 1);
    try {
      const data = updateFormData(
        { dispatch, redux: lemburReducer },
        formData,
        API_URL_lembur,
        "ADD_LEMBUR",
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
        { dispatch, redux: lemburReducer },
        formData,
        API_URL_lembur,
        "ADD_LEMBUR",
        detail?.id
      );
    } catch (e) {
      console.log(e);
    }
    clearFormModalHandle();
  };

  const [actions] = useState([
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
  }, [filter, limit, type, addLemburResult]);

  const dataWithIndex = getLemburResult?.results?.length
    ? getLemburResult.results.map((item, index) => ({
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
          <div className="w-full flex flex-row gap-4 sm:w-[25rem]">
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
              <Tables.Header>Tanggal Pengajuan</Tables.Header>
              <Tables.Header>Nama</Tables.Header>
              <Tables.Header>Judul Lembur</Tables.Header>
              <Tables.Header>Deskripsi Lembur</Tables.Header>
              <Tables.Header>Catatan</Tables.Header>
              <Tables.Header>File</Tables.Header>
              {type === "validasi_lembur" && (
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
                  <Tables.Data>{item?.note}</Tables.Data>
                  <Tables.Data>
                    <button
                      title="Klik untuk pratinjau"
                      onClick={() => handlePreviewFile(item?.file)}
                    >
                      {isImage(item?.file) ? (
                        <img
                          src={`${baseurl}${item?.file}`}
                          alt={item?.file}
                          className="rounded"
                          style={{ width: "auto", height: 40 }}
                        />
                      ) : (
                        <div className="flex justify-start">
                          {getFileIcon(item?.file)}
                        </div>
                      )}
                    </button>
                  </Tables.Data>
                  {type === "validasi_lembur" && (
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
            totalCount={getLemburResult.count}
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
          <div className="mb-3 font-semibold">Catatan Disetujui </div>
          <TextField
            required
            type="text"
            placeholder="Tuliskan catatan disetujuinya ..."
            value={catatanDisetujui}
            onChange={(e) => setCatatanDisetujui(e.target.value)}
          />
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

export default ValidasiLemburSub;
