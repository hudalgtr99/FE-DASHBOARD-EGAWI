import { createSlice } from "@reduxjs/toolkit";

export const taskReducers = createSlice({
  name: "task",
  initialState: {
    getTaskResult: false,
    getTaskLoading: false,
    getTaskError: false,
    addTaskResult: false,
    addTaskLoading: false,
    deleteTaskResult: false,
  },
  reducers: {
    taskReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_TASK":
          return {
            ...state,
            getTaskResult: payload.data,
            getTaskLoading: payload.loading,
            getTaskError: payload.errorMessage,
          };
        case "ADD_TASK":
          return {
            ...state,
            addTaskResult: payload.data,
            addTaskLoading: payload.loading,
          };
        case "DELETE_TASK":
          return {
            ...state,
            deleteTaskResult: payload.data,
          };
        default:
          return state;
      }
    },
  },
});

export const { taskReducer } = taskReducers.actions;

export default taskReducers.reducer;
