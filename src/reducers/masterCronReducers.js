import { createSlice } from "@reduxjs/toolkit";

export const masterCronReducers = createSlice({
  name: "masterCron",
  initialState: {
    getMasterCronResult: false,
    getMasterCronLoading: false,
    getMasterCronError: false,
    addMasterCronResult: false,
    addMasterCronLoading: false,
    deleteMasterCronResult: false,
  },
  reducers: {
    masterCronReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_MASTERCRON":
          return {
            ...state,
            getMasterCronResult: payload.data,
            getMasterCronLoading: payload.loading,
            getMasterCronError: payload.errorMessage,
          };
        case "ADD_MASTERCRON":
          return {
            ...state,
            addMasterCronResult: payload.data,
            addMasterCronLoading: payload.loading,
          };
        case "DELETE_MASTERCRON":
          return {
            ...state,
            deleteMasterCronResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { masterCronReducer } = masterCronReducers.actions;

export default masterCronReducers.reducer;
