import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CardContainer,
  Table,
  TableController,
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
import axiosAPI from "@/authentication/axiosApi";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
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
  }, [fetchData]);

  useEffect(() => {
    if (addPegawaiResult || deletePegawaiResult) {
      fetchData();
    }
  }, [addPegawaiResult, deletePegawaiResult, fetchData]);

  useEffect(() => {
    if (firstFetch) {
      const getData = setTimeout(() => {
        get({ param: "?search=" + search });
      }, 1000);
      return () => clearTimeout(getData);
    }
  }, [search, firstFetch, get]);

  // Fetch cabang options when the component mounts
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
      <CardContainer>
        <TableController title="Pegawai" doSearch={doSearch} onAdd={onAdd} />
        <div className="mt-2">
          <Table
            dataColumns={dataColumns}
            dataTables={
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
          handlePageClick={(e) => setPageActive(e.selected)}
          handleLimitChange={(e) => setLimit(e.target.value)}
          pageActive={pageActive}
          limit={limit}
          totalItems={getPegawaiResult.count}
        />
      </CardContainer>
      <Modal
        isOpen={modal.modalOpen}
        setIsOpen={() => setModal({ ...modal, modalOpen: false })}
        title={modal.modalTitle}
      >
        <Formik
          initialValues={modal.initialValues}
          validationSchema={
            modal.modalType === "add" ? validationSchemaPribadi : validationSchemaPegawai
          }
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              {activeTab === "pribadi" && (
                <>
                  <InputText
                    label="Nama"
                    name="nama"
                    placeholder="Nama"
                    required
                    error={errors.nama}
                    touched={touched.nama}
                  />
                  <InputText
                    label="Username"
                    name="username"
                    placeholder="Username"
                    required
                    error={errors.username}
                    touched={touched.username}
                  />
                  <InputEmail
                    label="Email"
                    name="email"
                    placeholder="Email"
                    required
                    error={errors.email}
                    touched={touched.email}
                  />
                  <InputText
                    label="No Identitas"
                    name="no_identitas"
                    placeholder="No Identitas"
                    required
                    error={errors.no_identitas}
                    touched={touched.no_identitas}
                  />
                  <InputSelect
                    label="Jenis Kelamin"
                    name="jenis_kelamin"
                    placeholder="Jenis Kelamin"
                    options={[
                      { value: "", label: "Select" },
                      { value: "L", label: "Laki-laki" },
                      { value: "P", label: "Perempuan" },
                    ]}
                    required
                    error={errors.jenis_kelamin}
                    touched={touched.jenis_kelamin}
                  />
                  <InputText
                    label="No Telepon"
                    name="no_telepon"
                    placeholder="No Telepon"
                    required
                    error={errors.no_telepon}
                    touched={touched.no_telepon}
                  />
                  <InputText
                    label="Tempat Lahir"
                    name="tempat_lahir"
                    placeholder="Tempat Lahir"
                    required
                    error={errors.tempat_lahir}
                    touched={touched.tempat_lahir}
                  />
                  <InputDate
                    label="Tanggal Lahir"
                    name="tgl_lahir"
                    placeholder="Tanggal Lahir"
                    required
                    error={errors.tgl_lahir}
                    touched={touched.tgl_lahir}
                  />
                  <InputText
                    label="Agama"
                    name="agama"
                    placeholder="Agama"
                    required
                    error={errors.agama}
                    touched={touched.agama}
                  />
                  <InputText
                    label="NPWP"
                    name="npwp"
                    placeholder="NPWP"
                    required
                    error={errors.npwp}
                    touched={touched.npwp}
                  />
                  <InputText
                    label="Alamat KTP"
                    name="alamat_ktp"
                    placeholder="Alamat KTP"
                    required
                    error={errors.alamat_ktp}
                    touched={touched.alamat_ktp}
                  />
                  <InputText
                    label="Alamat Domisili"
                    name="alamat_domisili"
                    placeholder="Alamat Domisili"
                    required
                    error={errors.alamat_domisili}
                    touched={touched.alamat_domisili}
                  />
                  <InputSelect
                    label="Cabang"
                    name="cabang_id"
                    placeholder="Cabang"
                    options={cabangOptions}
                    required
                    error={errors.cabang_id}
                    touched={touched.cabang_id}
                  />
                </>
              )}
              {activeTab === "pegawai" && (
                <>
                  <InputText
                    label="ID Pegawai"
                    name="id_pegawai"
                    placeholder="ID Pegawai"
                    required
                    error={errors.id_pegawai}
                    touched={touched.id_pegawai}
                  />
                  <InputSelect
                    label="Pangkat"
                    name="pangkat_id"
                    placeholder="Pangkat"
                    options={[]} // Populate these options based on your API data
                    required
                    error={errors.pangkat_id}
                    touched={touched.pangkat_id}
                  />
                  <InputSelect
                    label="Jabatan"
                    name="jabatan_id"
                    placeholder="Jabatan"
                    options={[]} // Populate these options based on your API data
                    required
                    error={errors.jabatan_id}
                    touched={touched.jabatan_id}
                  />
                  <InputSelect
                    label="Departemen"
                    name="departemen_id"
                    placeholder="Departemen"
                    options={[]} // Populate these options based on your API data
                    required
                    error={errors.departemen_id}
                    touched={touched.departemen_id}
                  />
                  <InputSelect
                    label="Divisi"
                    name="divisi_id"
                    placeholder="Divisi"
                    options={[]} // Populate these options based on your API data
                    required
                    error={errors.divisi_id}
                    touched={touched.divisi_id}
                  />
                  <InputSelect
                    label="Unit"
                    name="unit_id"
                    placeholder="Unit"
                    options={[]} // Populate these options based on your API data
                    required
                    error={errors.unit_id}
                    touched={touched.unit_id}
                  />
                  <InputDate
                    label="Tanggal Bergabung"
                    name="tgl_bergabung"
                    placeholder="Tanggal Bergabung"
                    required
                    error={errors.tgl_bergabung}
                    touched={touched.tgl_bergabung}
                  />
                  <InputDate
                    label="Tanggal Resign"
                    name="tgl_resign"
                    placeholder="Tanggal Resign"
                    error={errors.tgl_resign}
                    touched={touched.tgl_resign}
                  />
                </>
              )}
              <div className="flex justify-end mt-4">
                <Button type="submit" color="blue">
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default PegawaiPage;
