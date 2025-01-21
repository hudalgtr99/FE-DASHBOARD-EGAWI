import { Slide, toast } from "react-toastify";

/**
 * Menampilkan pesan toast dengan jenis yang
 * @param {string} message - Pesan yang ingin ditampilkan dalam toast.
 * @param {string} [type='info'] - Jenis toast (info, success, warning, error). Default: 'info'.
 * @param {int} time - Waktu Toast dalam satuan ms. Default: '3000'.
 * @param {bool} closeOnClick - tutup ketika ditekan
 */
export const showToast = (
  message,
  type = "info",
  time = 3000,
  closeOnClick = true
) => {
  const toastConfig = {
    position: "top-center",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: closeOnClick,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Slide,
    style: {
      fontSize: "14px",
      fontWeight: "semibold",
      padding: "10px 20px",
      margin: "10px 10px 10px 10px",
      borderRadius: "10px",
      backgroundColor: "#fff",
      color: "#333",
    },
  };

  switch (type) {
    case "success":
      toast.success(message, toastConfig);
      break;
    case "warning":
      toast.warning(message, toastConfig);
      break;
    case "error":
      toast.error(message, toastConfig);
      break;
    default:
      toast.info(message, toastConfig);
      break;
  }
};
