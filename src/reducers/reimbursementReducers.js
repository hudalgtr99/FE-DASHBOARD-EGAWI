import { createSlice } from "@reduxjs/toolkit";

export const reimbursementReducers = createSlice({
  name: "reimbursement",
  initialState: {
    getReimbursementResult: false,
    getReimbursementLoading: false,
    getReimbursementError: false,
    addReimbursementResult: false,
    addReimbursementLoading: false,
    deleteReimbursementResult: false,
  },
  reducers: {
    reimbursementReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_REIMBURSEMENT":
          return {
            ...state,
            getReimbursementResult: payload.data,
            getReimbursementLoading: payload.loading,
            getReimbursementError: payload.errorMessage,
          };
        case "ADD_REIMBURSEMENT":
          return {
            ...state,
            addReimbursementResult: payload.data,
            addReimbursementLoading: payload.loading,
          };
        case "DELETE_REIMBURSEMENT":
          return {
            ...state,
            deleteReimbursementResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { reimbursementReducer } = reimbursementReducers.actions;

export default reimbursementReducers.reducer;
