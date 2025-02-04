import { createSlice } from "@reduxjs/toolkit";

export const masterEmailReducers = createSlice({
  name: "masterEmail",
  initialState: {
    getMasterEmailResult: false,
    getMasterEmailLoading: false,
    getMasterEmailError: false,
    addMasterEmailResult: false,
    addMasterEmailLoading: false,
    deleteMasterEmailResult: false,
  },
  reducers: {
    masterEmailReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_MASTEREMAIL":
          return {
            ...state,
            getMasterEmailResult: payload.data,
            getMasterEmailLoading: payload.loading,
            getMasterEmailError: payload.errorMessage,
          };
        case "ADD_MASTEREMAIL":
          return {
            ...state,
            addMasterEmailResult: payload.data,
            addMasterEmailLoading: payload.loading,
          };
        case "DELETE_MASTEREMAIL":
          return {
            ...state,
            deleteMasterEmailResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { masterEmailReducer } = masterEmailReducers.actions;

export default masterEmailReducers.reducer;
