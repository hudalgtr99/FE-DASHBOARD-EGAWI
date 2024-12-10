import Cookies from "js-cookie"
export function getCookie(cookieName) {
  return Cookies.get(cookieName) || null
}

// Fungsi untuk menyimpan atau memperbarui cookie
export function setCookie(cookieName, value, options = {}) {
  Cookies.set(cookieName, value, {
    path: "/",
    secure: true,
    sameSite: "Lax",
    ...options
  })
}

// Fungsi untuk menghapus cookie
export function removeCookie(cookieName) {
  Cookies.remove(cookieName, { path: "/" }) // Menghapus cookie dengan nama yang diberikan
}
