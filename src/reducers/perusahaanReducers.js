import { createSlice } from "@reduxjs/toolkit";

export const perusahaanReducers = createSlice({
  name: "perusahaan",
  initialState: {
    getperusahaanResult: false,
    getperusahaanLoading: false,
    getperusahaanError: false,
    addperusahaanResult: false,
    addperusahaanLoading: false,
    deleteperusahaanResult: false,
  },
  reducers: {
    perusahaanReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_perusahaan":
          return {
            ...state,
            getperusahaanResult: payload.data,
            getperusahaanLoading: payload.loading,
            getperusahaanError: payload.errorMessage,
          };
        case "ADD_perusahaan":
          return {
            ...state,
            addperusahaanResult: payload.data,
            addperusahaanLoading: payload.loading,
          };
        case "DELETE_perusahaan":
          return {
            ...state,
            deleteperusahaanResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { perusahaanReducer } = perusahaanReducers.actions;

export default perusahaanReducers.reducer;
