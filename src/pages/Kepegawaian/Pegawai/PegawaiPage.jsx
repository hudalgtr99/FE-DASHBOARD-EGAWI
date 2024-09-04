import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Tables,
  Pagination,
  Modal,
  InputText,
  InputEmail,
  InputSelect,
  InputDate,
  Button,
} from "@/components";
import { icons } from "../../../../public/icons";
import {
  addData,
  deleteData,
  getData,
  updateData,
} from "@/actions";
import {
  API_URL_createuser,
  API_URL_edeluser,
  API_URL_getdatapegawai,
  API_URL_getcabang,
} from "@/constants";
import { pegawaiReducer } from "@/reducers/kepegawaianReducers";
import * as Yup from "yup";
import { Formik, Form, } from "formik";
import axiosAPI from "@/authentication/axiosApi";
import classNames from "classnames";

const PegawaiPage = () => {
  const {
    getPegawaiResult,
    getPegawaiLoading,
    getPegawaiError,
    addPegawaiResult,
    deletePegawaiResult,
  } = useSelector((state) => state.kepegawaian);
  const dispatch = useDispatch();

  const [firstFetch, setFirstFetch] = useState(false);
  const [limit, setLimit] = useState(10);
  const [pageActive, setPageActive] = useState(0);
  const [cabangOptions, setCabangOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({
    modalOpen: false,
    modalTitle: "Pegawai",
    modalType: "add",
    initialValues: {},
  });
  const [activeTab, setActiveTab] = useState("pribadi");

  const [dataColumns] = useState([
    { name: "No", value: "no" },
    { name: "ID Pegawai", value: "datapegawai.id_pegawai" },
    { name: "Nama Pegawai", value: "datapribadi.nama" },
    { name: "Pangkat", value: "datapegawai.pangkat.nama" },
    { name: "Jabatan", value: "datapegawai.jabatan.nama" },
    { name: "Departemen", value: "datapegawai.departemen.nama" },
    { name: "Divisi", value: "datapegawai.divisi.nama" },
    { name: "Unit", value: "datapegawai.unit.nama" },
  ]);

  const initialValuesPribadi = {
    nama: "",
    username: "",
    email: "",
    no_identitas: "",
    jenis_kelamin: "",
    no_telepon: "",
    tempat_lahir: "",
    tgl_lahir: "",
    agama: "",
    npwp: "",
    alamat_ktp: "",
    alamat_domisili: "",
    cabang_id: "",
  };

  const validationSchemaPribadi = Yup.object({
    nama: Yup.string().required("Nama is required"),
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    no_identitas: Yup.string().required("No Identitas is required"),
    jenis_kelamin: Yup.string().required("Jenis Kelamin is required"),
    no_telepon: Yup.string().required("No Telepon is required"),
    tempat_lahir: Yup.string().required("Tempat Lahir is required"),
    tgl_lahir: Yup.date().required("Tanggal Lahir is required"),
    agama: Yup.string().required("Agama is required"),
    npwp: Yup.string().required("NPWP is required"),
    alamat_ktp: Yup.string().required("Alamat KTP is required"),
    alamat_domisili: Yup.string().required("Alamat Domisili is required"),
  });

  const initialValuesPegawai = {
    id_pegawai: "",
    pangkat_id: "",
    jabatan_id: "",
    departemen_id: "",
    divisi_id: "",
    unit_id: "",
    tgl_bergabung: "",
    tgl_resign: "",
  };

  const validationSchemaPegawai = Yup.object({
    id_pegawai: Yup.string().required("ID Pegawai is required"),
    pangkat_id: Yup.string().required("Pangkat is required"),
    jabatan_id: Yup.string().required("Jabatan is required"),
    departemen_id: Yup.string().required("Departemen is required"),
    divisi_id: Yup.string().required("Divisi is required"),
    unit_id: Yup.string().required("Unit is required"),
    tgl_bergabung: Yup.date().required("Tanggal Bergabung is required"),
    tgl_resign: Yup.date().nullable(),
  });

  const doSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    setLimit(10);
    setPageActive(0);
  };

  const onAdd = () => {
    setModal({
      modalOpen: true,
      modalTitle: "Tambah Pegawai",
      modalType: "add",
      initialValues: { ...initialValuesPribadi, ...initialValuesPegawai },
    });
  };

  const onEdit = (item) => {
    setModal({
      modalOpen: true,
      modalTitle: "Edit Pegawai",
      modalType: "edit",
      initialValues: {
        ...item.datapribadi,
        ...item.datapegawai,
      },
    });
  };

  const doDelete = (item) => {
    deleteData(
      { dispatch, redux: pegawaiReducer },
      item.datapribadi.user_id,
      API_URL_edeluser,
      "DELETE_PEGAWAI"
    );
  };

  const handleSubmit = (values) => {
    if (modal.modalType === "add") {
      addData(
        { dispatch, redux: pegawaiReducer },
        values,
        API_URL_createuser,
        "ADD_PEGAWAI"
      );
    } else {
      updateData(
        { dispatch, redux: pegawaiReducer },
        values,
        API_URL_edeluser,
        "UPDATE_PEGAWAI"
      );
    }
    setModal({ ...modal, modalOpen: false });
  };

  const get = useCallback(
    async (param) => {
      getData(
        { dispatch, redux: pegawaiReducer },
        param,
        API_URL_getdatapegawai,
        "GET_PEGAWAI"
      );
    },
    [dispatch]
  );

  const fetchData = useCallback(async () => {
    get({ param: "?limit=" + limit });
  }, [limit, get]);

  useEffect(() => {
    fetchData();
    setFirstFetch(true);
  }, []);

  useEffect(() => {
    if (addPegawaiResult || deletePegawaiResult) {
      fetchData();
    }
  }, [addPegawaiResult, deletePegawaiResult, fetchData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (firstFetch) {
      const getData = setTimeout(() => {
        get({ param: "?search=" + search });
      }, 1000);
      return () => clearTimeout(getData);
    }
  }, [search, firstFetch, get]);

  useEffect(() => {
    const fetchCabangOptions = async () => {
      try {
        const response = await axiosAPI.get(API_URL_getcabang);
        setCabangOptions(response.data.map(cabang => ({
          value: cabang.pk,
          label: cabang.nama,
        })));
      } catch (error) {
        console.error('Error fetching cabang options:', error);
      }
    };
    fetchCabangOptions();
  }, []);

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

  return (
    <div>
      <Container>
        <div className="mt-2">
          <Tables
            dataColumns={dataColumns}
            dataTabless={
              getPegawaiResult.count > 0 ? getPegawaiResult.results : null
            }
            isLoading={getPegawaiLoading}
            isError={getPegawaiError}
            actions={actions}
            modal={modal}
            setModal={setModal}
          />
        </div>
        <Pagination
          handlePageClick={(e) => handlePageClick(e)}
          pageCount={getPegawaiResult.count > 0 ? getPegawaiResult.count : 0}
          limit={limit}
          setLimit={(e) => handleSelect(e)}
          pageActive={pageActive}
        />
      </Container>

      <Modal
        isOpen={modal.modalOpen}
        onClose={() => setModal({ ...modal, modalOpen: false })}
        title={modal.modalTitle}
      >
        <div className="flex justify-between border-b mb-6">
          <button
            className={classNames("w-1/2 py-2", {
              "border-b-2 border-blue-500": activeTab === "pribadi",
              "text-gray-500": activeTab !== "pribadi",
            })}
            onClick={() => setActiveTab("pribadi")}
          >
            Data Pribadi
          </button>
          <button
            className={classNames("w-1/2 py-2", {
              "border-b-2 border-blue-500": activeTab === "pegawai",
              "text-gray-500": activeTab !== "pegawai",
            })}
            onClick={() => setActiveTab("pegawai")}
          >
            Data Pegawai
          </button>
        </div>

        {activeTab === "pribadi" ? (
          <Formik
            initialValues={modal.initialValues}
            validationSchema={validationSchemaPribadi}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="grid grid-cols-1 gap-4 p-2 rounded-lg dark:bg-gray-800">
                <InputText
                  label="Nama"
                  name="nama"
                  placeholder="Nama"
                />
                <InputText
                  label="Username"
                  name="username"
                  placeholder="Username"
                />
                <InputEmail
                  label="Email"
                  name="email"
                  placeholder="Email"
                />
                <InputText
                  label="No Identitas (KTP)"
                  name="no_identitas"
                  placeholder="No Identitas (KTP)"
                />
                <InputSelect
                  label="Jenis Kelamin"
                  name="jenis_kelamin"
                  options={[
                    { value: "Laki-laki", label: "Laki-laki" },
                    { value: "Perempuan", label: "Perempuan" },
                  ]}
                  placeholder="Pilih Jenis Kelamin"
                />
                <InputText
                  label="No Telepon"
                  name="no_telepon"
                  placeholder="No Telepon"
                />
                <InputText
                  label="Tempat Lahir"
                  name="tempat_lahir"
                  placeholder="Tempat Lahir"
                />
                <InputDate
                  label="Tanggal Lahir"
                  name="tgl_lahir"
                  placeholder="Tanggal Lahir"
                />
                <InputSelect
                  label="Agama"
                  name="agama"
                  options={[
                    { label: "Islam", value: "Islam" },
                    { label: "Protestan", value: "Protestan" },
                    { label: "Katolik", value: "Katolik" },
                    { label: "Hindu", value: "Hindu" },
                    { label: "Buddha", value: "Buddha" },
                    { label: "Khonghucu", value: "Khonghucu" },
                  ]}
                  placeholder="Pilih Agama"
                />
                <InputText
                  label="NPWP"
                  name="npwp"
                  placeholder="NPWP"
                />
                <InputText
                  label="Alamat (KTP)"
                  name="alamat_ktp"
                  placeholder="Alamat (KTP)"
                />
                <InputText
                  label="Alamat (Domisili)"
                  name="alamat_domisili"
                  placeholder="Alamat (Domisili)"
                />
                <InputSelect
                  label="Cabang"
                  name="cabang_id"
                  options={cabangOptions}
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
        ) : (
          <Formik
            initialValues={modal.initialValues}
            validationSchema={validationSchemaPegawai}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="grid grid-cols-1 gap-4 p-2 rounded-lg dark:bg-gray-800">
                <InputText
                  label="ID Pegawai"
                  name="id_pegawai"
                  placeholder="Input ID Pegawai"
                />
                <InputText
                  label="Pangkat"
                  name="pangkat_id"
                  placeholder="Input Pangkat"
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
        )}
      </Modal>
    </div>
  );
};

export default PegawaiPage;
