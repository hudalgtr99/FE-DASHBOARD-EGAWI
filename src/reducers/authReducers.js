import { createSlice } from "@reduxjs/toolkit";

export const authReducers = createSlice({
  name: "auth",
  initialState: {
    loginUserResult: false,
    loginUserLoading: false,
    logoutUserResult: false,
    addUserResult: false,
    addUserLoading: false,
    addProfileResult: false,
    addProfileLoading: false,
    getDataAkunResult: false,
    getDataAkunLoading: false,
    getDataAkunError: false,
    addUserAbsensiResult: false,
    addUserAbsensiLoading: false,
    getDataPresensiResult: false,
    getDataPresensiLoading: false,
    getDataPresensiError: false,
    addAkunResult: false,
    addAkunLoading: false,
    deleteAkunResult: false,
    // Added Absensi state
    getDataAbsensiResult: false,
    getDataAbsensiLoading: false,
    getDataAbsensiError: false,
  },
  reducers: {
    authReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "LOGIN_USER":
          return {
            ...state,
            loginUserResult: payload.data,
            loginUserLoading: payload.loading,
          };
        case "LOGOUT_USER":
          return {
            ...state,
            logoutUserResult: payload.data,
          };
        default:
          return state;
      }
    },
    userReducer: (state, action) => {
      const { type, payload } = action.payload;
      switch (type) {
        case "GET_PRESENSI":
          return {
            ...state,
            getDataPresensiResult: payload.data,
            getDataPresensiLoading: payload.loading,
            getDataPresensiError: payload.errorMessage,
          };
        case "ADD_ABSENSI":
          return {
            ...state,
            addUserAbsensiResult: payload.data,
            addUserAbsensiLoading: payload.loading,
          };
        case "GET_AKUN":
          return {
            ...state,
            getDataAkunResult: payload.data,
            getDataAkunLoading: payload.loading,
            getDataAkunError: payload.errorMessage,
          };
        case "ADD_AKUN":
          return {
            ...state,
            addAkunResult: payload.data,
            addAkunLoading: payload.loading,
          };
        case "DELETE_AKUN":
          return {
            ...state,
            deleteAkunResult: payload.data,
          };
        case "ADD_USER":
          return {
            ...state,
            addUserResult: payload.data,
            addUserLoading: payload.loading,
          };
        case "UPDATE_PROFILE":
          return {
            ...state,
            addProfileResult: payload.data,
            addProfileLoading: payload.loading,
          };
        // Added Absensi cases
        case "GET_ABSENSI":
          return {
            ...state,
            getDataAbsensiResult: payload.data,
            getDataAbsensiLoading: payload.loading,
            getDataAbsensiError: payload.errorMessage,
          };
        default:
          return state;
      }
    },
  },
});

export const { authReducer, userReducer } = authReducers.actions;

export default authReducers.reducer;
