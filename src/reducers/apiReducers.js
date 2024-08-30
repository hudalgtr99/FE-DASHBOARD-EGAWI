import { createSlice } from "@reduxjs/toolkit";

export const apiReducers = createSlice({
  name: "api",
  initialState: {
    getApiResult: false,
    getApiLoading: false,
    getApiError: false,
    addApiResult: false,
    addApiLoading: false,
    deleteApiResult: false,

    getCallbackResult: false,
    getCallbackLoading: false,
    getCallbackError: false,
    addCallbackResult: false,
    addCallbackLoading: false,
    deleteCallbackResult: false,
  },
  reducers: {
    apiReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_API":
          return {
            ...state,
            getApiResult: payload.data,
            getApiLoading: payload.loading,
            getApiError: payload.errorMessage,
          };
        case "ADD_API":
          return {
            ...state,
            addApiResult: payload.data,
            addApiLoading: payload.loading,
          };
        case "DELETE_API":
          return {
            ...state,
            deleteApiResult: payload.data,
          };
        default:
          return state;
      }
    },
    callbackReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_CALLBACK":
          return {
            ...state,
            getCallbackResult: payload.data,
            getCallbackLoading: payload.loading,
            getCallbackError: payload.errorMessage,
          };
        case "ADD_CALLBACK":
          return {
            ...state,
            addCallbackResult: payload.data,
            addCallbackLoading: payload.loading,
          };
        case "DELETE_CALLBACK":
          return {
            ...state,
            deleteCallbackResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { apiReducer, callbackReducer } = apiReducers.actions;

export default apiReducers.reducer;
