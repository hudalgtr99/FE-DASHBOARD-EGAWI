import {
  Button,
  Container,
  Pagination,
  Tables,
  TextField,
  Tooltip,
  PulseLoading,
} from "@/components";
import { debounce } from "lodash"; // Import lodash debounce
import { FaEdit, FaPlus } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";
import { penugasanReducer } from "@/reducers/penugasanReducers";
import { getData, updateData } from "@/actions";
import {
  API_URL_gettemplatesurattugas,
  API_URL_changeactivedata,
} from "@/constants";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";
import { Select } from "../../../components";

export default function MasterTemplate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [limit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const { slug } = useParams();
  const location = useLocation();
  const { getTugasResult, addTugasResult, deleteTugasResult, getTugasLoading } =
    useSelector((state) => state.tugas);

  const [jwt, setJwt] = useState({});
  const { perusahaan, loadingPerusahaan } = useAuth();
  const [perusahaanOptions, setperusahaanOptions] = useState([]);

  const [selectedPerusahaan, setSelectedPerusahaan] = useState(null);

  useEffect(() => {
    if (!loadingPerusahaan) {
      const options = perusahaan.map((opt) => ({
        value: opt.slug,
        label: opt.nama,
      }));
      setperusahaanOptions(options);
      setSelectedPerusahaan(options.find((opt) => opt?.value === slug) || "");
      console.log(perusahaan);
    }
  }, [loadingPerusahaan]);

  useEffect(() => {
    if (isAuthenticated()) {
      const token = isAuthenticated();
      setJwt(jwtDecode(token));
    }
  }, []);

  const handleSelect = (selectedOption) => {
    console.log(selectedOption);
    setSelectedPerusahaan(selectedOption);
    const offset = pageActive * limit;

    // Menyiapkan parameter pencarian dan perusahaan
    const param = {
      param: `?search=${search || ""}&perusahaan=${
        selectedOption?.value || ""
      }&limit=${limit}&offset=${offset}`,
    };

    get(param);
  };

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
    }, 300),
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
    navigate("/masterdata/master-template/form", {
      state: {
        item: {
          nama: "",
          isi: "",
          perusahaan: slug ? { slug: slug } : null,
        },
      },
    });
    sessionStorage.removeItem("ckeditor");
  };

  function handleActive(e, item) {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Ingin mengubah status template ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6a82fb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, ubah!",
      cancelButtonText: "Batal",
      customClass: {
        container: "z-[99999]",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const data = updateData(
          { dispatch, redux: penugasanReducer },
          {
            pk: "template-tugas",
            slug: item.slug,
          },
          API_URL_changeactivedata,
          "ADD_TUGAS"
        );
      }
    });
  }

  const onEdit = (item) => {
    sessionStorage.setItem("url", location.pathname);
    item = { ...item, perusahaan: item.perusahaan.id };
    navigate(`/masterdata/master-template/form/${item.slug}`, {
      state: {
        item,
      },
    });
  };

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: penugasanReducer },
        param,
        API_URL_gettemplatesurattugas,
        "GET_TUGAS"
      );
    },
    [dispatch]
  );

  const handlePageClick = (page) => {
    const offset = (page - 1) * limit; // Calculate the offset based on the page

    // Menyiapkan parameter pencarian dan perusahaan
    const param = {
      param: `?search=${search || ""}&perusahaan=${
        selectedPerusahaan.value
      }&perusahaan=${
        selectedPerusahaan?.value || ""
      }&limit=${limit}&offset=${offset}`,
    };

    get(param);
    setPageActive(page - 1);
  };

  useEffect(() => {
    const param = slug
      ? {
          param: `?perusahaan=${slug}&limit=${limit}&search=${
            search || ""
          }&offset=${pageActive * limit}`,
        }
      : {
          param: `?limit=${limit}&search=${search || ""}&offset=${
            pageActive * limit
          }`,
        };
    get(param);
  }, [limit, pageActive, search, slug, get]);
  
  useEffect(() => {
    if (addTugasResult || deleteTugasResult) {
      const param = search
        ? {
            param: `?search=${search}&perusahaan=${
              selectedPerusahaan?.value || ""
            }&limit=${limit}&offset=${pageActive * limit}`,
          }
        : {
            param: `?&perusahaan=${
              selectedPerusahaan?.value || ""
            }&limit=${limit}&offset=${pageActive * limit}`,
          };
      get(param);
    }
  }, [
    addTugasResult,
    deleteTugasResult,
    selectedPerusahaan,
    search,
    limit,
    pageActive,
    get,
  ]);

  const dataWithIndex = !loadingPerusahaan && getTugasResult.results
    ? getTugasResult.results.map((item, index) => ({
        ...item,
        index: pageActive * limit + index + 1,
      }))
    : [];

  return (
    <div>
      <Container>
        <div className="mb-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <div
            className={`w-full flex gap-2 ${
              jwt.perusahaan ? "sm:w-60" : "sm:w-1/2"
            }`}
          >
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
                {!jwt.perusahaan && (
                  <Tables.Header>Nama perusahaan</Tables.Header>
                )}
                <Tables.Header>Nama template</Tables.Header>
                <Tables.Header center>Active</Tables.Header>
                <Tables.Header center>Actions</Tables.Header>
              </tr>
            </Tables.Head>
            <Tables.Body>
              {dataWithIndex.length > 0 ? (
                dataWithIndex.map((item, index) => (
                  <Tables.Row key={index}>
                    <Tables.Data>{index + 1}</Tables.Data>
                    {!jwt.perusahaan && (
                      <Tables.Data>
                        {(item.perusahaan && item?.perusahaan?.nama) || "-"}
                      </Tables.Data>
                    )}
                    <Tables.Data>{item?.nama}</Tables.Data>
                    <Tables.Data center>
                      <label className="flex items-center justify-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item?.is_active ? true : false}
                          onChange={(e) => handleActive(e, item)}
                          className="toggle-switch"
                        />
                      </label>
                    </Tables.Data>
                    <Tables.Data center>
                      <div className="flex items-center justify-center gap-2">
                        <Tooltip tooltip="Edit">
                          <div
                            onClick={() => onEdit(item)}
                            className="text-yellow-500 cursor-pointer"
                          >
                            <FaEdit />
                          </div>
                        </Tooltip>
                      </div>
                    </Tables.Data>
                  </Tables.Row>
                ))
              ) : (
                <Tables.Row>
                  <td colSpan={4} className="text-center">
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
