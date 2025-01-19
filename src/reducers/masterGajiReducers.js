import { createSlice } from "@reduxjs/toolkit";

export const masterGajiReducers = createSlice({
  name: "masterGaji",
  initialState: {
    getMasterGajiResult: false,
    getMasterGajiLoading: false,
    getMasterGajiError: false,
    addMasterGajiResult: false,
    addMasterGajiLoading: false,
    deleteMasterGajiResult: false,
  },
  reducers: {
    masterGajiReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_MASTERGAJI":
          return {
            ...state,
            getMasterGajiResult: payload.data,
            getMasterGajiLoading: payload.loading,
            getMasterGajiError: payload.errorMessage,
          };
        case "ADD_MASTERGAJI":
          return {
            ...state,
            addMasterGajiResult: payload.data,
            addMasterGajiLoading: payload.loading,
          };
        case "DELETE_MASTERGAJI":
          return {
            ...state,
            deleteMasterGajiResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { masterGajiReducer } = masterGajiReducers.actions;

export default masterGajiReducers.reducer;
