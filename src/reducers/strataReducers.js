import { createSlice } from "@reduxjs/toolkit";

export const strataReducers = createSlice({
  name: "strata",
  initialState: {
    getPangkatResult: false,
    getPangkatLoading: false,
    getPangkatError: false,
    addPangkatResult: false,
    addPangkatLoading: false,
    deletePangkatResult: false,

    getJabatanResult: false,
    getJabatanLoading: false,
    getJabatanError: false,
    addJabatanResult: false,
    addJabatanLoading: false,
    deleteJabatanResult: false,
  },
  reducers: {
    pangkatReducers: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_PANGKAT":
          return {
            ...state,
            getPangkatResult: payload.data,
            getPangkatLoading: payload.loading,
            getPangkatError: payload.errorMessage,
          };
        case "ADD_PANGKAT":
          return {
            ...state,
            addPangkatResult: payload.data,
            addPangkatLoading: payload.loading,
          };
        case "DELETE_PANGKAT":
          return {
            ...state,
            deletePangkatResult: payload.data,
          };
        default:
          return state;
      }
    },
    jabatanReducers: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_JABATAN":
          return {
            ...state,
            getJabatanResult: payload.data,
            getJabatanLoading: payload.loading,
            getJabatanError: payload.errorMessage,
          };
        case "ADD_JABATAN":
          return {
            ...state,
            addJabatanResult: payload.data,
            addJabatanLoading: payload.loading,
          };
        case "DELETE_JABATAN":
          return {
            ...state,
            deleteJabatanResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { pangkatReducers, jabatanReducers } = strataReducers.actions;

export default strataReducers.reducer;
