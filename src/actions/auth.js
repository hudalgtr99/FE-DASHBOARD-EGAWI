// plugins
import axios from "axios";
import Swal from "sweetalert2";

// functions
import { authReducer, userReducer } from "../reducers/authReducers";
import { API_URL_signin } from "../constants";
import { logout, setNewHeaders } from "../authentication/authenticationApi";
import axiosAPI from "../authentication/axiosApi";

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
        Swal.fire({
          icon: "error",
          title: "Oops...",
          customClass: {
            container: "z-[99999]",
          },
          text: response.data.messages,
        });
      } else {
        setNewHeaders(response.data);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Profile changed successfully!"
        });
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
        Swal.fire({
          icon: "error",
          title: "Oops...",
          customClass: {
            container: "z-[99999]",
          },
          text: response.data.messages,
        });
      } else {
        setNewHeaders(response.data);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Account changed successfully!"
        });
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
      if (response.data.status === 201) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          customClass: {
            container: "z-[99999]",
          },
          text: response.data.messages,
        });
      } else {
        setNewHeaders(response.data);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Signed in successfully!"
        });
      }
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
      Swal.fire({
        icon: "error",
        title: "Oops...",
        customClass: {
          container: "z-[99999]",
        },
        text: error.response.data.messages,
      });
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
  logout();
  dispatch(
    authReducer({
      type: "LOGOUT_USER",
      payload: {
        data: "LOGOUT SUKSES",
      },
    })
  );
  dispatch(
    authReducer({
      type: "LOGIN_USER",
      payload: {
        loading: false,
        data: false,
      },
    })
  );
};
