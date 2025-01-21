import { createSlice } from "@reduxjs/toolkit";

export const todoTaskReducers = createSlice({
  name: "todoTask",
  initialState: {
    getTodoTaskResult: false,
    getTodoTaskLoading: false,
    getTodoTaskError: false,
    addTodoTaskResult: false,
    addTodoTaskLoading: false,
    deleteTodoTaskResult: false,
  },
  reducers: {
    todoTaskReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_TODOTASK":
          return {
            ...state,
            getTodoTaskResult: payload.data,
            getTodoTaskLoading: payload.loading,
            getTodoTaskError: payload.errorMessage,
          };
        case "ADD_TODOTASK":
          return {
            ...state,
            addTodoTaskResult: payload.data,
            addTodoTaskLoading: payload.loading,
          };
        case "DELETE_TODOTASK":
          return {
            ...state,
            deleteTodoTaskResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { todoTaskReducer } = todoTaskReducers.actions;

export default todoTaskReducers.reducer;
