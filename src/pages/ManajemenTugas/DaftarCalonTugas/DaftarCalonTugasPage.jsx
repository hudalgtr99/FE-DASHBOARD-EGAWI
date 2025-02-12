import { useCallback, useContext, useEffect, useState } from "react";
import DaftarCalonTugasTable from "./DaftarCalonTugasTable";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getData } from "@/actions";
import { API_URL_delegation } from "@/constants";
import { delegationReducer } from "@/reducers/delegationReducers";
import { TbEye, TbPencil } from "react-icons/tb";
import { Modal } from "@/components";
import { AuthContext, useAuth } from "@/context/AuthContext";
import { toQueryString } from "@/utils/toQueryString";

const DaftarCalonTugasPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const { jwt } = useContext(AuthContext);
  const { selectedPerusahaan } = useAuth();

  const [delegations, setDelegations] = useState(null);

  const [modal, setModal] = useState(false);
  const [firstFetch, setFirstFetch] = useState(false);
  const [limit, setLimit] = useState(state?.fetch?.limit || 10);
  const [pageActive, setPageActive] = useState(
    state?.fetch?.offset ? Math.ceil(state?.fetch?.offset / limit) + 1 : 1
  );
  const [search, setSearch] = useState(state?.fetch?.search || "");

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    setLimit(10);
    setPageActive(1);
  };

  const handlePageClick = (e) => {
    const offset = (e - 1) * limit;
    const param = {};
    if (search !== "") {
      param.search = search;
    }
    param.offset = offset;
    param.limit = limit;
    get(param);
    setPageActive(e);
  };

  const handleSelect = (e) => {
    const param = {};
    if (search !== "") {
      param.search = search;
    }
    param.limit = e;
    get(param);
    setLimit(e);
    setPageActive(1);
  };

  const handleAdd = () => {
    navigate("/manajemen-tugas/daftar-calon-tugas/form");
  };

  const handleView = (item) => {
    setModal(true);
    setDelegations(item);
  };

  const handleEdit = (item) => {
    navigate("/manajemen-tugas/daftar-calon-tugas/form", {
      state: item,
    });
  };

  const get = useCallback(
    async (param) => {
      const queryString = toQueryString(param);
      const fullUrl = `${API_URL_delegation}?${queryString}`;

      getData(
        { dispatch, redux: delegationReducer },
        "",
        fullUrl,
        "GET_DELEGATION"
      );
    },
    [dispatch] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const fetchData = useCallback(
    async (param) => {
      let params = { ...param };
      const fetch = state?.fetch;

      if (fetch?.search) {
        params.search = fetch.search;
      }
      if (fetch?.limit) {
        params.limit = fetch.limit;
      }
      if (fetch?.offset) {
        params.offset = fetch.offset;
      }
      if (fetch?.perusahaan) {
        params.perusahaan = fetch.perusahaan;
      }

      setFirstFetch(true);
      get(params);
    },
    [get] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    fetchData({ limit, perusahaan: selectedPerusahaan?.value });
  }, [selectedPerusahaan]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData({ limit, perusahaan: selectedPerusahaan?.value });
  }, []);

  useEffect(() => {
    if (firstFetch) {
      const getData = setTimeout(() => {
        get({ search: search });
      }, 500);
      return () => clearTimeout(getData);
    }
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  const [action] = useState([
    {
      name: "Show",
      color: "info",
      icon: <TbEye className="text-xl" />,
      func: handleView,
      show: true,
    },
    {
      name: "Edit",
      color: "warning",
      icon: <TbPencil className="text-xl" />,
      func: handleEdit,
      show: true,
    },
  ]);

  return (
    <>
      <DaftarCalonTugasTable
        handleSearch={handleSearch}
        handlePageClick={handlePageClick}
        handleSelect={handleSelect}
        limit={limit}
        setLimit={setLimit}
        pageActive={pageActive}
        action={action}
        search={search}
        handleAdd={handleAdd}
      />

      <Modal
        show={modal}
        setShow={setModal}
        width="md"
        btnClose={true}
        persistent={false}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Detail Calon Tugas
          </h2>

          <ul className="space-y-2">
            {jwt?.level === "Super Admin" && (
              <li className="flex justify-between">
                <span className="font-medium">Perusahaan:</span>
                <span>{delegations?.company_name}</span>
              </li>
            )}
            <li className="flex justify-between">
              <span className="font-medium">Nama:</span>
              <span>{delegations?.createdbydetail?.first_name}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">ID Pegawai:</span>
              <span>{delegations?.id_pegawai}</span>
            </li>
            <li className="flex justify-between">
              <span className="font-medium">Jabatan:</span>
              <span>{delegations?.jabatan_pegawai}</span>
            </li>
          </ul>
          <div className="mt-4">
            <div className="font-medium mb-2">
              Departemen Yang Akan Ditunjukan:
            </div>
            <div className="space-y-2">
              {delegations?.departemen_details &&
                delegations?.departemen_details.map((value, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-gray-100 dark:bg-gray-300 rounded-md transition duration-200"
                  >
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                        <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 110-8 4 4 0 010 8z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-gray-800 dark:text-gray-200">
                      {value?.departemen?.nama}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DaftarCalonTugasPage;
