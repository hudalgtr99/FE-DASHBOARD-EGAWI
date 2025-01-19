import { createSlice } from "@reduxjs/toolkit";

export const jobdeskPegawaiReducers = createSlice({
  name: "jobdeskpegawai",
  initialState: {
    getJobdeskPegawaiResult: false,
    getJobdeskPegawaiLoading: false,
    getJobdeskPegawaiError: false,
    addJobdeskPegawaiResult: false,
    addJobdeskPegawaiLoading: false,
    deleteJobdeskPegawaiResult: false,
  },
  reducers: {
    jobdeskPegawaiReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_JOBDESKPEGAWAI":
          return {
            ...state,
            getJobdeskPegawaiResult: payload.data,
            getJobdeskPegawaiLoading: payload.loading,
            getJobdeskPegawaiError: payload.errorMessage,
          };
        case "ADD_JOBDESKPEGAWAI":
          return {
            ...state,
            addJobdeskPegawaiResult: payload.data,
            addJobdeskPegawaiLoading: payload.loading,
          };
        case "DELETE_JOBDESKPEGAWAI":
          return {
            ...state,
            deleteJobdeskPegawaiResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { jobdeskPegawaiReducer } = jobdeskPegawaiReducers.actions;

export default jobdeskPegawaiReducers.reducer;
