import { createSlice } from "@reduxjs/toolkit";

export const organReducers = createSlice({
  name: "organ",
  initialState: {
    getDepartemenResult: false,
    getDepartemenLoading: false,
    getDepartemenError: false,
    addDepartemenResult: false,
    addDepartemenLoading: false,
    deleteDepartemenResult: false,

    getDivisiResult: false,
    getDivisiLoading: false,
    getDivisiError: false,
    addDivisiResult: false,
    addDivisiLoading: false,
    deleteDivisiResult: false,

    getUnitResult: false,
    getUnitLoading: false,
    getUnitError: false,
    addUnitResult: false,
    addUnitLoading: false,
    deleteUnitResult: false,
  },
  reducers: {
    departemenReducers: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_DEPARTEMEN":
          return {
            ...state,
            getDepartemenResult: payload.data,
            getDepartemenLoading: payload.loading,
            getDepartemenError: payload.errorMessage,
          };
        case "ADD_DEPARTEMEN":
          return {
            ...state,
            addDepartemenResult: payload.data,
            addDepartemenLoading: payload.loading,
          };
        case "DELETE_DEPARTEMEN":
          return {
            ...state,
            deleteDepartemenResult: payload.data,
          };
        default:
          return state;
      }
    },
    divisiReducers: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_DIVISI":
          return {
            ...state,
            getDivisiResult: payload.data,
            getDivisiLoading: payload.loading,
            getDivisiError: payload.errorMessage,
          };
        case "ADD_DIVISI":
          return {
            ...state,
            addDivisiResult: payload.data,
            addDivisiLoading: payload.loading,
          };
        case "DELETE_DIVISI":
          return {
            ...state,
            deleteDivisiResult: payload.data,
          };
        default:
          return state;
      }
    },
    unitReducers: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_UNIT":
          return {
            ...state,
            getUnitResult: payload.data,
            getUnitLoading: payload.loading,
            getUnitError: payload.errorMessage,
          };
        case "ADD_UNIT":
          return {
            ...state,
            addUnitResult: payload.data,
            addUnitLoading: payload.loading,
          };
        case "DELETE_UNIT":
          return {
            ...state,
            deleteUnitResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { departemenReducers, divisiReducers, unitReducers } =
  organReducers.actions;

export default organReducers.reducer;
