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
import jobdeskPegawaiReducers from "./jobdeskPegawaiReducers";
import masterGajiReducers from "./masterGajiReducers";
import delegationReducers from "./delegationReducers";
import taskReducers from "./taskReducers";
import todoTaskReducers from "./todoTaskReducers";
import subTodoTaskReducers from "./subTodoTaskReducers";
import payrollReducers from "./payrollReducers";
import masterEmailReducers from "./masterEmailReducers";
import templateReducers from "./templateReducers";

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
    jobdeskpegawai: jobdeskPegawaiReducers,
    mastergaji: masterGajiReducers,
    delegation: delegationReducers,
    task: taskReducers,
    todotask: todoTaskReducers,
    subtodotask: subTodoTaskReducers,
    payroll: payrollReducers,
    masteremail: masterEmailReducers,
    template: templateReducers,
  },
});
