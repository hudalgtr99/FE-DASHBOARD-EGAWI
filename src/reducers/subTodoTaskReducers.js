import { createSlice } from "@reduxjs/toolkit";

export const subTodoTaskReducers = createSlice({
  name: "subTodoTask",
  initialState: {
    getSubTodoTaskResult: false,
    getSubTodoTaskLoading: false,
    getSubTodoTaskError: false,
    addSubTodoTaskResult: false,
    addSubTodoTaskLoading: false,
    deleteSubTodoTaskResult: false,
  },
  reducers: {
    subTodoTaskReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_SUBTODOTASK":
          return {
            ...state,
            getSubTodoTaskResult: payload.data,
            getSubTodoTaskLoading: payload.loading,
            getSubTodoTaskError: payload.errorMessage,
          };
        case "ADD_SUBTODOTASK":
          return {
            ...state,
            addSubTodoTaskResult: payload.data,
            addSubTodoTaskLoading: payload.loading,
          };
        case "DELETE_SUBTODOTASK":
          return {
            ...state,
            deleteSubTodoTaskResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { subTodoTaskReducer } = subTodoTaskReducers.actions;

export default subTodoTaskReducers.reducer;
