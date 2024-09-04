import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addData,
  deleteData,
  getData,
  updateData,
} from "@/actions";
import { pangkatReducers } from "@/reducers/strataReducers";
import {
  API_URL_createpangkat,
  API_URL_edelpangkat,
  API_URL_getpangkat,
} from "@/constants";
import { icons } from "../../../../../public/icons";
import {
  Button,
  Container,
  Pagination,
  Tables,
  Modal,
  InputText,
  InputTextArea,
} from "@/components";
import { Formik, Form } from "formik";
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
    { name: "ID", value: "index" },
    { name: "Nama Pangkat", value: "nama" },
    { name: "Grade", value: "grade" },
    { name: "Level", value: "level" },
    { name: "Keterangan", value: "keterangan" },
  ];

  const validationSchema = Yup.object({
    nama_pangkat: Yup.string().required("Nama Pangkat is required"),
    grade: Yup.string().required("Grade is required"),
    level: Yup.number()
      .typeError("Level must be a number")
      .required("Level is required")
      .positive("Level must be a positive number")
      .integer("Level must be an integer")
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

      await get(param);

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

  const dataWithIndex = getPangkatResult.results
    ? getPangkatResult.results.map((item, index) => ({
      ...item,
      index: pageActive * limit + index + 1,
    }))
    : [];

  return (
    <div>
      <Container>
        <div className="mt-2">
          <Tables
            dataColumns={dataColumns}
            dataTabless={dataWithIndex}
            isLoading={getPangkatLoading}
            isError={getPangkatError}
            actions={actions}
          />
        </div>
        <Pagination
          handlePageClick={handlePageClick}
          pageCount={getPangkatResult.count > 0 ? getPangkatResult.count : 0}
          limit={limit}
          setLimit={handleSelect}
          pageActive={pageActive}
        />
      </Container>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Edit Pangkat" : "Tambah Pangkat"}
      >
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
            <Form className="grid grid-cols-1 gap-4 p-2 rounded-lg dark:bg-gray-800">
              <InputText
                label="Nama Pangkat"
                name="nama_pangkat"
                placeholder="Input Pangkat"
              />
              <InputText
                label="Grade"
                name="grade"
                placeholder="Input Grade"
              />
              <InputText
                label="Level"
                name="level"
                placeholder="Input Level"
              />
              <InputTextArea
                label="Keterangan"
                name="keterangan"
                placeholder="Input Keterangan"
              />
              <div className="flex justify-end mt-4">
                <Button
                  btnName="Submit"
                  doClick={() => { }}
                  onLoading={isSubmitting}
                  type="submit"
                />
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default PangkatSub;