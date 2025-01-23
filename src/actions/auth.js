// plugins
import axios from "axios";
import { toast } from "react-toastify";
// functions
import { authReducer, userReducer } from "../reducers/authReducers";
import { API_URL_signin } from "../constants";
import { logout, setNewHeaders } from "../authentication/authenticationApi";
import axiosAPI from "../authentication/axiosApi";
import Swal from "sweetalert2";
import { useQuery, useMutation } from "@tanstack/react-query";

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
      showToast("error", error?.response?.data?.messages);
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
      showToast("success", "Login berhasil!");

      dispatch(
        authReducer({
          type: "LOGIN_USER",
          payload: {
            loading: false,
            data: response.data,
          },
        })
      );
      return response.data;
    })
    .catch((error) => {
      showToast("error", error?.response?.data?.detail);
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
    showToast("success", "Logout berhasil!");

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

// Menggunakan React Query
export const useGetData = (endpoint, queryKey, params = {}, options = {}) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const headers = {};

      const response = await axiosAPI.get(endpoint, {
        params: params,
        headers: headers,
      });
      return response.data;
    },
    throwOnError: (error) => {
      if (error.response && error.response.status === 401) {
        logout(); // Jika token tidak valid atau kedaluwarsa, logout
      }
    },
    ...options,
  });
};

export const usePostData = (endpoint) => {
  return useMutation({
    mutationFn: async (data) => {
      const headers = {
        "Content-Type": "multipart/form-data",
      };

      const response = await axiosAPI.post(endpoint, data, {
        headers: headers,
      });
      return response.data;
    },
    throwOnError: (error) => {
      if (error.response && error.response.status === 401) {
        logout();
      }
    },
  });
};

export const usePutData = (endpoint) => {
  return useMutation({
    mutationFn: async (data) => {
      const headers = {
        "Content-Type": "multipart/form-data",
      };

      const response = await axiosAPI.put(endpoint, data, {
        headers: headers,
      });
      return response.data;
    },
    throwOnError: (error) => {
      if (error.response && error.response.status === 401) {
        logout();
      }

      if (error.response.data && error.response.status !== 500) {
        // Jika respons mengandung data objek, tampilkan sebagai daftar
        Swal.fire({
          icon: "error",
          title: "Oops sorry...",
          customClass: {
            container: "z-[99999]",
          },
          html: `
        <div>
          <ul>
            ${(() => {
              const entries = Object.entries(error.response.data);
              return entries
                .map(([key, value]) => {
                  if (entries.length === 1) {
                    return `<li>${value}</li>`;
                  } else {
                    return `<li><strong>${key}</strong>: ${value}</li>`;
                  }
                })
                .join("");
            })()}
          </ul>
        </div>
      `,
        });
      } else {
        // Jika respons tidak mengandung data objek, tampilkan pesan error langsung
        Swal.fire({
          icon: "error",
          title: "Oops sorry...",
          text: error.message,
        });
      }
    },
  });
};

export const useDeleteData = (endpoint) => {
  return useMutation({
    mutationFn: async (id) => {
      const headers = {};

      const response = await axiosAPI.delete(`${endpoint}${id}/`, {
        headers: headers,
      });
      return response.data;
    },
    throwOnError: (error) => {
      if (error.response && error.response.status === 401) {
        logout();
      }
    },
  });
};
