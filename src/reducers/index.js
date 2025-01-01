import { configureStore } from "@reduxjs/toolkit";
import gajiReducers from "./gajiReducers";
import organReducers from "./organReducers";
import strataReducers from "./strataReducers";
import tunjanganReducers from "./tunjanganReducers";
import potonganReducers from "./potonganReducers";
import authReducers from "./authReducers";
import kepegawaianReducers from "./kepegawaianReducers";
import asesmenReducers from "./asesmenReducers";
import perusahaanReducers from "./perusahaanReducers";
import kalenderReducers from "./kalenderReducers";
import tugasReducers from "./penugasanReducers";
import apiReducers from "./apiReducers";
import lokasiAbsen from "./lokasiAbsenReducers";
import jamKerja from "./jamKerjaReducers";
import lembur from "./lemburReducers";
import reimbursement from "./reimbursementReducers";

export default configureStore({
  reducer: {
    api: apiReducers,
    strata: strataReducers,
    organ: organReducers,
    gaji: gajiReducers,
    tunjangan: tunjanganReducers,
    potongan: potonganReducers,
    auth: authReducers,
    kepegawaian: kepegawaianReducers,
    asesmen: asesmenReducers,
    perusahaan: perusahaanReducers,
    kalender: kalenderReducers,
    tugas: tugasReducers,
    absen: lokasiAbsen,
    jam_kerja: jamKerja,
    lembur: lembur,
    reimbursement: reimbursement,
  },
});
