import Cookies from "js-cookie";
import { decrypted } from "@/actions";

export function setNewHeaders(response) {
  Cookies.set("srehfre", response.refresh, { expires: 3 });
  Cookies.set("casnet", response.access, { expires: 3 });
}
  
// eslint-disable-next-line
export const logout = () => {
  localStorage.clear();
  Cookies.remove("srehfre");
  Cookies.remove("casnet");
  window.location.href = "/login";
};

export const isAuthenticated = () => {
  const casnet = Cookies.get("casnet");
  if (casnet == null) {
    return casnet;
  } else {
    var decoded = decrypted(casnet);
  }
  // console.log(decoded)
  return decoded;
};

export function getToken() {
  const casnet = Cookies.get("casnet");
  let decoded;
  if (casnet == null) {
    return casnet;
  }
  decoded = decrypted(casnet);
  return decoded
}

