import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// components
import {
  Button,
  Container,
  Pagination,
  Tables,
  Modal,
  InputText,
  InputSelect,
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
  API_URL_createunit,
  API_URL_edelunit,
  API_URL_getunit,
  API_URL_getspesifikdivisi,
  API_URL_getmasterpegawai,
} from "@/constants";
import { unitReducers } from "@/reducers/organReducers";
import axiosAPI from "@/authentication/axiosApi";

const UnitSub = () => {
  const {
    getUnitResult,
    getUnitLoading,
    getUnitError,
    addDepartemenResult,
    addDivisiResult,
    addUnitResult,
    addUnitLoading,
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
  const [departemenOptions, setDepartemenOptions] = useState([]);
  const [divisiOptions, setDivisiOptions] = useState([]);

  // dataColumns
  const [dataColumns] = useState([
    { name: "ID", value: "index" },
    { name: "Nama Departemen", value: "divisi.departemen.nama" },
    { name: "Nama Divisi", value: "divisi.nama" },
    { name: "Nama Unit", value: "nama" },
  ]);

  // Validation schema
  const validationSchema = Yup.object({
    nama_unit: Yup.string().required('Nama Unit is required'),
    departemen: Yup.string().required('Departemen is required'),
    divisi: Yup.string().required('Divisi is required'),
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
      { dispatch, redux: unitReducers },
      item.pk,
      API_URL_edelunit,
      "DELETE_UNIT"
    );
  };

  const doSubmit = async (values, { resetForm }) => {
    try {
      if (editItem) {
        updateData(
          { dispatch, redux: unitReducers },
          {
            pk: editItem.pk,
            nama: values.nama_unit,
            divisi_id: values.divisi,
          },
          API_URL_edelunit,
          "UPDATE_UNIT"
        );
      } else {
        addData(
          { dispatch, redux: unitReducers },
          { nama: values.nama_unit, divisi_id: values.divisi },
          API_URL_createunit,
          "ADD_UNIT"
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
        { dispatch, redux: unitReducers },
        param,
        API_URL_getunit,
        "GET_UNIT"
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

  // Fetch data
  const fetchData = useCallback(
    async (param = false) => {
      setModalOpen(false);
      get(param ? param : { param: "?limit=" + limit });

      const res_pegawai = await axiosAPI.get(API_URL_getmasterpegawai);
      setDepartemenOptions(
        res_pegawai.data.departemen.map((item) => ({
          value: item.pk,
          label: item.nama,
        }))
      );
      setDivisiOptions(
        res_pegawai.data.divisi.map((item) => ({
          value: item.pk,
          label: item.nama,
        }))
      );
    },
    [modalOpen, limit, get]
  );

  useEffect(() => {
    fetchData();
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
      fetchData(param);
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
  const dataWithIndex = getUnitResult.results
    ? getUnitResult.results.map((item, index) => ({
      ...item,
      index: pageActive * limit + index + 1, // Incremental index
    }))
    : [];

  return (
    <div>
      <Container>
        <div className="mt-2">
          <Tables
            dataColumns={dataColumns}
            dataTabless={dataWithIndex}
            isLoading={getUnitLoading}
            isError={getUnitError}
            actions={actions}
          />
        </div>
        <Pagination
          handlePageClick={handlePageClick}
          pageCount={getUnitResult.count > 0 ? getUnitResult.count : 0}
          limit={limit}
          setLimit={handleSelect}
          pageActive={pageActive}
        />
      </Container>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Edit Unit" : "Tambah Unit"}
      >
        <Formik
          initialValues={{
            nama_unit: editItem ? editItem.nama : "",
            departemen: editItem ? editItem.divisi.departemen.id : "",
            divisi: editItem ? editItem.divisi.id : "",
          }}
          validationSchema={validationSchema}
          onSubmit={doSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 gap-4 p-2 rounded-lg dark:bg-gray-800">
              <InputText
                label="Nama Unit"
                name="nama_unit"
                placeholder="Input Unit"
              />
              <InputSelect
                label="Nama Departemen"
                name="departemen"
                options={departemenOptions}
                placeholder="Select Departemen"
              />
              <InputSelect
                label="Nama Divisi"
                name="divisi"
                options={divisiOptions}
                placeholder="Select Divisi"
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

export default UnitSub;
