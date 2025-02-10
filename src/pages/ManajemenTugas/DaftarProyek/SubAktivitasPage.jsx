import { getData } from "@/actions";
import { Limit, Loading, Pagination } from "@/components";
import { API_URL_subtodotask, baseurl } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { subTodoTaskReducer } from "@/reducers/subTodoTaskReducers";
import { toQueryString } from "@/utils/toQueryString";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const SubAktivitasPage = () => {
  const { getSubTodoTaskResult, getSubTodoTaskLoading, getSubTodoTaskError } =
    useSelector((state) => state.subtodotask);

  const dispatch = useDispatch();
  const { state } = useLocation();

  const { selectedPerusahaan } = useAuth();

  const [limit, setLimit] = useState(state?.fetch?.limit || 10);
  const [pageActive, setPageActive] = useState(
    state?.fetch?.offset ? Math.ceil(state?.fetch?.offset / limit) + 1 : 1
  );

  const handlePageClick = (e) => {
    const offset = (e - 1) * limit;
    const param = {};
    param.offset = offset;
    param.limit = limit;
    get(param);
    setPageActive(e);
  };

  const handleSelect = (e) => {
    const param = {};
    param.limit = e;
    get(param);
    setLimit(e);
    setPageActive(1);
  };

  const get = useCallback(
    async (param) => {
      const queryString = toQueryString(param);
      const fullUrl = `${API_URL_subtodotask}?${queryString}`;

      getData(
        { dispatch, redux: subTodoTaskReducer },
        "",
        fullUrl,
        "GET_SUBTODOTASK"
      );
    },
    [dispatch]
  );

  const fetchData = useCallback(
    async (param) => {
      let params = { ...param };
      const fetch = state?.fetch;

      if (fetch?.limit) {
        params.limit = fetch.limit;
      }
      if (fetch?.offset) {
        params.offset = fetch.offset;
      }
      if (fetch?.perusahaan) {
        params.perusahaan = fetch.perusahaan;
      }

      get(params);
    },
    [get] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    fetchData({ limit, perusahaan: selectedPerusahaan?.value });
  }, [selectedPerusahaan]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative bg-white dark:bg-base-600 w-full shadow-lg rounded-md h-[500px] overflow-hidden">
      <div className="px-4 h-14 flex items-center border-b sticky top-0 bg-white dark:bg-base-600 dark:border-base-400">
        Riwayat Aktivitas
      </div>
      <div
        style={{
          height: "calc(100% - 120px)",
        }}
        className="overflow-y-auto"
      >
        {getSubTodoTaskLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loading loading />
          </div>
        ) : getSubTodoTaskResult?.count > 0 ? (
          getSubTodoTaskResult?.results?.map((item, index) => (
            <div
              key={index}
              className="h-fit border-b dark:border-base-400 p-4"
            >
              <div className="flex flex-row justify-between gap-2 mb-1">
                <div className="flex flex-row gap-2">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={baseurl + item?.createdby_details?.image}
                  />

                  <div>
                    <div className="font-medium text-sm mb-0.5">
                      {item?.createdby_details?.first_name}
                    </div>
                    <div className="text-xs bg-violet-200 text-base-400 p-1 px-2 rounded">
                      To do : {item?.todotask_details?.title}
                    </div>
                  </div>
                </div>

                <div className="text-sm">
                  {moment(item?.created_at).format("DD MMMM YYYY, HH:mm")}
                </div>
              </div>
              <div className="text-sm">{item?.title}</div>
            </div>
          ))
        ) : getSubTodoTaskError ? (
          <div className="h-full flex items-center justify-center text-red-500">
            {getSubTodoTaskError}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            Data Tidak Ditemukan
          </div>
        )}
      </div>

      {/* Control Bottom */}
      <div className="sticky bottom-0 border-t bg-white dark:bg-base-600 dark:border-base-400 h-16 px-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
        <div className="flex gap-2 items-baseline text-sm">
          <Limit limit={limit} setLimit={setLimit} onChange={handleSelect} />
          {getSubTodoTaskResult?.count || 0} entries
        </div>

        <Pagination
          totalCount={getSubTodoTaskResult?.count || 0}
          onPageChange={handlePageClick}
          currentPage={pageActive}
          pageSize={limit}
        />
      </div>
    </div>
  );
};

export default SubAktivitasPage;
