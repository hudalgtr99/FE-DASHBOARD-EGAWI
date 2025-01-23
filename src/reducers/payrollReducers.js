import { createSlice } from "@reduxjs/toolkit";

export const payrollReducers = createSlice({
  name: "payroll",
  initialState: {
    getPayrollResult: false,
    getPayrollLoading: false,
    getPayrollError: false,
    addPayrollResult: false,
    addPayrollLoading: false,
    deletePayrollResult: false,
  },
  reducers: {
    payrollReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_PAYROLL":
          return {
            ...state,
            getPayrollResult: payload.data,
            getPayrollLoading: payload.loading,
            getPayrollError: payload.errorMessage,
          };
        case "ADD_PAYROLL":
          return {
            ...state,
            addPayrollResult: payload.data,
            addPayrollLoading: payload.loading,
          };
        case "DELETE_PAYROLL":
          return {
            ...state,
            deletePayrollResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { payrollReducer } = payrollReducers.actions;

export default payrollReducers.reducer;
