// plugins
import { icons } from "../../public/icons";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";
import axiosAPI from "@/authentication/axiosApi";

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
  return JSON.parse(decrypted);
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

export const addData = (reducers, data, url, type) => {
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
    method: "POST",
    url: url,
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

export const updateData = (reducers, data, url, type) => {
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
    url: url + data.pk,
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

export const addFormData = (reducers, data, url, type) => {
  const { dispatch, redux } = reducers;
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
        payload = {
          loading: false,
          data: false,
          error: response.data.messages,
        };
      } else {
        payload = {
          loading: false,
          data: response.data,
          error: false,
        };
      }
      dispatch(
        redux({
          type: type,
          payload: payload,
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
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#6a82fb",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
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
                data: false,
              },
            })
          );
        });
    }
  });
};
