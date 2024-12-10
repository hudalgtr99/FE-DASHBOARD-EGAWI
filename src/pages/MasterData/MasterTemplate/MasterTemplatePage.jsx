import { icons } from "../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  Limit,
  TextField,
  Tooltip,
  PulseLoading, // Import your PulseLoading component here
} from "@/components";
import { debounce } from "lodash"; // Import lodash debounce
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import { penugasanReducer } from "@/reducers/penugasanReducers";
import { getData, deleteData } from "@/actions";
import {
  API_URL_gettemplatesurattugas,
  API_URL_edeltemplatesurattugas,
} from "@/constants";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function MasterTemplate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { getTugasResult, addTugasResult, deleteTugasResult, getTugasLoading } = useSelector(
    (state) => state.tugas
  );

  const [jwt, setJwt] = useState({}); // Initialize jwt variable

  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, []);
  const onAdd = () => {
    navigate("/masterdata/master-template/form", {
      state: {
        item: {
          nama: "",
          isi: "",
        },
      },
    });
    sessionStorage.removeItem("ckeditor");
  };

  const onView = (item) => {
    navigate(`/masterdata/master-template/${item.id}`);
    sessionStorage.removeItem("ckeditor");
  };
  const onEdit = (item) => {
    navigate(`/masterdata/master-template/form/${item.id}`, {
      state: {
        item,
      },
    });
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: penugasanReducer },
      item.id,
      API_URL_edeltemplatesurattugas,
      "DELETE_TUGAS"
    );
  };

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
      API_URL_gettemplatesurattugas,
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

  return (
    <div>
      <Container>
        <div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <div className="w-full sm:w-60">
            <TextField placeholder="Search" icon={<CiSearch />} />
          </div>
          <Button onClick={() => onAdd()}>
            <div className="flex items-center gap-2">
              <FaPlus /> Tambah Template
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
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {dataWithIndex.length > 0 ? (
                dataWithIndex.map((item, index) => (
                  <Tables.Row>
                    <Tables.Data>{index + 1}</Tables.Data>
                    <Tables.Data>{item.nama}</Tables.Data>
                    <Tables.Data center>
                      <div className="flex it ems-center justify-center gap-2">
                        {/* <Tooltip tooltip="Lihat">
                        <div
                          onClick={() => onView(item)}
                          className="text-blue-500 cursor-pointer"
                        >
                          <FaEye />
                        </div>
                      </Tooltip> */}
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
                  <td colSpan={3} className="text-center">
                    Tidak ada data yang tersedia
                  </td>
                </Tables.Row>
              )}
            </Tables.Body>
          </Tables>
        )}
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
