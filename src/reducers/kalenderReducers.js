import { createSlice } from "@reduxjs/toolkit";

export const kalenderReducers = createSlice({
  name: "kalender",
  initialState: {
    getKalenderResult: false,
    getKalenderLoading: false,
    getKalenderError: false,
    addKalenderResult: false,
    addKalenderLoading: false,
    deleteKalenderResult: false,
  },
  reducers: {
    kalenderReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_KALENDER":
          return {
            ...state,
            getKalenderResult: payload.data,
            getKalenderLoading: payload.loading,
            getKalenderError: payload.errorMessage,
          };
        case "ADD_KALENDER":
          return {
            ...state,
            addKalenderResult: payload.data,
            addKalenderLoading: payload.loading,
          };
        case "DELETE_KALENDER":
          return {
            ...state,
            deleteKalenderResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { kalenderReducer } = kalenderReducers.actions;

export default kalenderReducers.reducer;
