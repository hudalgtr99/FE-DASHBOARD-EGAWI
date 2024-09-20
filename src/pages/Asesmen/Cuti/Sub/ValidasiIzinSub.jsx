import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addData,
  deleteData,
  getData,
  updateData,
} from '@/actions';
import { pengajuanIzinReducer } from '@/reducers/asesmenReducers';
import {
  API_URL_getdatapengajuancuti,
  API_URL_responsepengajuan,
} from '@/constants';
import { icons } from "../../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  Limit,
  TextField,
  Tooltip,
} from '@/components';
import { CiSearch } from 'react-icons/ci';

const ValidasiIzinSub = () => {
  const {
    getIzinValidasiResult,
    getIzinValidasiLoading,
    getIzinValidasiError,
    updatePengajuanResult,
    updatePengajuanLoading,
  } = useSelector((state) => state.asesmen);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [offset, setOffset] = useState(0);

  const onTerima = (item) => {
    navigate('/validasiizin/form', { state: { id: item.pk, status: 2 } }); // Adjust path and state as needed
  };

  const onTolak = (item) => {
    navigate('/validasiizin/form', { state: { id: item.pk, status: 3 } }); // Adjust path and state as needed
  };

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    setLimit(10);
    setPageActive(0);
    get({
      param: "?search=" + value + "&date-month=" + filter + "&status=1",
    });
  };

  const handleFilterDate = (e) => {
    const dateValue = e.target.value;

    // Check if the date is valid and in the format YYYY-MM
    const isValidDate = dateValue && dateValue.split("-").length === 2;

    if (!isValidDate) {
      console.error("Invalid date format. Expected YYYY-MM.");
      return;
    }

    const param =
      search === ""
        ? { param: "?date-month=" + dateValue + "&status=1&limit=" + limit }
        : {
          param:
            "?search=" +
            search +
            "&date-month=" +
            dateValue +
            "&status=1&limit=" +
            limit,
        };

    setFilter(dateValue);
    setPageActive(0);
    get(param);
  };

  const get = useCallback(
    async (param) => {
      // Ensure the default values for search and status
      const queryParams = {
        search: search || "",
        status: "1",  // Default to status 1 if not provided
        ...param,
      };

      getData(
        { dispatch, redux: pengajuanIzinReducer },
        queryParams,
        API_URL_getdatapengajuancuti,
        "GET_IZIN_VALIDASI"
      );
    },
    [dispatch, search]
  );

  const handlePageClick = (e) => {
    const offset = e.selected * limit;

    if (offset < 0 || limit <= 0) {
      console.error("Invalid pagination parameters");
      return;
    }

    const param =
      search === ""
        ? {
          param:
            "?date-month=" +
            filter +
            "&status=1&limit=" +
            limit +
            "&offset=" +
            offset,
        }
        : {
          param:
            "?search=" +
            search +
            "&date-month=" +
            filter +
            "&status=1&limit=" +
            limit +
            "&offset=" +
            offset,
        };

    get(param);
    setOffset(offset);
    setPageActive(e.selected);
  };

  const handleSelect = (e) => {
    const param =
      search === ""
        ? { param: "?date-month=" + filter + "&status=1&limit=" + e }
        : {
          param:
            "?search=" +
            search +
            "&date-month=" +
            filter +
            "&status=1&limit=" +
            limit,
        };
    get(param);
    setLimit(e);
    setPageActive(0);
  };

  const fetchData = useCallback(
    async (param = false) => {
      // Check if the date-month (filter) is valid and the limit is greater than 0
      if (!filter || filter.split("-").length !== 2 || limit <= 0) {
        console.error("Invalid filter or limit");
        return;
      }

      // Fetch data only when the filter and limit are valid
      get(
        param
          ? param
          : { param: "?date-month=" + filter + "&status=1&limit=" + limit }
      );
    },
    [filter, limit, get]
  );

  const [actions] = useState([
    {
      name: "terima",
      icon: icons.mdcheckcircle,
      color: "text-green-500",
      func: onTerima,
    },
    {
      name: "tolak",
      icon: icons.riclosecirclefill,
      color: "text-red-500",
      func: onTolak,
    },
  ]);

  useEffect(() => {
    if (filter && limit > 0) {
      fetchData();
    }
  }, [filter, limit]);
  useEffect(() => {
    if (updatePengajuanResult) {
      const param =
        search === ""
          ? {
            param:
              "?date-month=" +
              filter +
              "&status=1&limit=" +
              limit +
              "&offset=" +
              offset,
          }
          : {
            param:
              "?search=" +
              search +
              "&date-month=" +
              filter +
              "&status=1&limit=" +
              limit +
              "&offset=" +
              offset,
          };
      fetchData(param);
    }
  }, [updatePengajuanResult, dispatch]);

  const dataWithIndex = getIzinValidasiResult?.results?.length
    ? getIzinValidasiResult.results.map((item, index) => ({
      ...item,
      index: pageActive * limit + index + 1,
    }))
    : [];

  return (
    <div>
      <Container>
        <div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <div className="w-full sm:w-60">
            <TextField
              onChange={doSearch}
              placeholder="Search"
              value={search}
              icon={<CiSearch />}
            />
          </div>
          <div className="w-full sm:w-60">
            <TextField
              onChange={handleFilterDate}
              type="date"
              value={filter}
            />
          </div>
        </div>
        <Tables>
          <Tables.Head>
            <tr>
              <Tables.Header>No</Tables.Header>
              <Tables.Header>Tanggal Pengajuan</Tables.Header>
              <Tables.Header>Nama</Tables.Header>
              <Tables.Header>Jenis Cuti</Tables.Header>
              <Tables.Header>Alasan Cuti</Tables.Header>
              <Tables.Header>Tanggal Cuti</Tables.Header>
              <Tables.Header>Lama Cuti/Hari</Tables.Header>
              <Tables.Header>Catatan</Tables.Header>
              <Tables.Header>File</Tables.Header>
              <Tables.Header>Status</Tables.Header>
              <Tables.Header center>Actions</Tables.Header>
            </tr>
          </Tables.Head>
          <Tables.Body>
            {dataWithIndex.length > 0 ? (
              dataWithIndex.map((item) => (
                <Tables.Row key={item.pk}>
                  <Tables.Data>{item.index}</Tables.Data>
                  <Tables.Data>{item.created_at}</Tables.Data>
                  <Tables.Data>{item.user.first_name}</Tables.Data>
                  <Tables.Data>{item.jeniscuti.jenis}</Tables.Data>
                  <Tables.Data>{item.alasan_cuti}</Tables.Data>
                  <Tables.Data>{item.tgl_cuti}</Tables.Data>
                  <Tables.Data>{item.lama_cuti}</Tables.Data>
                  <Tables.Data>{item.catatan}</Tables.Data>
                  <Tables.Data>{item.file}</Tables.Data>
                  <Tables.Data>{item.status}</Tables.Data>
                  <Tables.Data center>
                    <div className="flex items-center justify-center gap-2">
                      {actions.map((action) => (
                        <Tooltip key={action.name} tooltip={action.name}>
                          <div
                            onClick={() => action.func(item)}
                            className={action.color}
                          >
                            {action.icon}
                          </div>
                        </Tooltip>
                      ))}
                    </div>
                  </Tables.Data>
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
          <Limit limit={limit} setLimit={setLimit} onChange={handleSelect} />
          <Pagination
            totalCount={getIzinValidasiResult.count}
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

export default ValidasiIzinSub;
