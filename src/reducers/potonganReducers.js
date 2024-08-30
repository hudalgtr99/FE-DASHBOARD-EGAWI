import { createSlice } from "@reduxjs/toolkit";

export const potonganReducers = createSlice({
  name: "potongan",
  initialState: {
    getPotonganResult: false,
    getPotonganLoading: false,
    getPotonganError: false,
    addPotonganResult: false,
    addPotonganLoading: false,
    deletePotonganResult: false,
  },
  reducers: {
    potonganReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_POTONGAN":
          return {
            ...state,
            getPotonganResult: payload.data,
            getPotonganLoading: payload.loading,
            getPotonganError: payload.errorMessage,
          };
        case "ADD_POTONGAN":
          return {
            ...state,
            addPotonganResult: payload.data,
            addPotonganLoading: payload.loading,
          };
        case "DELETE_POTONGAN":
          return {
            ...state,
            deletePotonganResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { potonganReducer } = potonganReducers.actions;

export default potonganReducers.reducer;
