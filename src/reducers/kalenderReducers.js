import { createSlice } from "@reduxjs/toolkit";

export const kalenderReducers = createSlice({
  name: "kalender",
  initialState: {
    addKalenderResult: false,
    addKalenderLoading: false,
  },
  reducers: {
    kalenderReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "ADD_KALENDER":
          return {
            ...state,
            addKalenderResult: payload.data,
            addKalenderLoading: payload.loading,
          };
        default:
          return state;
      }
    },
  },
});

export const { kalenderReducer } = kalenderReducers.actions;

export default kalenderReducers.reducer;
