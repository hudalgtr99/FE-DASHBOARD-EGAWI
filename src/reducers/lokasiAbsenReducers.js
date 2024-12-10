import { createSlice } from "@reduxjs/toolkit";

export const lokasiAbsenReducers = createSlice({
  name: "lokasiAbsen",
  initialState: {
    getLokasiAbsenResult: [], // Mulai sebagai array
    getLokasiAbsenLoading: false,
    getLokasiAbsenError: false,
    addLokasiAbsenResult: false,
    addLokasiAbsenLoading: false,
    deleteLokasiAbsenResult: false,
    updateLokasiAbsenResult: false,
    updateLokasiAbsenLoading: false,
  },
  reducers: {
    lokasiAbsenReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_LOKASI_ABSEN":
          return {
            ...state,
            getLokasiAbsenResult: payload.data,
            getLokasiAbsenLoading: payload.loading,
            getLokasiAbsenError: payload.errorMessage,
          };
        case "ADD_LOKASI_ABSEN":
          return {
            ...state,
            getLokasiAbsenResult: [...state.getLokasiAbsenResult, payload.data], // Menambahkan data baru ke hasil
            addLokasiAbsenLoading: payload.loading,
          };
        case "DELETE_LOKASI_ABSEN":
          return {
            ...state,
            getLokasiAbsenResult: state.getLokasiAbsenResult.filter(item => item.id !== payload.data.id), // Menghapus data dari hasil
            deleteLokasiAbsenResult: payload.data,
          };
        case "UPDATE_LOKASI_ABSEN":
          return {
            ...state,
            getLokasiAbsenResult: state.getLokasiAbsenResult.map(item =>
              item.id === payload.data.id ? payload.data : item // Memperbarui data yang sesuai
            ),
            updateLokasiAbsenLoading: payload.loading,
          };
        default:
          return state;
      }
    },
  },
});

// Ekspor action untuk digunakan di komponen
export const { lokasiAbsenReducer } = lokasiAbsenReducers.actions;

// Ekspor reducer untuk digunakan di store
export default lokasiAbsenReducers.reducer;
