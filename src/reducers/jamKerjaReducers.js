import { createSlice } from "@reduxjs/toolkit";

export const jamKerjaReducers = createSlice({
  name: "jamKerja",
  initialState: {
    getJamKerjaResult: false,
    getJamKerjaLoading: false,
    getJamKerjaError: false,
    addJamKerjaResult: false,
    addJamKerjaLoading: false,
    deleteJamKerjaResult: false,
  },
  reducers: {
    jamKerjaReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_JAM_KERJA":
          return {
            ...state,
            getJamKerjaResult: payload.data,
            getJamKerjaLoading: payload.loading,
            getJamKerjaError: payload.errorMessage,
          };
        case "ADD_JAM_KERJA":
          return {
            ...state,
            addJamKerjaResult: payload.data,
            addJamKerjaLoading: payload.loading,
          };
        case "DELETE_JAM_KERJA":
          return {
            ...state,
            deleteJamKerjaResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { jamKerjaReducer } = jamKerjaReducers.actions;

export default jamKerjaReducers.reducer;
