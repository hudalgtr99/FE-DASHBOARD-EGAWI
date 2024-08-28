import {
  CompButton,
  CompCardContainer,
  CompCardContainer2,
  CompForm,
  CompPagination,
  CompTable,
  CompTableController,
} from "@/components";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  addData,
  deleteData,
  getData,
  handleInputError,
  updateData,
} from "@/actions";
import { jabatanReducers } from "@/reducers/strataReducers";
import {
  API_URL_createjabatan,
  API_URL_edeljabatan,
  API_URL_getjabatan,
} from "@/constants";
import { icons } from "../../../../../public/icons";

const JabatanSub = () => {
  const {
    getJabatanResult,
    getJabatanLoading,
    getJabatanError,
    addJabatanResult,
    addJabatanLoading,
    addPangkatResult,
    deleteJabatanResult,
    deletePangkatResult,
  } = useSelector((state) => state.strata);
  const dispatch = useDispatch();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [dataColumns] = useState([
    { name: "ID", value: "index" },
    { name: "Nama Jabatan", value: "nama" },
    { name: "Keterangan", value: "keterangan" },
  ]);

  const validationSchema = Yup.object().shape({
    nama_jabatan: Yup.string().required("Nama Jabatan is required"),
    keterangan: Yup.string(),
  });

  // Functions
  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    setLimit(10);
    setPageActive(0);
    get({ param: "?search=" + value });
  };

  const onAdd = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const onEdit = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: jabatanReducers },
      item.pk,
      API_URL_edeljabatan,
      "DELETE_JABATAN"
    );
  };

  const doSubmit = async (values, { setSubmitting }) => {
    try {
      if (editItem) {
        updateData(
          { dispatch, redux: jabatanReducers },
          {
            pk: editItem.pk,
            nama: values.nama_jabatan,
            keterangan: values.keterangan,
          },
          API_URL_edeljabatan,
          "UPDATE_JABATAN"
        );
      } else {
        addData(
          { dispatch, redux: jabatanReducers },
          {
            nama: values.nama_jabatan,
            keterangan: values.keterangan,
          },
          API_URL_createjabatan,
          "ADD_JABATAN"
        );
      }
      const offset = pageActive * limit;
      const param =
        search === ""
          ? { param: "?limit=" + limit + "&offset=" + offset }
          : { param: "?search=" + search + "&limit=" + limit + "&offset=" + offset };

      await get(param); // Fetch the data again after successful update or add

    } catch (error) {
      console.error("Error in submitting form: ", error);
    } finally {
      setSubmitting(false);
      setModalOpen(false);
    }
  };

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: jabatanReducers },
        param,
        API_URL_getjabatan,
        "GET_JABATAN"
      );
    },
    [dispatch]
  );

  const handlePageClick = (e) => {
    const offset = e.selected * limit;
    const param =
      search === ""
        ? { param: "?limit=" + limit + "&offset=" + offset }
        : {
          param:
            "?search=" + search + "&limit=" + limit + "&offset=" + offset,
        };
    get(param);
    setPageActive(e.selected);
  };

  const handleSelect = (e) => {
    const param =
      search === ""
        ? { param: "?limit=" + e }
        : {
          param: "?search=" + search + "&limit=" + e,
        };
    get(param);
    setLimit(e);
    setPageActive(0);
  };

  // Action Button
  const [actions] = useState([
    {
      name: "edit",
      icon: icons.fiedit,
      color: "text-blue-500",
      func: onEdit,
    },
    {
      name: "delete",
      icon: icons.rideletebin6line,
      color: "text-red-500",
      func: doDelete,
    },
  ]);

  // useEffect
  useEffect(() => {
    const param = { param: "?limit=" + limit + "&offset=" + pageActive * limit };
    get(param);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      addJabatanResult ||
      addPangkatResult ||
      deleteJabatanResult ||
      deletePangkatResult
    ) {
      const offset = pageActive * limit;
      const param =
        search === ""
          ? { param: "?limit=" + limit + "&offset=" + offset }
          : {
            param:
              "?search=" + search + "&limit=" + limit + "&offset=" + offset,
          };
      get(param);
    }
  }, [
    addJabatanResult,
    addPangkatResult,
    deleteJabatanResult,
    deletePangkatResult,
    dispatch,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // Adding index to data
  const dataWithIndex = getJabatanResult.results
    ? getJabatanResult.results.map((item, index) => ({
      ...item,
      index: pageActive * limit + index + 1, // Incremental index
    }))
    : [];

  return (
    <div>
      <CompCardContainer2>
        <CompTableController
          title="Jabatan"
          doSearch={doSearch}
          onAdd={onAdd}
        />
        <div className="mt-2">
          <CompTable
            dataColumns={dataColumns}
            dataTables={dataWithIndex}
            isLoading={getJabatanLoading}
            isError={getJabatanError}
            actions={actions}
          />
        </div>
        <CompPagination
          handlePageClick={handlePageClick}
          pageCount={getJabatanResult.count > 0 ? getJabatanResult.count : 0}
          limit={limit}
          setLimit={handleSelect}
          pageActive={pageActive}
        />
      </CompCardContainer2>

      {/* Modal Implementation */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 mx-2 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">{editItem ? "Edit Jabatan" : "Tambah Jabatan"}</h2>
            <Formik
              initialValues={{
                nama_jabatan: editItem ? editItem.nama : "",
                keterangan: editItem ? editItem.keterangan : "",
              }}
              validationSchema={validationSchema}
              onSubmit={doSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="grid grid-cols-1 gap-4 bg-gray-100 p-2 rounded-lg">
                    <div>
                      <label htmlFor="nama_jabatan" className="block text-sm font-medium text-gray-700">
                        Nama Jabatan<span className="text-red-500">*</span>
                      </label>
                      <Field
                        id="nama_jabatan"
                        name="nama_jabatan"
                        type="text"
                        placeholder="Input Jabatan"
                        className="mt-1 block w-full rounded-md p-2 border border-black shadow-sm sm:text-sm"
                      />
                      <ErrorMessage name="nama_jabatan" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    <div>
                      <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">Keterangan</label>
                      <Field
                        id="keterangan"
                        name="keterangan"
                        as="textarea"
                        placeholder="Input Keterangan"
                        className="mt-1 block w-full rounded-md p-2 border border-black shadow-sm sm:text-sm"
                      />
                      <ErrorMessage name="keterangan" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      className="bg-gray-300 px-6 py-2.5 rounded font-medium text-xs leading-tight"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <CompButton
                      btnName={"Submit"}
                      doClick={() => { }}
                      onLoading={isSubmitting}
                      type="button"
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default JabatanSub;
