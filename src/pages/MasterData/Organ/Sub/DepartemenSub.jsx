import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// components
import {
  Button,
  CardContainer,
  Pagination,
  Table,
  Modal,
  InputText,
  TableController,
} from "@/components";
import { icons } from "../../../../../public/icons";

// functions
import {
  addData,
  deleteData,
  getData,
  handleInputError,
  updateData,
} from "@/actions";
import {
  API_URL_createdepartemen,
  API_URL_edeldepartemen,
  API_URL_getdepartemen,
} from "@/constants";
import { departemenReducers } from "@/reducers/organReducers";

const DepartemenSub = () => {
  const {
    getDepartemenResult,
    getDepartemenLoading,
    getDepartemenError,
    addDepartemenResult,
    addDivisiResult,
    addUnitResult,
    addDepartemenLoading,
    deleteDepartemenResult,
    deleteDivisiResult,
    deleteUnitResult,
  } = useSelector((state) => state.organ);
  const dispatch = useDispatch();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [dataColumns] = useState([
    { name: "ID", value: "index" },
    { name: "Nama Departemen", value: "nama" },
  ]);

  const validationSchema = Yup.object({
    nama_departemen: Yup.string().required('Nama Departemen is required'),
  });

  // Function
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
      { dispatch, redux: departemenReducers },
      item.pk,
      API_URL_edeldepartemen,
      "DELETE_DEPARTEMEN"
    );
  };

  const doSubmit = async (values, { setSubmitting }) => {
    try {
      if (editItem) {
        updateData(
          { dispatch, redux: departemenReducers },
          { pk: editItem.pk, nama: values.nama_departemen },
          API_URL_edeldepartemen,
          "UPDATE_DEPARTEMEN"
        );
      } else {
        addData(
          { dispatch, redux: departemenReducers },
          { nama: values.nama_departemen },
          API_URL_createdepartemen,
          "ADD_DEPARTEMEN"
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
        { dispatch, redux: departemenReducers },
        param,
        API_URL_getdepartemen,
        "GET_DEPARTEMEN"
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
      addDepartemenResult ||
      addDivisiResult ||
      addUnitResult ||
      deleteDepartemenResult ||
      deleteDivisiResult ||
      deleteUnitResult
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
    addDepartemenResult,
    addDivisiResult,
    addUnitResult,
    deleteDepartemenResult,
    deleteDivisiResult,
    deleteUnitResult,
    dispatch,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // Adding index to data
  const dataWithIndex = getDepartemenResult.results
    ? getDepartemenResult.results.map((item, index) => ({
      ...item,
      index: pageActive * limit + index + 1, // Incremental index
    }))
    : [];

  return (
    <div>
      <CardContainer>
        <TableController
          title="Departemen"
          doSearch={doSearch}
          onAdd={onAdd}
        />
        <div className="mt-2">
          <Table
            dataColumns={dataColumns}
            dataTables={dataWithIndex}
            isLoading={getDepartemenLoading}
            isError={getDepartemenError}
            actions={actions}
          />
        </div>
        <Pagination
          handlePageClick={handlePageClick}
          pageCount={getDepartemenResult.count > 0 ? getDepartemenResult.count : 0}
          limit={limit}
          setLimit={handleSelect}
          pageActive={pageActive}
        />
      </CardContainer>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Edit Departemen" : "Tambah Departemen"}
      >
        <Formik
          initialValues={{
            nama_departemen: editItem ? editItem.nama : '',
          }}
          validationSchema={validationSchema}
          onSubmit={doSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 gap-4 p-2 rounded-lg dark:bg-gray-800">
              <InputText
                label="Nama Departemen"
                name="nama_departemen"
                placeholder="Input Departemen"
              />
              <div className="flex justify-end mt-4">
                <Button
                  btnName={"Submit"}
                  doClick={() => { }}
                  onLoading={isSubmitting}
                  type="button"
                />
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default DepartemenSub;
