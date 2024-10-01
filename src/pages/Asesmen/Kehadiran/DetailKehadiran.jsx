import {
  Button,
  Container,
  Modal,
} from "@/components";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { icons } from "../../../../public/icons";
import {
  API_URL_createabsensi,
  API_URL_getdetailkehadiran,
  baseurl,
} from "@/constants";
import { updateFormData } from "@/actions";
import { useDispatch, useSelector } from "react-redux";
import { userReducer } from "@/reducers/authReducers";
import { PulseLoader } from "react-spinners";
import moment from "moment";
import "moment/locale/id";
import axiosAPI from "@/authentication/axiosApi";
import { useFormik } from "formik";

const DetailKehadiran = () => {
  const { addUserAbsensiResult, addUserAbsensiLoading } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dataTables, setDataTables] = useState([]);
  const [modalEdit, setModalEdit] = useState({
    modalOpen: false,
    modalTitle: "Edit Kehadiran",
  });
  const [modal, setModal] = useState({
    modalOpen: false,
    modalTitle: "Detail Kehadiran",
  });
  const [detail, setDetail] = useState({});

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      tanggal: '',
      tipe_absen: '',
      latitude: '',
      longitude: '',
      gambar: '',
    },
    onSubmit: (values) => {
      const locationNow = {
        latitude: values.latitude,
        longitude: values.longitude,
      };

      const formData = new FormData();
      formData.append("waktu", values.tanggal);
      formData.append("tipe_absen", values.tipe_absen);
      formData.append("lokasi", JSON.stringify(locationNow));
      formData.append("image", values.gambar);

      updateFormData(
        { dispatch, redux: userReducer },
        formData,
        API_URL_createabsensi,
        "ADD_ABSENSI",
        location.state.user_id
      );
    },
  });

  const showDetail = (item) => {
    setModal({
      ...modal,
      modalOpen: !modal.modalOpen,
      modalTitle: moment(item.tanggal).format("dddd, DD MMMM YYYY"),
    });
    setDetail(item);
  };

  const onEdit = (item) => {
    // Open edit modal and populate it with the selected item data
    setModalEdit({ ...modalEdit, modalOpen: true });
    formik.setValues({
      tanggal: item.tanggal,
      tipe_absen: item.tipe_absen,
      latitude: item.latitude,
      longitude: item.longitude,
      gambar: '',
    });
  };

  // Handle Form File Input
  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue('gambar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchData = useCallback(async () => {
    setModalEdit({ ...modalEdit, modalOpen: false });
    setLoading(true);
    axiosAPI
      .post(API_URL_getdetailkehadiran, {
        "date-month": location.state.date,
        user_id: location.state.user_id,
      })
      .then((res) => {
        setLoading(false);
        setDataTables(res.data);
      })
      .catch(function (error) {
        setLoading(false);
        setError(error);
      });
  }, [modalEdit, location]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (addUserAbsensiResult) {
      fetchData();
    }
  }, [addUserAbsensiResult, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Fragment>
      <Container>
        <div className="flex justify-between items-center">
          <span
            onClick={() => navigate(-1)}
            className="px-3 py-2 items-center rounded-lg bg-[#f3f4f6] text-xs cursor-pointer text-grey-600"
          >
            Back
          </span>
          <div className="text-grey-600 cursor-pointer" onClick={() => onEdit(detail)}>
            {icons.fiedit}
          </div>
        </div>

        {/* Data */}
        <div className="pt-4 pb-2 w-auto">
          <div className="overflow-x-auto custom-scroll">
            <table className="w-full">
              <thead className="bg-transparent border-b border-grey-300">
                <tr>
                  <th className="text-xs text-left text-grey-800 p-2">
                    Tanggal
                  </th>
                  <th colSpan={3} className="text-xs text-grey-800 p-3">
                    Masuk
                  </th>
                  <th colSpan={3} className="text-xs text-grey-800 p-2">
                    Keluar
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataTables.length > 0 ? (
                  dataTables.map((item, itemIdx) => (
                    <tr
                      key={itemIdx}
                      className="bg-transparent md:text-sm border-b border-grey-300 transition duration-300 ease-in-out"
                    >
                      <td className="text-xs p-2 whitespace-nowrap text-grey-800">
                        {item.tanggal}
                      </td>
                      <td className="text-xs text-center p-2 whitespace-nowrap text-grey-800">
                        {item.waktu_masuk ? item.waktu_masuk : "-"}
                      </td>
                      <td className="text-xs p-2 text-left text-grey-800">
                        {item.alamat_masuk}
                      </td>
                      <td className="text-xs text-center p-2 whitespace-nowrap text-grey-800">
                        {item.waktu_keluar ? item.waktu_keluar : "-"}
                      </td>
                      <td className="text-xs p-2 text-left text-grey-800">
                        {item.alamat_keluar}
                      </td>
                      <td className="text-xs text-center p-2 text-grey-800">
                        <button
                          className="cursor-pointer flex text-base text-blue-500"
                          onClick={() => showDetail(item)}
                        >
                          {icons.aifilleye}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : loading ? (
                  <tr>
                    <td className="text-center py-5" colSpan={7}>
                      <div className="pt-10 pb-6 flex justify-center items-center">
                        <PulseLoader loading={loading} color="#111827" />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td className="text-center" colSpan={7}>
                      <div className="pt-10 pb-6 flex justify-center items-center text-xs text-red-500">
                        {error}
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td
                      className="text-center whitespace-nowrap text-grey-800"
                      colSpan={7}
                    >
                      <div className="pt-10 pb-6 flex justify-center items-center">
                        No data available
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Container>

      {/* Modal Image */}
      <Modal modal={modal} setModal={setModal}>
        <div className="w-full">
          <Container>
            <div className="flex justify-between items-center font-medium mb-2">
              <div>Masuk</div>
              <div>{detail.waktu_masuk}</div>
            </div>
            <div className="text-justify mb-2">
              Catatan : {detail.catatan_masuk ? detail.catatan_masuk : "-"}
            </div>
            <div className="text-justify mb-2">
              Alamat : {detail.alamat_masuk ? detail.alamat_masuk : "-"}
            </div>
            {detail.image_masuk && (
              <a
                href={baseurl + detail.image_masuk}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  className="h-48 w-48 object-cover rounded-lg border-2 border-gray-300"
                  src={baseurl + detail.image_masuk}
                  alt="Detail Kehadiran"
                />
              </a>
            )}
            <div className="flex justify-between items-center font-medium my-2">
              <div>Keluar</div>
              <div>{detail.waktu_keluar}</div>
            </div>
            <div className="text-justify mb-2">
              Catatan : {detail.catatan_keluar ? detail.catatan_keluar : "-"}
            </div>
            <div className="text-justify mb-2">
              Alamat : {detail.alamat_keluar ? detail.alamat_keluar : "-"}
            </div>
            {detail.image_keluar && (
              <a
                href={baseurl + detail.image_keluar}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  className="h-48 w-48 object-cover rounded-lg border-2 border-gray-300"
                  src={baseurl + detail.image_keluar}
                  alt="Detail Kehadiran"
                />
              </a>
            )}
          </Container>
        </div>
      </Modal>

      {/* Modal Edit */}
      <Modal modal={modalEdit} setModal={setModalEdit}>
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold">{modalEdit.modalTitle}</h3>
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Tanggal
              </label>
              <input
                type="date"
                name="tanggal"
                onChange={formik.handleChange}
                value={formik.values.tanggal}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Tipe Absen
              </label>
              <select
                name="tipe_absen"
                onChange={formik.handleChange}
                value={formik.values.tipe_absen}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              >
                <option value="">Select Tipe Absen</option>
                <option value="Hadir">Hadir</option>
                <option value="Izin">Izin</option>
                <option value="Sakit">Sakit</option>
                {/* Add other options as needed */}
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="text"
                name="latitude"
                onChange={formik.handleChange}
                value={formik.values.latitude}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="text"
                name="longitude"
                onChange={formik.handleChange}
                value={formik.values.longitude}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Gambar
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button type="submit" loading={addUserAbsensiLoading}>
                Submit
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </Fragment>
  );
};

export default DetailKehadiran;
