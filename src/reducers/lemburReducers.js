import { createSlice } from "@reduxjs/toolkit";

export const lemburReducers = createSlice({
  name: "lembur",
  initialState: {
    getLemburResult: false,
    getLemburLoading: false,
    getLemburError: false,
    addLemburResult: false,
    addLemburLoading: false,
    deleteLemburResult: false,
  },
  reducers: {
    lemburReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_LEMBUR":
          return {
            ...state,
            getLemburResult: payload.data,
            getLemburLoading: payload.loading,
            getLemburError: payload.errorMessage,
          };
        case "ADD_LEMBUR":
          return {
            ...state,
            addLemburResult: payload.data,
            addLemburLoading: payload.loading,
          };
        case "DELETE_LEMBUR":
          return {
            ...state,
            deleteLemburResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { lemburReducer } = lemburReducers.actions;

export default lemburReducers.reducer;
