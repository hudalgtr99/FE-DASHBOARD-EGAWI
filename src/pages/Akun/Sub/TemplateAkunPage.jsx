import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteData, getData, updateData } from "@/actions";
import { userReducer } from "@/reducers/authReducers";
import {
  API_URL_edeluser,
  API_URL_changeactive,
  API_URL_changeoutofarea,
} from "@/constants";
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
import { debounce } from "lodash"; // Import lodash debounce
import { CiSearch } from "react-icons/ci";

const TemplateAkun = ({getapiakun, aktif}) => {
  const { getDataAkunResult, addAkunResult, deleteAkunResult, getDataAkunLoading } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useCallback(
    debounce((value) => {
      const param = value
        ? {
            param: `?search=${value}&limit=${limit}&offset=${
              pageActive * limit
            }`,
          }
        : { param: `?limit=${limit}&offset=${pageActive * limit}` };
      get(param);
    }, 300),
    [limit, pageActive]
  );

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    debouncedSearch(value);
    setPageActive(0);
  };

  const onEdit = (item) => {
    // Store the item in localStorage
    localStorage.setItem("editUserData", JSON.stringify(item));
    navigate(`/kepegawaian/pegawai/form/${item.datapribadi.no_identitas}`);
    sessionStorage.setItem("url", location.pathname)
  };

  const onChange = (item) => {
    navigate(`/kepegawaian/pegawai/changepassword/${item.datapribadi.no_identitas}`);
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: userReducer },
      item.datapribadi.user_id,
      API_URL_edeluser,
      "DELETE_AKUN"
    );
  };

  const get = useCallback(
    async (param) => {
      await getData(
        { dispatch, redux: userReducer },
        param,
        getapiakun,
        "GET_AKUN"
      );
      setLoading(false);
    },
    [dispatch]
  );

  const handlePageClick = (page) => {
    const offset = (page - 1) * limit; // Calculate the offset based on the page
    const param = search
      ? { param: `?search=${search}&limit=${limit}&offset=${offset}` }
      : { param: `?limit=${limit}&offset=${offset}` };

    get(param);
    setPageActive(page - 1); // Set the active page
  };

  const handleSelect = (newLimit) => {
    const param = search
      ? { param: `?search=${search}&limit=${newLimit}` }
      : { param: `?limit=${newLimit}` };
    get(param);
    setLimit(newLimit);
    setPageActive(0);
  };

  const handleSwitch = (e, item, index) => {
    if (index === 6) {
      updateData(
        { dispatch, redux: userReducer },
        {
          pk: item.datapribadi.user_id,
          is_staff: e.target.checked,
        },
        API_URL_changeactive,
        "ADD_AKUN"
      );
    } else if (index === 7) {
      updateData(
        { dispatch, redux: userReducer },
        {
          pk: item.datapribadi.user_id,
          out_of_area: e.target.checked,
        },
        API_URL_changeoutofarea,
        "ADD_AKUN"
      );
    }
  };

  useEffect(() => {
    const param = {
      param: "?limit=" + limit + "&offset=" + pageActive * limit,
    };
    get(param);
  }, [limit, pageActive, get]);

  useEffect(() => {
    if (addAkunResult || deleteAkunResult) {
      const offset = pageActive * limit;
      const param = search
        ? { param: `?search=${search}&limit=${limit}&offset=${offset}` }
        : { param: `?limit=${limit}&offset=${offset}` };
      get(param);
    }
  }, [addAkunResult, deleteAkunResult, search, limit, pageActive, get]);

  const dataWithIndex = getDataAkunResult.results
    ? getDataAkunResult.results.map((item, index) => ({
        ...item,
        index: pageActive * limit + index + 1,
      }))
    : [];

  const [actions] = useState([
    {
      name: "Edit",
      icon: icons.fiedit,
      color: "text-blue-500",
      func: onEdit,
    },
    {
      name: "Change Password",
      icon: icons.fakey,
      color: "text-yellow-500",
      func: onChange,
    },
    {
      name: "Delete",
      icon: icons.rideletebin6line,
      color: "text-red-500",
      func: doDelete,
    },
  ]);

  // console.log(JSON.stringify(dataWithIndex))

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
        </div>
        {getDataAkunLoading ? (
          <div className="flex justify-center items-center">
            <PulseLoading />
          </div>
        ) : (
          <Tables>
            <Tables.Head>
              <tr>
                <Tables.Header>No</Tables.Header>
                <Tables.Header>Nama Perusahaan</Tables.Header>
                {/* <Tables.Header>Id pegawai</Tables.Header> */}
                <Tables.Header>Nama Pribadi</Tables.Header>
                <Tables.Header>Jabatan</Tables.Header>
                <Tables.Header>Email</Tables.Header>
                <Tables.Header>Nomor Telepon</Tables.Header>
                <Tables.Header>Active</Tables.Header>
                <Tables.Header>Out of Area</Tables.Header>
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {dataWithIndex.length > 0 ? (
                dataWithIndex.map((item) => (
                  <Tables.Row key={item.datapribadi.user_id}>
                    <Tables.Data>{item.index}</Tables.Data>
                    <Tables.Data>
                      {item?.datapribadi?.perusahaan && item.datapribadi.perusahaan.nama || "-"}
                    </Tables.Data>
                    {/* <Tables.Data>{item.datapegawai?.id_pegawai || "belum ada"}</Tables.Data> */}
                    <Tables.Data>{item.datapribadi.nama}</Tables.Data>
                    <Tables.Data>
                      {item.datapegawai?.jabatan?.nama || "-"}
                    </Tables.Data>
                    <Tables.Data>{item.datapribadi.email}</Tables.Data>
                    <Tables.Data>{item.datapribadi.no_telepon}</Tables.Data>
                    <Tables.Data>
                      <label className="flex items-center justify-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.datapribadi?.is_staff}
                          onChange={(e) => handleSwitch(e, item, 6)} // Pass index 6 for is_staff
                          className="toggle-switch"
                        />
                      </label>
                    </Tables.Data>
                    <Tables.Data>
                      <label className="flex items-center justify-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.datapribadi?.out_of_area}
                          onChange={(e) => handleSwitch(e, item, 7)} // Pass index 7 for out_of_area
                          className="toggle-switch"
                        />
                      </label>
                    </Tables.Data>
                    <Tables.Data center>
                      <div className="flex items-center justify-center gap-2">
                        {actions.map((action) => (
                          <Tooltip key={action.name} tooltip={action.name}>
                            <div
                              key={action.name}
                              onClick={() => action.func(item)}
                              className={`${action.color} cursor-pointer`}
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
                  <td colSpan="9" className="text-center">
                    Tidak ada data yang tersedia
                  </td>
                </Tables.Row>
              )}
            </Tables.Body>
          </Tables>
        )}
        <div className="flex justify-end items-center mt-4">
          <Pagination
            totalCount={getDataAkunResult.count} // Total items count from the API result
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
    </div>
  );
};

export default TemplateAkun;
