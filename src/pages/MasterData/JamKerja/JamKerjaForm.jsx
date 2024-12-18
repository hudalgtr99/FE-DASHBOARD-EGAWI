import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { perusahaanReducer } from "@/reducers/perusahaanReducers";
import { updateData } from "@/actions";
import { API_URL_editjamkerja } from "@/constants";
import { Container, TextField, Button } from "@/components";
import { IoMdReturnLeft } from "react-icons/io";

const JamKerjaForm = () => {
  const { pk } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addperusahaanLoading } = useSelector((state) => state.perusahaan);

  // Get initial values from state
  const jadwal = state?.item?.jadwal || {};

  const formik = useFormik({
    initialValues: {
      jadwal: {
        senin: jadwal.senin || { masuk: "08:00", keluar: "17:00" },
        selasa: jadwal.selasa || { masuk: "08:00", keluar: "17:00" },
        rabu: jadwal.rabu || { masuk: "08:00", keluar: "17:00" },
        kamis: jadwal.kamis || { masuk: "08:00", keluar: "17:00" },
        jumat: jadwal.jumat || { masuk: "08:00", keluar: "17:00" },
        sabtu: jadwal.sabtu || { masuk: "00:00", keluar: "00:00" },
        minggu: jadwal.minggu || { masuk: "00:00", keluar: "00:00" },
      },
    },
    validationSchema: Yup.object().shape({
      jadwal: Yup.object().shape({
        senin: Yup.object().shape({
          masuk: Yup.string().required("Senin Masuk is required"),
          keluar: Yup.string().required("Senin Keluar is required"),
        }),
        selasa: Yup.object().shape({
          masuk: Yup.string().required("Selasa Masuk is required"),
          keluar: Yup.string().required("Selasa Keluar is required"),
        }),
        rabu: Yup.object().shape({
          masuk: Yup.string().required("Rabu Masuk is required"),
          keluar: Yup.string().required("Rabu Keluar is required"),
        }),
        kamis: Yup.object().shape({
          masuk: Yup.string().required("Kamis Masuk is required"),
          keluar: Yup.string().required("Kamis Keluar is required"),
        }),
        jumat: Yup.object().shape({
          masuk: Yup.string().required("Jumat Masuk is required"),
          keluar: Yup.string().required("Jumat Keluar is required"),
        }),
        sabtu: Yup.object().shape({
          masuk: Yup.string().required("Sabtu Masuk is required"),
          keluar: Yup.string().required("Sabtu Keluar is required"),
        }),
        minggu: Yup.object().shape({
          masuk: Yup.string().required("Minggu Masuk is required"),
          keluar: Yup.string().required("Minggu Keluar is required"),
        }),
      }),
    }),
    onSubmit: async (values) => {
      const formattedValues = {
        jadwal: JSON.stringify({
          senin: {
            masuk: values.jadwal.senin.masuk,
            keluar: values.jadwal.senin.keluar,
          },
          selasa: {
            masuk: values.jadwal.selasa.masuk,
            keluar: values.jadwal.selasa.keluar,
          },
          rabu: {
            masuk: values.jadwal.rabu.masuk,
            keluar: values.jadwal.rabu.keluar,
          },
          kamis: {
            masuk: values.jadwal.kamis.masuk,
            keluar: values.jadwal.kamis.keluar,
          },
          jumat: {
            masuk: values.jadwal.jumat.masuk,
            keluar: values.jadwal.jumat.keluar,
          },
          sabtu: {
            masuk: values.jadwal.sabtu.masuk,
            keluar: values.jadwal.sabtu.keluar,
          },
          minggu: {
            masuk: values.jadwal.minggu.masuk,
            keluar: values.jadwal.minggu.keluar,
          },
        }),
      };

      try {
        const data = await updateData(
          { dispatch, redux: perusahaanReducer },
          { pk, ...formattedValues },
          API_URL_editjamkerja,
          "ADD_perusahaan",
          "PATCH"
        );
        if (data && !addperusahaanLoading) {
          navigate("/masterdata/jam-kerja");
        }
      } catch (error) {
        console.error("Error in form submission: ", error);
      }
    },
  });

  return (
    <div>
      <Container>
        <div className="flex items-center gap-2 mb-4">
          <button
            className="text-xs md:text-sm whitespace-nowrap font-medium p-2 bg-[#BABCBD] text-white rounded-full shadow hover:shadow-lg transition-all"
            onClick={() => navigate("/masterdata/jam-kerja")}
          >
            <IoMdReturnLeft />
          </button>
          <h1>Edit Jam Kerja</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"].map(
            (day) => (
              <div key={day} className="flex gap-4">
                <TextField
                  required
                  label={`${day.charAt(0).toUpperCase() + day.slice(1)} Masuk`}
                  name={`jadwal.${day}.masuk`}
                  type="time"
                  value={formik.values.jadwal[day].masuk}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.jadwal?.[day]?.masuk
                      ? formik.errors.jadwal?.[day]?.masuk
                      : ""
                  }
                />
                <TextField
                  required
                  label={`${day.charAt(0).toUpperCase() + day.slice(1)} Keluar`}
                  name={`jadwal.${day}.keluar`}
                  type="time"
                  value={formik.values.jadwal[day].keluar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.jadwal?.[day]?.keluar
                      ? formik.errors.jadwal?.[day]?.keluar
                      : ""
                  }
                />
              </div>
            )
          )}
          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={addperusahaanLoading}>Ubah</Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default JamKerjaForm;
