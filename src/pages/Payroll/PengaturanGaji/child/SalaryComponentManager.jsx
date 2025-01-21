import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button, Modal, Select, Tables, TextField } from "@/components";
import {
  API_URL_deductiontypes,
  API_URL_incometypes,
  API_URL_settingcomponentsalary,
} from "@/constants";
import {
  useDeleteData,
  useGetData,
  usePostData,
  usePutData,
} from "@/actions/auth";
import { debounce } from "lodash";
import { BiEdit, BiSortDown, BiSortUp, BiTrash } from "react-icons/bi";
import CompPagination from "@/components/atoms/CompPagination";
import { SyncLoader } from "react-spinners";
import { showSweetAlert } from "@/utils/showSweetAlert";
import { showToast } from "@/utils/showToast";
import CurrencyInput from "@/components/atoms/CurrencyInput";

const JenisOption = [
  { label: "Pendapatan", value: "income" },
  { label: "Pemotongan", value: "deduction" },
];
const TetapPresentase = [
  { label: "Tetap", value: "fixed" },
  { label: "Presentase", value: "presentase" },
];
const StatusOption = [
  { label: "Aktif", value: 1 },
  { label: "Non Active", value: 0 },
];

const SalaryComponentManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [pk, setPk] = useState("");
  const [listOptionPendapatan, setListOptionPendapatan] = useState([]);
  const [listOptionPemotongan, setListOptionPemotongan] = useState([]);

  const [queryParams, setQueryParams] = useState({
    limit: 10,
    offset: 0,
    search: "",
    sortColumn: "",
    sortOrder: "",
  });

  const tableHead = [
    { title: "No", field: "id" },
    { title: "Jenis", field: "" },
    { title: "Nama", field: "" },
    { title: "Tetap/Presentasi", field: "" },
    { title: "Nilai Potongan/Tambahan", field: "" },
    { title: "Status", field: "" },
    { title: "Action", field: "" },
  ];

  const getSettingComponentSalary = useGetData(
    API_URL_settingcomponentsalary,
    ["ettingcomponentsalary", queryParams],
    {
      limit: queryParams.limit,
      offset: queryParams.offset,
      ordering:
        queryParams.sortOrder === "desc"
          ? `-${queryParams.sortColumn}`
          : queryParams.sortColumn,
      search: queryParams.search,
    }
  );

  const getIncomeTypes = useGetData(
    API_URL_incometypes,
    ["incometypes", queryParams],
    {
      limit: queryParams.limit,
      offset: queryParams.offset,
      ordering:
        queryParams.sortOrder === "desc"
          ? `-${queryParams.sortColumn}`
          : queryParams.sortColumn,
      search: queryParams.search,
    }
  );

  const getDeductionTypes = useGetData(
    API_URL_deductiontypes,
    ["deductiontypes", queryParams],
    {
      limit: queryParams.limit,
      offset: queryParams.offset,
      ordering:
        queryParams.sortOrder === "desc"
          ? `-${queryParams.sortColumn}`
          : queryParams.sortColumn,
      search: queryParams.search,
    }
  );

  const postSettingComponentSalary = usePostData(
    API_URL_settingcomponentsalary,
    true
  );
  const updateSettingComponentSalary = usePutData(
    API_URL_settingcomponentsalary + pk + "/",
    true
  );
  const deleteSettingComponentSalary = useDeleteData(
    API_URL_settingcomponentsalary,
    true
  );

  //Create & Update Category
  const formik = useFormik({
    initialValues: {
      type_component: "",
      income_type: "",
      deduction_type: "",
      fixed_presentase: "",
      value: null,
      status: 0,
    },
    // validationSchema: Yup.object(),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("type_component", values.type_component);
      formData.append("income_type", values.income_type);
      formData.append("deduction_type", values.deduction_type);
      formData.append("fixed_presentase", values.fixed_presentase);
      formData.append("value", values.value);
      formData.append("status", values.status);
      //edit
      if (pk) {
        updateSettingComponentSalary.mutate(formData, {
          onSuccess: (res) => {
            setPk(null);
            showToast(res.message, "success", 3000);
            formik.resetForm();
            setShowModal(false);
            getSettingComponentSalary.refetch();
          },
          onError: (error) => {
            console.log(error);
            showToast(error.message, "warning");
          },
        });
      }
      //create
      else {
        postSettingComponentSalary.mutate(formData, {
          onSuccess: (res) => {
            showToast(res.message, "success", 3000);
            formik.resetForm();
            setShowModal(false);
            getSettingComponentSalary.refetch();
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
      deleteSettingComponentSalary.mutate(item.id, {
        onSuccess: (res) => {
          showToast(res.message, "success", 3000);
          getSettingComponentSalary.refetch();
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
    formik.setFieldValue("type_component", item.type_component);
    formik.setFieldValue("income_type", item.income_type);
    formik.setFieldValue("deduction_type", item.deduction_type);
    formik.setFieldValue("fixed_presentase", item.fixed_presentase);
    formik.setFieldValue("value", item.value);
    formik.setFieldValue("status", item.status);
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
      icon: <BiEdit size={20} />,
      color: "text-yellow-500",
      func: onEdit,
    },
    {
      name: "Hapus",
      icon: <BiTrash size={20} />,
      color: "text-red-500",
      func: onDelete,
    },
  ];

  useEffect(() => {
    if (getIncomeTypes.data) {
      const options =
        getIncomeTypes.data?.results.map((item) => ({
          value: item.id, // Ganti 'id' dengan nama field yang sesuai
          label: item.name, // Ganti 'name' dengan nama field yang sesuai
        })) || [];

      setListOptionPendapatan(options);
    }
  }, [getIncomeTypes.data]);

  useEffect(() => {
    if (getDeductionTypes.data) {
      const optionss =
        getDeductionTypes.data?.results.map((item) => ({
          value: item.id, // Ganti 'id' dengan nama field yang sesuai
          label: item.name, // Ganti 'name' dengan nama field yang sesuai
        })) || [];

      setListOptionPemotongan(optionss);
    }
  }, [getDeductionTypes.data]);

  return (
    <div className="w-full bg-white">
      <div>
        {/* Content */}
        <div className=" shadow rounded-lg border p-2">
          {/* Title Data  */}
          <div className="font-bold mb-4">Komponen Gaji Wajib</div>
          {/* Search dan Tambah Data  */}
          <div className="w-full justify-start flex flex-row flex-wrap sm:flex-nowrap items-center text-gray-600 bg-white p-1 rounded-lg gap-4">
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
                <tr className="border-b-2 border-gray-200">
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
                {getSettingComponentSalary.isLoading && (
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
                {getSettingComponentSalary.isError && (
                  <tr>
                    <td className="text-center" colSpan={tableHead.length + 1}>
                      <div className="pt-20 pb-12 flex justify-center items-center text-xs text-red-500">
                        {getSettingComponentSalary.error.message}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Result = 0 */}
                {getSettingComponentSalary.data &&
                  getSettingComponentSalary.data?.results?.length === 0 && (
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

                {getSettingComponentSalary.data &&
                  getSettingComponentSalary.data?.results?.map(
                    (item, itemIdx) => (
                      <tr
                        key={itemIdx}
                        className="border-b border-gray-200 text-sm hover:bg-white/60 transition-all"
                      >
                        <td className="p-2 text-center whitespace-nowrap">
                          {itemIdx + queryParams.offset + 1}
                        </td>
                        <td className="p-2 text-center">
                          {item.type_component_display}
                        </td>
                        <td className="p-2 text-center whitespace-nowrap">
                          {item.type_component === "income" &&
                            item.income_type_name}
                          {item.type_component === "deduction" &&
                            item.deduction_type_name}
                        </td>
                        <td className="p-2 text-center whitespace-nowrap">
                          {item.fixed_presentase_display}
                        </td>
                        <td className="p-2 text-center whitespace-nowrap">
                          {item.value}
                        </td>
                        <td className="p-2 text-center whitespace-nowrap">
                          {item.status_display}
                        </td>
                        <td className="p-2 text-center whitespace-nowrap">
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
                        </td>
                      </tr>
                    )
                  )}
              </Tables.Body>
            </Tables>
          </div>
          <CompPagination
            handlePageClick={handlePageClick}
            pageCount={
              getSettingComponentSalary.data?.count > 0
                ? getSettingComponentSalary.data?.count
                : 0
            }
            limit={queryParams.limit}
            setLimit={handleSelect}
          />
        </div>
      </div>

      <Modal
        show={showModal}
        setShow={setShowModal}
        width="md"
        btnClose={true}
        persistent={false}
      >
        <div className="p-8">
          <h2 className="text-lg font-semibold mb-4">Form Detail</h2>

          <div className="mb-3">
            <Select
              label="Jenis"
              placeholder={"Pendapatan Atau Pemotongan"}
              options={JenisOption}
              value={JenisOption.filter(
                (item) => item.value === formik.values.type_component
              )}
              onChange={(option) =>
                formik.setFieldValue(
                  "type_component",
                  option ? option.value : ""
                )
              }
              error={
                formik.touched.type_component
                  ? formik.errors.type_component
                  : ""
              }
            />
          </div>

          <div className="mb-3">
            {formik.values.type_component === "income" && (
              <Select
                label="Nama Komponen"
                placeholder={"Pilih Pendapatan"}
                options={listOptionPendapatan}
                value={listOptionPendapatan?.filter(
                  (item) => item.value === formik.values.income_type
                )}
                onChange={(option) =>
                  formik.setFieldValue(
                    "income_type",
                    option ? option.value : ""
                  )
                }
                error={
                  formik.touched.income_type ? formik.errors.income_type : ""
                }
              />
            )}

            {formik.values.type_component === "deduction" && (
              <Select
                label="Nama Komponen"
                placeholder={"Pilih Potongan"}
                options={listOptionPemotongan}
                value={listOptionPemotongan?.filter(
                  (item) => item.value === formik.values.deduction_type
                )}
                onChange={(option) =>
                  formik.setFieldValue(
                    "deduction_type",
                    option ? option.value : ""
                  )
                }
                error={
                  formik.touched.deduction_type
                    ? formik.errors.deduction_type
                    : ""
                }
              />
            )}
          </div>

          <div className="mb-3">
            <Select
              label="Tetap / Presentase"
              placeholder={"Tetap / Presentase"}
              options={TetapPresentase}
              value={TetapPresentase.filter(
                (item) => item.value === formik.values.fixed_presentase
              )}
              onChange={(option) =>
                formik.setFieldValue(
                  "fixed_presentase",
                  option ? option.value : ""
                )
              }
              error={
                formik.touched.fixed_presentase
                  ? formik.errors.fixed_presentase
                  : ""
              }
            />
          </div>

          <div className="mb-3">
            {formik.values.fixed_presentase === "fixed" && (
              <>
                <CurrencyInput
                  label={
                    formik.values.type_component === "income"
                      ? "Nilai Pendapatan"
                      : "Nilai Potongan"
                  }
                  name="value"
                  value={formik.values.value}
                  onChange={(e) => {
                    formik.setFieldValue("value", e);
                  }}
                />

                {formik.errors.value && formik.touched.value && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.value}
                  </div>
                )}
              </>
            )}
            {formik.values.fixed_presentase === "presentase" && (
              <div className="w-[8rem]">
                <TextField
                  name="value"
                  label={
                    formik.values.type_component === "income"
                      ? "Nilai Pendapatan"
                      : "Nilai Potongan"
                  }
                  value={formik.values.value}
                  placeholder={0}
                  suffix={"%"}
                  onChange={formik.handleChange}
                  error={formik.touched.value ? formik.errors.value : ""}
                />
              </div>
            )}
          </div>

          <div className="mb-3">
            <Select
              label="Status"
              placeholder={"Status"}
              options={StatusOption}
              value={StatusOption.filter(
                (item) => item.value === formik.values.status
              )}
              onChange={(option) =>
                formik.setFieldValue("status", option ? option.value : "")
              }
              error={formik.touched.status ? formik.errors.status : ""}
            />
          </div>

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

export default SalaryComponentManager;
