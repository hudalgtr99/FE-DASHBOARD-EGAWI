import {
  Button,
  CardContainer,
  Pagination,
  Table,
  TableController,
  Modal,
  InputText,
  InputTextArea,
} from "@/components";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  addData,
  deleteData,
  getData,
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
      <CardContainer>
        <TableController
          title="Jabatan"
          doSearch={doSearch}
          onAdd={onAdd}
        />
        <div className="mt-2">
          <Table
            dataColumns={dataColumns}
            dataTables={dataWithIndex}
            isLoading={getJabatanLoading}
            isError={getJabatanError}
            actions={actions}
          />
        </div>
        <Pagination
          handlePageClick={handlePageClick}
          pageCount={getJabatanResult.count > 0 ? getJabatanResult.count : 0}
          limit={limit}
          setLimit={handleSelect}
          pageActive={pageActive}
        />
      </CardContainer>

      {/* Modal Implementation */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Edit Jabatan" : "Tambah Jabatan"}
      >
        <Formik
          initialValues={{
            nama_jabatan: editItem ? editItem.nama : "",
            keterangan: editItem ? editItem.keterangan : "",
          }}
          validationSchema={validationSchema}
          onSubmit={doSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 gap-4 p-2 rounded-lg dark:bg-gray-800">
              <InputText
                label="Nama Jabatan"
                name="nama_jabatan"
                placeholder="Input Jabatan"
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

export default JabatanSub;
