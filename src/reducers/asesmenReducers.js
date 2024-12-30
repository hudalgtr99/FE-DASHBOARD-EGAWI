import { createSlice } from "@reduxjs/toolkit";

export const asesmenReducers = createSlice({
  name: "asesmen",
  initialState: {
    getIzinValidasiResult: false,
    getIzinValidasiLoading: false,
    getIzinValidasiError: false,
    getIzinDiterimaResult: false,
    getIzinDiterimaLoading: false,
    getIzinDiterimaError: false,
    getIzinDitolakResult: false,
    getIzinDitolakLoading: false,
    getIzinDitolakError: false,
    updatePengajuanResult: false,
    updatePengajuanLoading: false,
    updatePengajuanError: false,
  },
  reducers: {
    pengajuanIzinReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_IZIN_VALIDASI":
          return {
            ...state,
            getIzinValidasiResult: payload.data,
            getIzinValidasiLoading: payload.loading,
            getIzinValidasiError: payload.errorMessage,
          };
        case "GET_IZIN_DITERIMA":
          return {
            ...state,
            getIzinDiterimaResult: payload.data,
            getIzinDiterimaLoading: payload.loading,
            getIzinDiterimaError: payload.errorMessage,
          };
        case "GET_IZIN_DITOLAK":
          return {
            ...state,
            getIzinDitolakResult: payload.data,
            getIzinDitolakLoading: payload.loading,
            getIzinDitolakError: payload.errorMessage,
          };
        case "UPDATE_PENGAJUAN":
          return {
            ...state,
            updatePengajuanResult: payload.data,
            updatePengajuanLoading: payload.loading,
            updatePengajuanError: payload.errorMessage,
          };
        default:
          return state;
      }
    },
  },
});

export const { pengajuanIzinReducer } = asesmenReducers.actions;

export default asesmenReducers.reducer;
