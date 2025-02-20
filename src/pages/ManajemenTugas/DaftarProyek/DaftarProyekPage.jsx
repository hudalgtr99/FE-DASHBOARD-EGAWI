import { getData } from "@/actions";
import { API_URL_task } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { taskReducer } from "@/reducers/taskReducers";
import { useCallback, useEffect, useState } from "react";
import { TbInfoCircle } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import DaftarProyekTable from "./DaftarProyekTable";
import { toQueryString } from "@/utils/toQueryString";

const DaftarProyekPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  const { selectedPerusahaan } = useAuth();

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
    navigate("/manajemen-tugas/daftar-proyek/form");
  };

  const handleView = (item) => {
    navigate(`/manajemen-tugas/daftar-proyek/detail`, {
      state: item,
    });
  };

  const get = useCallback(
    async (param) => {
      const queryString = toQueryString(param);
      const fullUrl = `${API_URL_task}?${queryString}`;

      await getData({ dispatch, redux: taskReducer }, "", fullUrl, "GET_TASK");
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
      console.log("ini params ->", params);
      get(params);
    },
    [get] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    fetchData({ limit, perusahaan: selectedPerusahaan?.value });
  }, [selectedPerusahaan]); // eslint-disable-line react-hooks/exhaustive-deps

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
      name: "Detail",
      color: "info",
      icon: <TbInfoCircle className="text-xl" />,
      func: handleView,
      show: true,
    },
  ]);

  return (
    <>
      <DaftarProyekTable
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
    </>
  );
};

export default DaftarProyekPage;
