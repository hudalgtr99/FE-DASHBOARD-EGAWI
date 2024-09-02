import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Card,
  CardContainer,
  TableController,
} from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { cabangReducer } from "@/reducers/cabangReducers";
import { icons } from "../../../../public/icons";
import axiosAPI from "@/authentication/axiosApi";
import {
  addData,
  convertJSON,
  deleteData,
  getItem,
  updateData,
} from "@/actions";
import {
  API_URL_createcabang,
  API_URL_edelcabang,
  API_URL_getcabang,
} from "@/constants";

const CabangPage = () => {
  const {
    addCabangResult,
    addCabangLoading,
    deleteCabangResult,
  } = useSelector((state) => state.cabang);
  const dispatch = useDispatch();

  const [modal, setModal] = useState({
    modalOpen: false,
    modalTitle: "Cabang",
    modalType: "add",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [card, setCard] = useState([]);
  const [jadwalData, setJadwalData] = useState({});

  const jadwalColumns = [
    { name: "Senin", value: "senin" },
    { name: "Selasa", value: "selasa" },
    { name: "Rabu", value: "rabu" },
    { name: "Kamis", value: "kamis" },
    { name: "Jumat", value: "jumat" },
    { name: "Sabtu", value: "sabtu" },
    { name: "Minggu", value: "minggu" },
  ];

  const formik = useFormik({
    initialValues: {
      pk: "",
      nama: "",
      no_telepon: "",
      latitude: "",
      longitude: "",
      radius: 25,
      senin_masuk: "08:00",
      senin_keluar: "17:00",
      selasa_masuk: "08:00",
      selasa_keluar: "17:00",
      rabu_masuk: "08:00",
      rabu_keluar: "17:00",
      kamis_masuk: "08:00",
      kamis_keluar: "17:00",
      jumat_masuk: "08:00",
      jumat_keluar: "17:00",
      sabtu_masuk: "00:00",
      sabtu_keluar: "00:00",
      minggu_masuk: "00:00",
      minggu_keluar: "00:00",
    },
    validationSchema: Yup.object({
      nama: Yup.string().required("Nama is required"),
      latitude: Yup.string().required("Latitude is required"),
      longitude: Yup.string().required("Longitude is required"),
      radius: Yup.number().required("Radius is required"),
    }),
    onSubmit: (values) => {
      const payload = {
        nama: values.nama,
        no_telepon: values.no_telepon,
        latitude: values.latitude,
        longitude: values.longitude,
        radius: values.radius,
        jadwal: JSON.stringify({
          senin: {
            masuk: values.senin_masuk,
            keluar: values.senin_keluar,
          },
          selasa: {
            masuk: values.selasa_masuk,
            keluar: values.selasa_keluar,
          },
          rabu: {
            masuk: values.rabu_masuk,
            keluar: values.rabu_keluar,
          },
          kamis: {
            masuk: values.kamis_masuk,
            keluar: values.kamis_keluar,
          },
          jumat: {
            masuk: values.jumat_masuk,
            keluar: values.jumat_keluar,
          },
          sabtu: {
            masuk: values.sabtu_masuk,
            keluar: values.sabtu_keluar,
          },
          minggu: {
            masuk: values.minggu_masuk,
            keluar: values.minggu_keluar,
          },
        }),
      };

      if (values.pk) {
        updateData(
          { dispatch, redux: cabangReducer },
          { pk: values.pk, ...payload },
          API_URL_edelcabang,
          "UPDATE_CABANG"
        );
      } else {
        addData(
          { dispatch, redux: cabangReducer },
          payload,
          API_URL_createcabang,
          "ADD_CABANG"
        );
      }
    },
  });

  const fetchData = useCallback(async () => {
    setModal({ ...modal, modalOpen: false });
    const response = await axiosAPI.get(API_URL_getcabang);
    setCard(response.data);
  }, [modal]);

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (addCabangResult) {
      fetchData();
    }
  }, [addCabangResult, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (deleteCabangResult) {
      fetchData();
    }
  }, [deleteCabangResult, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const onAdd = () => {
    formik.resetForm();
    setModal({ modalOpen: true, modalType: "add" });
  };

  const onDetail = (data) => {
    setModal({ modalOpen: true, modalType: "edit" });
    setIsEdit(false);
    setJadwalData(convertJSON(data.jadwal));
    formik.setValues({
      pk: data.pk || "",
      nama: data.nama || "",
      no_telepon: data.no_telepon || "",
      latitude: getItem("latitude", convertJSON(data.cordinate)),
      longitude: getItem("longitude", convertJSON(data.cordinate)),
      radius: data.radius || 25,
      ...convertJSON(data.jadwal),
    });
  };

  const doDelete = (id) => {
    deleteData(
      { dispatch, redux: cabangReducer },
      id,
      API_URL_edelcabang,
      "DELETE_CABANG"
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        <CardContainer>
          <TableController
            title="Cabang"
            doSearch={() => { }}
            onAdd={onAdd}
          />
        </CardContainer>
        <div className="grid grid-cols-6 gap-3">
          {card.map((item, itemIdx) => (
            <div
              key={itemIdx}
              className="col-span-full sm:col-span-3 lg:col-span-2"
            >
              <Card
                onClick={() => onDetail(item)}
                deleted
                doDelete={() => doDelete(item.pk)}
                data={item}
              >
                {item.alamat}
              </Card>
            </div>
          ))}
        </div>
      </div>

      {modal.modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-[600px] overflow-y-auto max-h-[600px] mx-2">
            <h2 className="text-lg font-semibold mb-4">
              {modal.modalType === "add" ? "Tambah Cabang" : "Edit Cabang"}
            </h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 gap-4 bg-gray-100 p-4 rounded-lg">
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
                    Nama <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nama"
                    type="text"
                    name="nama"
                    value={formik.values.nama}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm sm:text-sm"
                    aria-invalid={formik.touched.nama && formik.errors.nama ? "true" : undefined}
                    aria-describedby={formik.touched.nama && formik.errors.nama ? "nama-error" : undefined}
                  />
                  {formik.touched.nama && formik.errors.nama && (
                    <div id="nama-error" className="text-red-600 mt-1 text-sm">
                      {formik.errors.nama}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="no_telepon" className="block text-sm font-medium text-gray-700">
                    No Telepon
                  </label>
                  <input
                    id="no_telepon"
                    type="text"
                    name="no_telepon"
                    value={formik.values.no_telepon}
                    onChange={formik.handleChange}
                    className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="latitude"
                    type="text"
                    name="latitude"
                    value={formik.values.latitude}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm sm:text-sm"
                    aria-invalid={formik.touched.latitude && formik.errors.latitude ? "true" : undefined}
                    aria-describedby={formik.touched.latitude && formik.errors.latitude ? "latitude-error" : undefined}
                  />
                  {formik.touched.latitude && formik.errors.latitude && (
                    <div id="latitude-error" className="text-red-600 mt-1 text-sm">
                      {formik.errors.latitude}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="longitude"
                    type="text"
                    name="longitude"
                    value={formik.values.longitude}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm sm:text-sm"
                    aria-invalid={formik.touched.longitude && formik.errors.longitude ? "true" : undefined}
                    aria-describedby={formik.touched.longitude && formik.errors.longitude ? "longitude-error" : undefined}
                  />
                  {formik.touched.longitude && formik.errors.longitude && (
                    <div id="longitude-error" className="text-red-600 mt-1 text-sm">
                      {formik.errors.longitude}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="radius" className="block text-sm font-medium text-gray-700">
                    Radius <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="radius"
                    type="number"
                    name="radius"
                    value={formik.values.radius}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm sm:text-sm"
                    aria-invalid={formik.touched.radius && formik.errors.radius ? "true" : undefined}
                    aria-describedby={formik.touched.radius && formik.errors.radius ? "radius-error" : undefined}
                  />
                  {formik.touched.radius && formik.errors.radius && (
                    <div id="radius-error" className="text-red-600 mt-1 text-sm">
                      {formik.errors.radius}
                    </div>
                  )}
                </div>
                {jadwalColumns.map((column) => (
                  <div key={column.value} className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`${column.value}_masuk`} className="block text-sm font-medium text-gray-700">
                        {column.name} Masuk <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`${column.value}_masuk`}
                        type="time"
                        name={`${column.value}_masuk`}
                        value={formik.values[`${column.value}_masuk`]}
                        onChange={formik.handleChange}
                        className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor={`${column.value}_keluar`} className="block text-sm font-medium text-gray-700">
                        {column.name} Keluar <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`${column.value}_keluar`}
                        type="time"
                        name={`${column.value}_keluar`}
                        value={formik.values[`${column.value}_keluar`]}
                        onChange={formik.handleChange}
                        className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm sm:text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  className="bg-gray-300 px-8 py-2.5 rounded font-medium text-xs leading-tight"
                  onClick={() => setModal({ ...modal, modalOpen: false })}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-2"
                >
                  {modal.modalType === "add" ? "Tambah" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CabangPage;
