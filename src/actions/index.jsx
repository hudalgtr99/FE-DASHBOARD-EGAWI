// plugins
import { icons } from "../../public/icons";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";
import axiosAPI from "@/authentication/axiosApi";
import { toast } from "react-toastify";

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

export function encrypted(plainText) {
  var key = CryptoJS.enc.Utf8.parse("_secret_hrdapps_");
  var iv = CryptoJS.enc.Utf8.parse("I__1234567890__V");
  var encrypted = CryptoJS.AES.encrypt(JSON.stringify(plainText), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
  });
  return encrypted.toString();
}

export function decrypted(encrypted) {
  var key = CryptoJS.enc.Utf8.parse("_secret_hrdapps_");
  var iv = CryptoJS.enc.Utf8.parse("I__1234567890__V");
  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
  });
  decrypted = decrypted.toString(CryptoJS.enc.Utf8);
  return decrypted;
}

export function convertJSON(data) {
  return JSON.parse(data.replaceAll("'", '"'));
}

export function errorMessage(error) {
  if (error.response && error.response.data && error.response.data.messages) {
    return error.response.data.messages;
  } else if (error.response && error.response.statusText) {
    return error.response.statusText;
  }
  return error.message;
}

export const status = {
  proses: {
    color: "bg-blue-400",
    icon: (
      <div
        class="
    spinner-border
    animate-spin
    inline-block
    w-3
    h-3
    border-0.5
    rounded-full
    text-white
  "
      ></div>
    ),
  },
  ditolak: {
    color: "bg-red-600",
    icon: icons.riclosecirclefill,
  },
  diterima: {
    color: "bg-green-500",
    icon: icons.mdcheckcircle,
  },
};

export const handleInputError = (arr) => {
  const regex = {
    email:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
  };

  const err = arr.map((item) => {
    // Belum diisi
    if (item.value === "" && item.type !== "hidden" && item.required) {
      return { ...item, error: "*Belum Diisi" };
    }

    // Email
    if (
      item.value !== "" &&
      item.type !== "hidden" &&
      item.type === "email" &&
      item.required &&
      !regex.email.test(item.value)
    ) {
      return { ...item, error: "*Email Salah" };
    }

    return { ...item, error: "" };
  });

  return err;
};

export function getItem(header, item) {
  const split = header.split(".");
  if (split.length === 1) {
    if (!item[split[0]]) {
      if (item[split[0]] === 0) {
        return 0;
      }
      return "";
    }
    return item[split[0]];
  } else if (split.length === 2) {
    if (!item[split[0]] || !item[split[0]][split[1]]) {
      return "";
    }
    return item[split[0]][split[1]];
  } else if (split.length === 3) {
    if (
      !item[split[0]] ||
      !item[split[0]][split[1]] ||
      !item[split[0]][split[1]][split[2]]
    ) {
      return "";
    }
    return item[split[0]][split[1]][split[2]];
  } else if (split.length === 4) {
    if (
      !item[split[0]] ||
      !item[split[0]][split[1]] ||
      !item[split[0]][split[1]][split[2]] ||
      !item[split[0]][split[1]][split[2]][split[3]]
    ) {
      return "";
    }
    return item[split[0]][split[1]][split[2]][split[3]];
  } else {
    if (
      !item[split[0]] ||
      !item[split[0]][split[1]] ||
      !item[split[0]][split[1]][split[2]] ||
      !item[split[0]][split[1]][split[2]][split[3]] ||
      !item[split[0]][split[1]][split[2]][split[3]][split[4]]
    ) {
      return "";
    }
    return item[split[0]][split[1]][split[2]][split[3]][split[4]];
  }
}

export const getData = (reducers, data, url, type) => {
  const { dispatch, redux } = reducers;
  dispatch(
    redux({
      type: type,
      payload: {
        loading: true,
        data: false,
        errorMessage: false,
      },
    })
  );

  axiosAPI({
    method: "GET",
    url: url + data.param,
  })
    .then((response) => {
      dispatch(
        redux({
          type: type,
          payload: {
            loading: false,
            data: response.data,
            errorMessage: false,
          },
        })
      );
    })
    .catch((error) => {
      dispatch(
        redux({
          type: type,
          payload: {
            loading: false,
            data: false,
            errorMessage: errorMessage(error),
          },
        })
      );
    });
};

// export const addData = (reducers, data, url, type) => {
//   const { dispatch, redux } = reducers;
//   dispatch(
//     redux({
//       type: type,
//       payload: {
//         loading: true,
//         data: false,
//       },
//     })
//   );

//   axiosAPI({
//     method: "POST",
//     url: url,
//     timeout: 120000,
//     data: data,
//   })
//     .then((response) => {
//       if (response.data.status === 201) {
//         Swal.fire({
//           icon: "error",
//           title: "Oops...",
//           customClass: {
//             container: "z-[99999]",
//           },
//           text: response.data.messages,
//         });
//       } else {
//         Swal.fire({
//           icon: "success",
//           title: "Good job!",
//           customClass: {
//             container: "z-[99999]",
//           },
//           text: response.data.messages,
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       }
//       dispatch(
//         redux({
//           type: type,
//           payload: {
//             loading: false,
//             data: response.data,
//           },
//         })
//       );
//     })
//     .catch((error) => {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         customClass: {
//           container: "z-[99999]",
//         },
//         text: error,
//       });
//       dispatch(
//         redux({
//           type: type,
//           payload: {
//             loading: false,
//             data: false,
//           },
//         })
//       );
//     });
// };

