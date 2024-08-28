import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addData,
  deleteData,
  getData,
  handleInputError,
  updateData,
} from "../../../../actions";
import { pangkatReducers } from "../../../../reducers/strataReducers";
import {
  API_URL_createpangkat,
  API_URL_edelpangkat,
  API_URL_getpangkat,
} from "../../../../constants";
import { icons } from "../../../../../public/icons";
import {
  CompButton,
  CompCardContainer,
  CompCardContainer2,
  CompForm,
  CompPagination,
  CompTable,
  CompTableController,
} from "../../../../components";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const PangkatSub = () => {
  const {
    getPangkatResult,
    getPangkatLoading,
    getPangkatError,
    addPangkatResult,
    addJabatanResult,
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

  const dataColumns = [
    { name: "ID", value: "index" },  // Changed to index
    { name: "Nama Pangkat", value: "nama" },
    { name: "Grade", value: "grade" },
    { name: "Level", value: "level" },
    { name: "Keterangan", value: "keterangan" },
  ];

  const validationSchema = Yup.object({
    nama_pangkat: Yup.string().required("Nama Pangkat is required"),
    grade: Yup.string().required("Grade is required"),
    level: Yup.string().required("Level is required"),
  });

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
      { dispatch, redux: pangkatReducers },
      item.pk,
      API_URL_edelpangkat,
      "DELETE_PANGKAT"
    );
  };

  const doSubmit = async (values, { setSubmitting }) => {
    try {
      if (editItem) {
        updateData(
          { dispatch, redux: pangkatReducers },
          {
            pk: editItem.pk,
            nama: values.nama_pangkat,
            grade: values.grade,
            level: values.level,
            keterangan: values.keterangan,
          },
          API_URL_edelpangkat,
          "UPDATE_PANGKAT"
        );
      } else {
        addData(
          { dispatch, redux: pangkatReducers },
          {
            nama: values.nama_pangkat,
            grade: values.grade,
            level: values.level,
            keterangan: values.keterangan,
          },
          API_URL_createpangkat,
          "ADD_PANGKAT"
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
        { dispatch, redux: pangkatReducers },
        param,
        API_URL_getpangkat,
        "GET_PANGKAT"
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
  const dataWithIndex = getPangkatResult.results
    ? getPangkatResult.results.map((item, index) => ({
      ...item,
      index: pageActive * limit + index + 1, // Incremental index
    }))
    : [];

  return (
    <div>
      <CompCardContainer2>
        <CompTableController
          title="Pangkat"
          doSearch={doSearch}
          onAdd={onAdd}
        />
        <div className="mt-2">
          <CompTable
            dataColumns={dataColumns}
            dataTables={dataWithIndex}
            isLoading={getPangkatLoading}
            isError={getPangkatError}
            actions={actions}
          />
        </div>
        <CompPagination
          handlePageClick={handlePageClick}
          pageCount={getPangkatResult.count > 0 ? getPangkatResult.count : 0}
          limit={limit}
          setLimit={handleSelect}
          pageActive={pageActive}
        />
      </CompCardContainer2>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 mx-2 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editItem ? "Edit Pangkat" : "Tambah Pangkat"}</h2>
            <Formik
              initialValues={{
                nama_pangkat: editItem ? editItem.nama : "",
                grade: editItem ? editItem.grade : "",
                level: editItem ? editItem.level : "",
                keterangan: editItem ? editItem.keterangan : "",
              }}
              validationSchema={validationSchema}
              onSubmit={doSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="grid grid-cols-1 gap-4 bg-gray-100 p-2 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nama Pangkat<span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="nama_pangkat"
                        className="mt-1 block w-full rounded-md p-2 border border-black shadow-sm sm:text-sm"
                        placeholder="Input Pangkat"
                      />
                      <ErrorMessage
                        name="nama_pangkat"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Grade<span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="grade"
                        className="mt-1 block w-full rounded-md p-2 border border-black shadow-sm sm:text-sm"
                        placeholder="Input Grade"
                      />
                      <ErrorMessage
                        name="grade"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Level<span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="level"
                        className="mt-1 block w-full rounded-md p-2 border border-black shadow-sm sm:text-sm"
                        placeholder="Input Level"
                      />
                      <ErrorMessage
                        name="level"
                        component="div"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Keterangan</label>
                      <Field
                        as="textarea"
                        name="keterangan"
                        className="mt-1 block w-full rounded-md p-2 border border-black shadow-sm sm:text-sm"
                        placeholder="Input Keterangan"
                      />
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
                      btnName="Submit"
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

export default PangkatSub;
