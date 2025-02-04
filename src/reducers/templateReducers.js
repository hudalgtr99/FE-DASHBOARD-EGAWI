import { createSlice } from "@reduxjs/toolkit";

export const templateReducers = createSlice({
  name: "template",
  initialState: {
    getTemplateResult: false,
    getTemplateLoading: false,
    getTemplateError: false,
    addTemplateResult: false,
    addTemplateLoading: false,
    deleteTemplateResult: false,
  },
  reducers: {
    templateReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_TEMPLATE":
          return {
            ...state,
            getTemplateResult: payload.data,
            getTemplateLoading: payload.loading,
            getTemplateError: payload.errorMessage,
          };
        case "ADD_TEMPLATE":
          return {
            ...state,
            addTemplateResult: payload.data,
            addTemplateLoading: payload.loading,
          };
        case "DELETE_TEMPLATE":
          return {
            ...state,
            deleteTemplateResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { templateReducer } = templateReducers.actions;

export default templateReducers.reducer;
