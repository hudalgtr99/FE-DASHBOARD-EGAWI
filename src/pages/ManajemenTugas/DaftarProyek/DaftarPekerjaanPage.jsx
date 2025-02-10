import { getData } from "@/actions";
import { Chip, Limit, Loading, Pagination } from "@/components";
import { API_URL_todotask } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { todoTaskReducer } from "@/reducers/todoTaskReducers";
import { toQueryString } from "@/utils/toQueryString";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { TbFile } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const DaftarPekerjaanPage = () => {
  const { getTodoTaskResult, getTodoTaskLoading, getTodoTaskError } =
    useSelector((state) => state.todotask);

  console.log(getTodoTaskResult);

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

  const dispatch = useDispatch();
  const { state } = useLocation();

  const { selectedPerusahaan } = useAuth();

  const [openPekerjaan, setOpenPekerjaan] = useState("");

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
      const fullUrl = `${API_URL_todotask}?${queryString}`;

      getData(
        { dispatch, redux: todoTaskReducer },
        "",
        fullUrl,
        "GET_TODOTASK"
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
    <div>
      <div>
        {getTodoTaskLoading ? (
          <div className="h-40 flex items-center justify-center">
            <Loading loading />
          </div>
        ) : getTodoTaskResult?.count > 0 ? (
          getTodoTaskResult?.results?.map((item, itemIdx) => (
            <div key={itemIdx}>
              <div
                className="border-b dark:border-base-400 py-4 px-2 cursor-pointer"
                onClick={() => {
                  if (openPekerjaan === item?.id) {
                    setOpenPekerjaan("");
                  } else {
                    setOpenPekerjaan(item?.id);
                  }
                }}
              >
                <div className="mb-2 flex justify-between gap-x-10">
                  <div>
                    <div className="capitalize font-medium">{item?.title}</div>
                    <div className="text-sm">{item?.description}</div>
                  </div>
                  <div className="flex flex-col items-end h-full">
                    <Chip
                      color={
                        item?.status === 1
                          ? "info"
                          : item?.status === 2
                          ? "warning"
                          : item?.status === 3
                          ? "success"
                          : "danger"
                      }
                      variant="solid"
                      rounded="rounded"
                      size="sm"
                    >
                      {item?.status_display}
                    </Chip>
                    <div className="text-xs mt-1 text-right">
                      <div className="text-[10px] leading-none">
                        Update Terakhir
                      </div>
                      <div>
                        {moment(item?.updated_at).format("DD-MM-YYYY HH:mm")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs">
                  Dibuat oleh{" "}
                  <span className="font-semibold">
                    {item?.createdbydetail?.first_name}
                  </span>{" "}
                  pada{" "}
                  <span className="font-semibold">
                    {moment(item?.created_at).format("DD-MM-YYYY HH:mm")}
                  </span>
                </div>
                <div className="text-xs">
                  Batas waktu{" "}
                  <span
                    className={`font-semibold ${
                      moment(item?.due_date) < moment() ? "text-red-500" : ""
                    }`}
                  >
                    {moment(item?.due_date).format("DD-MM-YYYY HH:mm")}
                  </span>
                </div>
              </div>
              {item?.id === openPekerjaan && (
                <div className="overflow-hidden bg-base-50 dark:bg-base-700 border-b dark:border-base-400 p-4">
                  <div className="grid grid-cols-2 mb-2">
                    <div>
                      <div className="text-sm font-semibold mb-1">
                        Departemen
                      </div>
                      <div className="flex items-center flex-wrap gap-2">
                        {item?.departemen_details?.length > 0
                          ? item?.departemen_details?.map(
                              (departemen, departementIdx) => (
                                <Chip
                                  key={departementIdx}
                                  color={"primary"}
                                  variant="tonal"
                                  rounded="rounded"
                                  size="xs"
                                >
                                  {departemen?.departemen?.nama}
                                </Chip>
                              )
                            )
                          : "-"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1">
                        Anggota Tim
                      </div>
                      <div className="flex items-center flex-wrap gap-2">
                        {item?.todotask_teams?.length > 0
                          ? item?.todotask_teams?.map((team, teamIdx) => (
                              <Chip
                                key={teamIdx}
                                color={"primary"}
                                variant="tonal"
                                rounded="rounded"
                                size="xs"
                              >
                                {team?.first_name}
                              </Chip>
                            ))
                          : "-"}
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="font-semibold text-sm mb-1">Files</div>
                    <div className="text-sm flex flex-wrap gap-2">
                      {item?.file_details?.length > 0
                        ? item?.file_details?.map((file, fileIdx) => {
                            if (
                              imageExtensions.includes(
                                file?.file?.split(".").pop().toLowerCase()
                              )
                            ) {
                              return (
                                <img
                                  onClick={() => {
                                    window.open(file?.file, "_blank");
                                  }}
                                  className="w-16 h-16 object-cover cursor-pointer"
                                  key={fileIdx}
                                  src={file?.file}
                                />
                              );
                            }
                            return (
                              <div
                                onClick={() => {
                                  window.open(file?.file, "_blank");
                                }}
                                key={fileIdx}
                                className="w-16 h-16 border dark:border-base-400 flex items-center justify-center text-2xl cursor-pointer"
                              >
                                <TbFile />
                              </div>
                            );
                          })
                        : "-"}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-sm mb-1">Aktivitas</div>
                    <div className="text-sm">
                      {item?.subtodotask_details?.length > 0
                        ? item?.subtodotask_details?.map(
                            (subtask, subtaskIdx) => (
                              <div
                                key={subtaskIdx}
                                className="bg-base-75 dark:bg-base-800 p-3 px-4 border-b dark:border-base-600"
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div className="capitalize font-medium">
                                    {subtask?.title}
                                  </div>
                                  <div>
                                    <Chip
                                      color={
                                        subtask?.is_done ? "success" : "danger"
                                      }
                                      variant="tonal"
                                      rounded="rounded"
                                      size="xs"
                                    >
                                      {subtask?.is_done
                                        ? "Selesai"
                                        : "Belum Selesai"}
                                    </Chip>
                                  </div>
                                </div>

                                <div className="text-xs">
                                  <div>
                                    Dibuat oleh{" "}
                                    <span className="font-semibold">
                                      {subtask?.createdby_details?.first_name}
                                    </span>{" "}
                                    pada{" "}
                                    <span className="font-semibold">
                                      {moment(subtask?.created_at).format(
                                        "DD-MM-YYYY HH:mm"
                                      )}
                                    </span>
                                  </div>
                                  {subtask?.doneby_details?.first_name && (
                                    <div>
                                      Diselesaikan oleh{" "}
                                      <span className="font-semibold">
                                        {subtask?.doneby_details?.first_name}
                                      </span>
                                    </div>
                                  )}
                                  {subtask?.file ? (
                                    <div className="mt-2">
                                      {imageExtensions.includes(
                                        subtask?.file
                                          ?.split(".")
                                          .pop()
                                          .toLowerCase()
                                      ) ? (
                                        <img
                                          onClick={() => {
                                            window.open(
                                              subtask?.file,
                                              "_blank"
                                            );
                                          }}
                                          name={subtask?.file}
                                          className="w-16 h-16 object-cover cursor-pointer"
                                          src={subtask?.file}
                                        />
                                      ) : (
                                        <div
                                          onClick={() => {
                                            window.open(
                                              subtask?.file,
                                              "_blank"
                                            );
                                          }}
                                          name={subtask?.file}
                                          className="w-16 h-16 border dark:border-base-400 flex items-center justify-center text-2xl cursor-pointer"
                                        >
                                          <TbFile />
                                        </div>
                                      )}
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            )
                          )
                        : "-"}
                    </div>
                    <div></div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : getTodoTaskError ? (
          <div className="h-40 flex items-center justify-center text-red-500">
            {getTodoTaskError}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center">
            Data Tidak Ditemukan
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-base-600 dark:border-base-400 h-16 px-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
        <div className="flex gap-2 items-baseline text-sm">
          <Limit limit={limit} setLimit={setLimit} onChange={handleSelect} />
          {getTodoTaskResult?.count || 0} entries
        </div>

        <Pagination
          totalCount={getTodoTaskResult?.count || 0}
          onPageChange={handlePageClick}
          currentPage={pageActive}
          pageSize={limit}
        />
      </div>
    </div>
  );
};

export default DaftarPekerjaanPage;
