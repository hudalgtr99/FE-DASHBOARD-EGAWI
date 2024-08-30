import { createSlice } from "@reduxjs/toolkit";

export const gajiReducers = createSlice({
  name: "gaji",
  initialState: {
    getGajiResult: false,
    getGajiLoading: false,
    getGajiError: false,
    addGajiResult: false,
    addGajiLoading: false,
    deleteGajiResult: false,
  },
  reducers: {
    gajiReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_GAJI":
          return {
            ...state,
            getGajiResult: payload.data,
            getGajiLoading: payload.loading,
            getGajiError: payload.errorMessage,
          };
        case "ADD_GAJI":
          return {
            ...state,
            addGajiResult: payload.data,
            addGajiLoading: payload.loading,
          };
        case "DELETE_GAJI":
          return {
            ...state,
            deleteGajiResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { gajiReducer } = gajiReducers.actions;

export default gajiReducers.reducer;
