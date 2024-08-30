import Cookies from "js-cookie";
import { decrypted } from "@/actions";

export function setNewHeaders(response) {
  Cookies.set("token", response.token, { expires: 3 });
  Cookies.set("user", response.access, { expires: 3 });
}

// eslint-disable-next-line
export const logout = () => {
  localStorage.clear();
  Cookies.remove("token");
  Cookies.remove("user");
  window.location.href = "/login";
  // TODO: invalidate token on backend
};

export const isAuthenticated = () => {
  const token = Cookies.get("user");
  if (token == null) {
    return token;
  } else {
    var decoded = decrypted(token);
  }
  return decoded;
};

export function getToken() {
  const token = Cookies.get("token");
  if (token == null) {
    return token;
  }
  return token;
}
