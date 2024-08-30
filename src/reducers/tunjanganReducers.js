import { createSlice } from "@reduxjs/toolkit";

export const tunjanganReducers = createSlice({
  name: "tunjangan",
  initialState: {
    getTunjanganResult: false,
    getTunjanganLoading: false,
    getTunjanganError: false,
    addTunjanganResult: false,
    addTunjanganLoading: false,
    deleteTunjanganResult: false,
  },
  reducers: {
    tunjanganReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_TUNJANGAN":
          return {
            ...state,
            getTunjanganResult: payload.data,
            getTunjanganLoading: payload.loading,
            getTunjanganError: payload.errorMessage,
          };
        case "ADD_TUNJANGAN":
          return {
            ...state,
            addTunjanganResult: payload.data,
            addTunjanganLoading: payload.loading,
          };
        case "DELETE_TUNJANGAN":
          return {
            ...state,
            deleteTunjanganResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { tunjanganReducer } = tunjanganReducers.actions;

export default tunjanganReducers.reducer;
