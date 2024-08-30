import { createSlice } from "@reduxjs/toolkit";

export const kepegawaianReducers = createSlice({
  name: "kepegawaian",
  initialState: {
    getPegawaiResult: false,
    getPegawaiLoading: false,
    getPegawaiError: false,
    addPegawaiResult: false,
    addPegawaiLoading: false,
    deletePegawaiResult: false,
    getKehadiranResult: false,
    getKehadiranLoading: false,
    getKehadiranError: false,
  },
  reducers: {
    pegawaiReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_PEGAWAI":
          return {
            ...state,
            getPegawaiResult: payload.data,
            getPegawaiLoading: payload.loading,
            getPegawaiError: payload.errorMessage,
          };
        case "ADD_PEGAWAI":
          return {
            ...state,
            addPegawaiResult: payload.data,
            addPegawaiLoading: payload.loading,
          };
        case "DELETE_PEGAWAI":
          return {
            ...state,
            deletePegawaiResult: payload.data,
          };
        default:
          return state;
      }
    },
    kehadiranReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_KEHADIRAN":
          return {
            ...state,
            getKehadiranResult: payload.data,
            getKehadiranLoading: payload.loading,
            getKehadiranError: payload.errorMessage,
          };
        default:
          return state;
      }
    },
  },
});

export const { pegawaiReducer, kehadiranReducer } = kepegawaianReducers.actions;

export default kepegawaianReducers.reducer;
