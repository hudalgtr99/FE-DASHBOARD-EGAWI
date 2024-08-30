import { configureStore } from "@reduxjs/toolkit";
import gajiReducers from "./gajiReducers";
import organReducers from "./organReducers";
import strataReducers from "./strataReducers";
import tunjanganReducers from "./tunjanganReducers";
import potonganReducers from "./potonganReducers";
import authReducers from "./authReducers";
import kepegawaianReducers from "./kepegawaianReducers";
import asesmenReducers from "./asesmenReducers";
import cabangReducers from "./cabangReducers";
import kalenderReducers from "./kalenderReducers";
import tugasReducers from "./penugasanReducers";
import apiReducers from "./apiReducers";

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
    cabang: cabangReducers,
    kalender: kalenderReducers,
    tugas: tugasReducers,
  },
});
