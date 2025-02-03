import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { deleteData, getData } from "@/actions";
import { jabatanReducers } from "@/reducers/strataReducers";
import { API_URL_edeljabatan, API_URL_getjabatan } from "@/constants";
import {
  Button,
  Container,
  Pagination,
  Tables,
  TextField,
  Tooltip,
  PulseLoading,
} from "@/components";
import { debounce } from "lodash";
import { FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/AuthContext";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { encodeURL, encrypted } from "../../../actions";
import encBase64url from "crypto-js/enc-base64url";
import { TbMessageCircleQuestion, TbQuestionMark } from "react-icons/tb";
import { FaCircleQuestion } from "react-icons/fa6";
import KewenanganModal from "../../../components/molecules/KewenanganModal";

const JabatanSub = () => {
  const {
    getJabatanResult,
    getJabatanLoading,
    addJabatanResult,
    addPangkatResult,
    deleteJabatanResult,
    deletePangkatResult,
  } = useSelector((state) => state.strata);

  const { slug } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [showKewenanganModal, setShowKewenanganModal] = useState(false);
  const [search, setSearch] = useState("");
  const { selectedPerusahaan, loadingPerusahaan } = useAuth();
  const [jwt, setJwt] = useState({});

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
    }, 1000),
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
    navigate("/masterdata/jabatan/form", {
      state: {
        item,
      },
    });
  };

  const onEdit = (item) => {
    sessionStorage.setItem("url", location.pathname);

    navigate(`/masterdata/jabatan/form/${encodeURL(encrypted(item?.pk))}`, {
      state: {
        item,
      },
    });
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: jabatanReducers },
      item.pk,
      API_URL_edeljabatan,
      "DELETE_JABATAN"
    );
  };

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: jabatanReducers },
        param,
        API_URL_getjabatan,
        "GET_JABATAN"
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

  const [actions] = useState([
    {
      name: "Edit",
      icon: <LuPencil />,
      color: "success",
      func: onEdit,
    },
    {
      name: "Delete",
      icon: <LuTrash2 />,
      color: "danger",
      func: doDelete,
    },
  ]);

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
    if (
      addJabatanResult ||
      addPangkatResult ||
      deleteJabatanResult ||
      deletePangkatResult
    ) {
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
    addJabatanResult,
    addPangkatResult,
    deleteJabatanResult,
    deletePangkatResult,
    search,
    limit,
    pageActive,
    get,
  ]);

  const dataWithIndex = getJabatanResult.results
    ? getJabatanResult.results.map((item, index) => ({
        ...item,
        index: pageActive * limit + index + 1,
      }))
    : [];

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
          <Button onClick={onAdd}>
            <div className="flex items-center gap-2">
              <FaPlus /> Tambah Jabatan
            </div>
          </Button>
        </div>

        {getJabatanLoading ? ( // Show loading indicator if loading
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
                <Tables.Header>Nama Jabatan</Tables.Header>
                <Tables.Header>
                  <button
                    className="flex flex-row gap-2 items-center"
                    onClick={() => setShowKewenanganModal(!showKewenanganModal)}
                  >
                    Tingkat Kewenangan{" "}
                    <FaCircleQuestion size={15} color="orange" />
                  </button>
                </Tables.Header>
                {/* <Tables.Header>Keterangan</Tables.Header> */}
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {dataWithIndex.length > 0 ? (
                dataWithIndex.map((item) => (
                  <Tables.Row key={item?.pk}>
                    <Tables.Data>{item?.index}</Tables.Data>
                    {!jwt.perusahaan && (
                      <Tables.Data>
                        {(item?.perusahaan && item?.perusahaan?.nama) || "-"}
                      </Tables.Data>
                    )}
                    <Tables.Data>{item?.nama}</Tables.Data>
                    <Tables.Data>{item?.level_display} </Tables.Data>
                    {/* <Tables.Data>{item?.keterangan}</Tables.Data> */}
                    <Tables.Data center>
                      <div className="flex items-center justify-center gap-2">
                        {actions.map((action) => (
                          <Tooltip key={action.name} tooltip={action.name}>
                            <Button
                              size={30}
                              variant="tonal"
                              color={action.color}
                              key={action.name}
                              onClick={() => action.func(item)}
                              className={`${action.color} cursor-pointer`}
                            >
                              {action.icon}
                            </Button>
                          </Tooltip>
                        ))}
                      </div>
                    </Tables.Data>
                  </Tables.Row>
                ))
              ) : (
                <Tables.Row>
                  <td className="text-center" colSpan="5">
                    <p>Tidak ada data yang tersedia</p>
                  </td>
                </Tables.Row>
              )}
            </Tables.Body>
          </Tables>
        )}

        <div className="flex justify-end items-center mt-4">
          <Pagination
            totalCount={getJabatanResult.count} // Total items count from the API result
            pageSize={limit} // Items per page (limit)
            currentPage={pageActive + 1} // Current page
            onPageChange={handlePageClick} // Page change handler
            siblingCount={1} // Number of sibling pages (adjust as needed)
            activeColor="primary" // Optional: active page color
            rounded="md" // Optional: rounded button style
            variant="flat" // Optional: button variant
            size="md" // Optional: button size
          />
        </div>
      </Container>
      <KewenanganModal
        showModal={showKewenanganModal}
        setShowModal={setShowKewenanganModal}
      />
    </div>
  );
};

export default JabatanSub;