export const addData = (reducers, data, url, type) => {
  const { dispatch, redux } = reducers;

  // Dispatch loading state
  dispatch(
    redux({
      type: type,
      payload: {
        loading: true,
        data: false,
      },
    })
  );

  // Kembalikan promise dari axios
  return axiosAPI({
    method: "POST",
    url: url,
    timeout: 120000,
    data: data,
  })
    .then((response) => {
      // Menangani respons
      if (response.data.status === 201) {
        showToast("error", response.data.messages);
      } else {
        showToast("success", response.data.messages);
      }

      // Dispatch data dari respons
      dispatch(
        redux({
          type: type,
          payload: {
            loading: false,
            data: response.data,
          },
        })
      );

      // Kembalikan respons
      return response.data; // Mengembalikan data respons
    })
    .catch((error) => {
      // Menangani error
      showToast("error", error.response?.data?.messages || "Terjadi kesalahan.");

      // Dispatch error state
      dispatch(
        redux({
          type: type,
          payload: {
            loading: false,
            data: false,
          },
        })
      );

      // Lempar error untuk penanganan lebih lanjut
      throw error; // Mengembalikan error untuk ditangani di luar
    });
};

export const updateData = (reducers, data, url, type, method = "PUT") => {
  return new Promise((resolve, reject) => {
    const { dispatch, redux } = reducers;

    // Dispatch loading state
    dispatch(
      redux({
        type: type,
        payload: {
          loading: true,
          data: false,
        },
      })
    );

    axiosAPI({
      method: method,
      url: `${url}${data.pk}`, // Menambahkan pk ke URL
      timeout: 120000,
      data: data,
    })
      .then((response) => {
        if (response.data.status === 201) {
          showToast("error", response.data.messages); // Toast error
          reject(response.data); // Reject dengan data respons
        } else {
          showToast("success", response.data.messages); // Toast success
          dispatch(
            redux({
              type: type,
              payload: {
                loading: false,
                data: response.data,
              },
            })
          );
          resolve(response.data); // Resolve dengan data respons
        }
      })
      .catch((error) => {
        showToast("error", error.response?.data?.messages || error.response?.data?.detail || "Terjadi kesalahan."); // Toast error
        dispatch(
          redux({
            type: type,
            payload: {
              loading: false,
              data: false,
            },
          })
        );
        reject(error); // Reject dengan error
      });
  });
};



export const addFormData = (reducers, data, url, type) => {
  const { dispatch, redux } = reducers;

  // Dispatch loading state
  dispatch(
    redux({
      type: type,
      payload: {
        loading: true,
        data: false,
        error: false,
      },
    })
  );

  axiosAPI({
    method: "POST",
    url: url,
    timeout: 120000,
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((response) => {
      let payload = {};
      if (response.data.status === 201) {
        showToast("error", response.data.messages); // Tampilkan notifikasi error
        payload = {
          loading: false,
          data: false,
          error: response.data.messages,
        };
      } else {
        showToast("success", response.data.messages); // Tampilkan notifikasi success
        payload = {
          loading: false,
          data: response.data,
          error: false,
        };
      }

      // Dispatch hasil ke state
      dispatch(
        redux({
          type: type,
          payload: payload,
        })
      );
    })
    .catch((error) => {
      showToast("error", error.response?.data?.messages || "Terjadi kesalahan."); // Tampilkan notifikasi error
      dispatch(
        redux({
          type: type,
          payload: {
            loading: false,
            data: false,
            error: error,
          },
        })
      );
    });
};


export const updateFormData = (reducers, data, url, type, pk) => {
  const { dispatch, redux } = reducers;
  dispatch(
    redux({
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
        Swal.fire({
          icon: "success",
          title: "Good job!",
          customClass: {
            container: "z-[99999]",
          },
          text: response.data.messages,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      dispatch(
        redux({
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
        redux({
          type: type,
          payload: {
            loading: false,
            data: false,
          },
        })
      );
    });
};

export const deleteData = (reducers, pk, url, type) => {
  const { dispatch, redux } = reducers;

  dispatch(
    redux({
      type: type,
      payload: {
        data: false,
      },
    })
  );

  // Konfirmasi menggunakan SweetAlert sebelum menghapus
  Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Anda tidak akan dapat mengembalikan data ini!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#6a82fb",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
    customClass: {
      container: "z-[99999]",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      axiosAPI({
        method: "DELETE",
        url: url + pk,
        timeout: 120000,
      })
        .then((response) => {
          // Menampilkan pesan menggunakan showToast
          if (response.data.status === 201) {
            showToast("error", response.data.messages); // Menampilkan pesan error
          } else {
            showToast("success", response.data.messages); // Menampilkan pesan sukses
          }

          // Mengirimkan data terbaru ke Redux
          dispatch(
            redux({
              type: type,
              payload: {
                data: response.data,
              },
            })
          );
        })
        .catch((error) => {
          showToast("error", error.message || "Terjadi kesalahan");

          dispatch(
            redux({
              type: type,
              payload: {
                data: false,
              },
            })
          );
        });
    }
  });
};
