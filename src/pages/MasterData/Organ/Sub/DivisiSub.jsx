import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// components
import {
  Button,
  CardContainer,
  Pagination,
  Table,
  Modal,
  InputText,
  InputSelect,
  TableController,
} from "@/components";
import { icons } from "../../../../../public/icons";

// functions
import {
  addData,
  deleteData,
  getData,
  updateData,
} from "@/actions";
import {
  API_URL_createdivisi,
  API_URL_edeldivisi,
  API_URL_getdivisi,
  API_URL_getspesifikdepartemen,
} from "@/constants";
import { divisiReducers } from "@/reducers/organReducers";
import axiosAPI from "@/authentication/axiosApi";

const DivisiSub = () => {
  const {
    getDivisiResult,
    getDivisiLoading,
    getDivisiError,
    addDivisiResult,
    deleteDivisiResult,
  } = useSelector((state) => state.organ);
  const dispatch = useDispatch();

  // States & Variables
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [options, setOptions] = useState([]);

  const [dataColumns] = useState([
    { name: "ID", value: "index" },
    { name: "Nama Departemen", value: "departemen.nama" },
    { name: "Nama Divisi", value: "nama" },
  ]);

  // Formik validation schema
  const validationSchema = Yup.object({
    nama_divisi: Yup.string().required("Nama Divisi is required"),
    divisi: Yup.string().required("Nama Departemen is required"),
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
      { dispatch, redux: divisiReducers },
      item.pk,
      API_URL_edeldivisi,
      "DELETE_DIVISI"
    );
  };

  const doSubmit = async (values, { resetForm }) => {
    try {
      if (editItem) {
        updateData(
          { dispatch, redux: divisiReducers },
          {
            pk: editItem.pk,
            nama: values.nama_divisi,
            departemen_id: values.divisi,
          },
          API_URL_edeldivisi,
          "UPDATE_DIVISI"
        );
      } else {
        addData(
          { dispatch, redux: divisiReducers },
          { nama: values.nama_divisi, departemen_id: values.divisi },
          API_URL_createdivisi,
          "ADD_DIVISI"
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
      resetForm(false);
      setModalOpen(false);
    }
  };

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: divisiReducers },
        param,
        API_URL_getdivisi,
        "GET_DIVISI"
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

  useEffect(() => {
    const fetchData = async () => {
      get({ param: "?limit=" + limit });
      const response = await axiosAPI.get(API_URL_getspesifikdepartemen);
      setOptions(response.data.map((item) => ({
        value: item.pk,
        label: item.nama,
      })));
    };

    fetchData();
  }, [limit, get]);

  useEffect(() => {
    if (
      addDivisiResult ||
      deleteDivisiResult
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
    addDivisiResult,
    deleteDivisiResult,
    dispatch,
    pageActive,
    limit,
    search,
    get
  ]);

  // Adding index to data
  const dataWithIndex = getDivisiResult.results
    ? getDivisiResult.results.map((item, index) => ({
      ...item,
      index: pageActive * limit + index + 1, // Incremental index
    }))
    : [];

  return (
    <div>
      <CardContainer>
        <TableController
          title="Divisi"
          doSearch={doSearch}
          onAdd={onAdd}
        />
        <div className="mt-2">
          <Table
            dataColumns={dataColumns}
            dataTables={dataWithIndex}
            isLoading={getDivisiLoading}
            isError={getDivisiError}
            actions={actions}
          />
        </div>
        <Pagination
          handlePageClick={handlePageClick}
          pageCount={getDivisiResult.count > 0 ? getDivisiResult.count : 0}
          limit={limit}
          pageActive={pageActive}
          setLimit={handleSelect}
        />
      </CardContainer>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Edit Divisi" : "Tambah Divisi"}
      >
        <Formik
          initialValues={{
            nama_divisi: editItem ? editItem.nama : "",
            divisi: editItem ? editItem.departemen.id : "",
          }}
          validationSchema={validationSchema}
          onSubmit={doSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 gap-4 p-2 rounded-lg dark:bg-gray-800">
              <InputSelect
                label="Nama Departemen"
                name="divisi"
                options={options}
                placeholder="Select Departemen"
              />
              <InputText
                label="Nama Divisi"
                name="nama_divisi"
                placeholder="Input Divisi"
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
      </Modal >
    </div>
  );
};

export default DivisiSub;
