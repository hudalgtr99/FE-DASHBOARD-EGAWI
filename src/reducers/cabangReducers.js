import { createSlice } from "@reduxjs/toolkit";

export const cabangReducers = createSlice({
  name: "cabang",
  initialState: {
    getCabangResult: false,
    getCabangLoading: false,
    getCabangError: false,
    addCabangResult: false,
    addCabangLoading: false,
    deleteCabangResult: false,
  },
  reducers: {
    cabangReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_CABANG":
          return {
            ...state,
            getCabangResult: payload.data,
            getCabangLoading: payload.loading,
            getCabangError: payload.errorMessage,
          };
        case "ADD_CABANG":
          return {
            ...state,
            addCabangResult: payload.data,
            addCabangLoading: payload.loading,
          };
        case "DELETE_CABANG":
          return {
            ...state,
            deleteCabangResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { cabangReducer } = cabangReducers.actions;

export default cabangReducers.reducer;
