// plugins
import axios from "axios";
import { toast } from "react-toastify";
// functions
import { authReducer, userReducer } from "../reducers/authReducers";
import { API_URL_signin } from "../constants";
import { logout, setNewHeaders } from "../authentication/authenticationApi";
import axiosAPI from "../authentication/axiosApi";
import Swal from "sweetalert2";

export const showToast = (type, message) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const updateProfile = (dispatch, data, url, type, pk) => {
  dispatch(
    userReducer({
      type: type,
      payload: {
        loading: true,
        data: false,
      },
    })
  );

  axiosAPI({
    method: "PUT",
    url: url + pk,
    timeout: 120000,
    data: data,
  })
    .then((response) => {
      if (response.data.status === 201) {
        showToast("error", response.data.messages);
      } else {
        showToast("success", "Foto profil berhasil diperbarui!");
      }
      dispatch(
        userReducer({
          type: type,
          payload: {
            loading: false,
            data: response.data,
          },
        })
      );
    })
    .catch((error) => {
      showToast("error", error.response.data.messages);
      dispatch(
        userReducer({
          type: type,
          payload: {
            loading: false,
            data: false,
          },
        })
      );
    });
};

export const updateAkun = (dispatch, type, data, pk, url) => {
  dispatch(
    userReducer({
      type: type,
      payload: {
        loading: true,
        data: false,
      },
    })
  );

  axiosAPI({
    method: "POST",
    url: url + pk,
    timeout: 120000,
    data: data,
  })
    .then((response) => {
      if (response.data.status === 201) {
        showToast("error", response.data.messages);
      } else {
        showToast("success", "Profile berhasil diperbarui!");
      }
      dispatch(
        userReducer({
          type: type,
          payload: {
            loading: false,
            data: response.data,
          },
        })
      );
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        customClass: {
          container: "z-[99999]",
        },
        text: error,
      });
      dispatch(
        userReducer({
          type: type,
          payload: {
            loading: false,
            data: false,
          },
        })
      );
    });
};

export const loginUser = (dispatch, data) => {
  dispatch(
    authReducer({
      type: "LOGIN_USER",
      payload: {
        loading: true,
        data: false,
      },
    })
  );

  axios({
    method: "POST",
    url: API_URL_signin,
    timeout: 120000,
    data: data,
  })
    .then((response) => {
      setNewHeaders(response.data);
      showToast("success", "Login in successfully!");

      dispatch(
        authReducer({
          type: "LOGIN_USER",
          payload: {
            loading: false,
            data: response.data,
          },
        })
      );
    })
    .catch((error) => {
      showToast("error", error.response.data.detail);
      dispatch(
        authReducer({
          type: "LOGIN_USER",
          payload: {
            loading: false,
            data: false,
          },
        })
      );
    });
};

export const logoutUser = (dispatch) => {
  try {
    logout();
    showToast("success", "Logout successfully!");

    dispatch(
      authReducer({
        type: "LOGOUT_USER",
        payload: {
          data: "LOGOUT SUKSES",
        },
      })
    );
  } catch (error) {
    showToast("error", "Logout failed! Please try again.");
  } finally {
    dispatch(
      authReducer({
        type: "LOGIN_USER",
        payload: {
          loading: false,
          data: false,
        },
      })
    );
  }
};
