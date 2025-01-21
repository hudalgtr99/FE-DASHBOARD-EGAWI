import { createSlice } from "@reduxjs/toolkit";

export const delegationReducers = createSlice({
  name: "delegation",
  initialState: {
    getDelegationResult: false,
    getDelegationLoading: false,
    getDelegationError: false,
    addDelegationResult: false,
    addDelegationLoading: false,
    deleteDelegationResult: false,
  },
  reducers: {
    delegationReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_DELEGATION":
          return {
            ...state,
            getDelegationResult: payload.data,
            getDelegationLoading: payload.loading,
            getDelegationError: payload.errorMessage,
          };
        case "ADD_DELEGATION":
          return {
            ...state,
            addDelegationResult: payload.data,
            addDelegationLoading: payload.loading,
          };
        case "DELETE_DELEGATION":
          return {
            ...state,
            deleteDelegationResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { delegationReducer } = delegationReducers.actions;

export default delegationReducers.reducer;
