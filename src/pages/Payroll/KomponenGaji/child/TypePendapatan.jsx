import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { Button, Modal, Tables, TextField } from "@/components";
import { API_URL_incometypes } from "@/constants";
import * as Yup from "yup";
import {
  useDeleteData,
  useGetData,
  usePostData,
  usePutData,
} from "@/actions/auth";
import { debounce } from "lodash";
import {
  BiSortDown,
  BiSortUp,
} from "react-icons/bi";
import CompPagination from "@/components/atoms/CompPagination";
import { SyncLoader } from "react-spinners";
import { showSweetAlert } from "@/utils/showSweetAlert";
import { showToast } from "@/utils/showToast";
import { AuthContext, useAuth } from "@/context/AuthContext";
import { LuPencil, LuTrash2 } from "react-icons/lu";

const TypePendapatan = () => {
  const [showModal, setShowModal] = useState(false);
  const [pk, setPk] = useState("");
  const { jwt } = useContext(AuthContext);
  const { selectedPerusahaan, loadingPerusahaan } = useAuth();

  const [queryParams, setQueryParams] = useState({
    limit: 10,
    offset: 0,
    search: "",
    sortColumn: "",
    sortOrder: "",
  });

  const tableHead = [
    { title: "No", field: "id" },
    { title: "Nama", field: "name" },
    { title: "Description", field: "description" },
    { title: "Action", field: "" },
  ];

  const getIncomeTypesApi = useGetData(
    API_URL_incometypes,
    ["incometypes", queryParams, selectedPerusahaan],
    {
      limit: queryParams.limit,
      offset: queryParams.offset,
      ordering:
        queryParams.sortOrder === "desc"
          ? `-${queryParams.sortColumn}`
          : queryParams.sortColumn,
      search: queryParams.search,
      perusahaan: selectedPerusahaan?.value,
    }
  );

  const postIncomeTypesApi = usePostData(API_URL_incometypes, true);
  const updateIncomeTypesApi = usePutData(API_URL_incometypes + pk + "/", true);
  const deleteIncomeTypesApi = useDeleteData(API_URL_incometypes, true);

  //Create & Update Category
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nama is required"),
      description: Yup.string().required("Deskripsi is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      //edit
      if (pk) {
        updateIncomeTypesApi.mutate(formData, {
          onSuccess: (res) => {
            setPk(null);
            showToast(res.message, "success", 3000);
            formik.resetForm();
            setShowModal(false);
            getIncomeTypesApi.refetch();
          },
          onError: (error) => {
            console.log(error);
          },
        });
      }
      //create
      else {
        postIncomeTypesApi.mutate(formData, {
          onSuccess: (res) => {
            showToast(res.message, "success", 3000);
            formik.resetForm();
            setShowModal(false);
            getIncomeTypesApi.refetch();
          },
          onError: (error) => {
            console.log(error);
            showToast(error.message, "warning");
          },
        });
      }
    },
  });

  //Delete
  const onDelete = (item) => {
    showSweetAlert(`Apakah Anda yakin menghapus ${item.name}`, () => {
      deleteIncomeTypesApi.mutate(item.id, {
        onSuccess: (res) => {
          showToast(res.message, "success", 3000);
          getIncomeTypesApi.refetch();
        },
        onError: (error) => {
          console.log(error);
          showToast(error.message, "warning", 3000);
        },
      });
    });
  };

  const onEdit = (item) => {
    setPk(item.id);
    formik.setFieldValue("name", item.name);
    formik.setFieldValue("description", item.description);
    setShowModal(true);
  };

  const onAdd = (item) => {
    formik.setFieldValue("name", "");
    formik.setFieldValue("description", "");
    setShowModal(true);
  };

  const onSearch = debounce((value) => {
    setQueryParams((prev) => ({ ...prev, search: value, offset: 0 }));
  }, 500);

  const handleSort = (column) => {
    setQueryParams((prev) => ({
      ...prev,
      sortColumn: column,
      sortOrder:
        prev.sortColumn === column && prev.sortOrder === "asc" ? "desc" : "asc",
      offset: 0,
    }));
  };

  // Sort icons
  const renderSortIcon = (field) => {
    if (field === queryParams.sortColumn) {
      return queryParams.sortOrder === "asc" ? <BiSortUp /> : <BiSortDown />;
    }
    return <BiSortUp className="text-gray-300" />;
  };

  const handlePageClick = (e) => {
    setQueryParams((prev) => ({
      ...prev,
      offset: e.selected * prev.limit,
    }));
  };

  const handleSelect = (limit) => {
    setQueryParams((prev) => ({
      ...prev,
      limit,
      offset: 0,
    }));
  };

  const action = [
    {
      name: "Edit",
      // icon: <BiEdit size={20} />,
      // color: "text-yellow-500",
      icon: <LuPencil size={20} />,
      color:"success",
      func: onEdit,
    },
    {
      name: "Hapus",
      // icon: <BiTrash size={20} />,
      // color: "text-red-500",
      icon: <LuTrash2 size={20} />,
      color:"danger",
      func: onDelete,
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-base-600">
      <div>
        {/* Content */}
        <div className=" shadow rounded-lg border dark:border-base-400 p-2">
          {/* Title Data  */}
          <div className="font-bold mb-4">Tipe Pendapatan</div>
          {/* Search dan Tambah Data  */}
          <div className="w-full flex flex-row flex-wrap sm:flex-nowrap items-center text-gray-600 dark:text-base-200 p-1 rounded-lg gap-4">
            <TextField
              size="sm"
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search"
            />
            <button
              className="text-xs whitespace-nowrap font-medium px-3 py-2 bg-green-500 text-white rounded-lg shadow hover:shadow-lg transition-all"
              onClick={() => onAdd()}
            >
              Tambah
            </button>
          </div>
          {/* Konten Data  */}
          <div className=" custom-scroll">
            <Tables>
              <Tables.Head>
                <tr className="border-b-2 border-base-400">
                  {tableHead.map((item, itemIdx) => (
                    <th
                      key={itemIdx}
                      className="p-2 text-sm whitespace-nowrap"
                      onClick={() => {
                        item.field && handleSort(item.field);
                      }}
                    >
                      <span className="flex text-center items-center gap-2 justify-center">
                        {item.title}
                        {item.field && renderSortIcon(item.field)}
                      </span>
                    </th>
                  ))}
                </tr>
              </Tables.Head>
              <Tables.Body>
                {/* Loading */}
                {getIncomeTypesApi.isLoading && (
                  <tr>
                    <td
                      className="text-center py-12"
                      colSpan={tableHead.length + 1}
                    >
                      <div className="pt-10 pb-6 flex justify-center items-center">
                        <SyncLoader color="pink" />
                      </div>
                    </td>
                  </tr>
                )}

                {/* Error */}
                {getIncomeTypesApi.isError && (
                  <tr>
                    <td className="text-center" colSpan={tableHead.length + 1}>
                      <div className="pt-20 pb-12 flex justify-center items-center text-xs text-red-500">
                        {getIncomeTypesApi.error.message}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Result = 0 */}
                {getIncomeTypesApi.data &&
                  getIncomeTypesApi.data?.results?.length === 0 && (
                    <tr>
                      <td
                        className="text-center"
                        colSpan={tableHead.length + 1}
                      >
                        <div className="pt-20 pb-12 flex justify-center items-center text-xs">
                          No Data
                        </div>
                      </td>
                    </tr>
                  )}

                {getIncomeTypesApi.data &&
                  getIncomeTypesApi.data?.results?.map((item, itemIdx) => (
                    <tr
                      key={itemIdx}
                      className="border-b border-base-400 text-sm hover:bg-base-400/60 transition-all"
                    >
                      <td className="p-2 text-center whitespace-nowrap">
                        {itemIdx + queryParams.offset + 1}
                      </td>
                      <td className="p-2 text-center">{item.name}</td>
                      <td className="p-2 text-center whitespace-nowrap">
                        {item.description}
                      </td>

                      {/* <td className="p-2 text-center whitespace-nowrap">
                        <div className="flex justify-center">
                          {action.map((action, actionIdx) => (
                            <button
                              key={actionIdx}
                              data-tip={action.name}
                              className={`mx-1 ${action.color} tooltip tooltip-top`}
                              onClick={() => action.func(item)}
                            >
                              {action.icon}
                            </button>
                          ))}
                        </div>
                      </td> */}

                      <Tables.Data center>
                        <div className="flex items-center justify-center gap-2">
                          {action.map((action) => (
                            <Button
                              key={action.name}
                              size={30}
                              variant="tonal"
                              color={action.color}
                              onClick={() => action.func(item)}
                              className={`${action.color} cursor-pointer`}
                            >
                              {action.icon}
                            </Button>
                          ))}
                        </div>
                      </Tables.Data>

                    </tr>
                  ))}
              </Tables.Body>
            </Tables>
          </div>
          <CompPagination
            handlePageClick={handlePageClick}
            pageCount={
              getIncomeTypesApi.data?.count > 0
                ? getIncomeTypesApi.data?.count
                : 0
            }
            limit={queryParams.limit}
            setLimit={handleSelect}
          />
          {/* <Limit limit={queryParams.limit}
            setLimit={handleSelect} /> */}
        </div>
      </div>

      <Modal
        show={showModal}
        setShow={setShowModal}
        width="md"
        btnClose={true}
        persistent={false}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Form Detail</h2>

          <TextField
            label={"Nama"}
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            className="mb-4"
          />

          {formik.errors.name && formik.touched.name && (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          )}

          <TextField
            label={"Deskripsi"}
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            className="mb-4"
          />

          {formik.errors.description && formik.touched.description && (
            <div className="text-red-500 text-sm">
              {formik.errors.description}
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={() => setShowModal(false)} color="base">
              Cancel
            </Button>
            <Button
              onClick={formik.handleSubmit} // Replace with your submit function
              color="primary"
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TypePendapatan;
