import { ThemeProvider } from "./context/ThemeContext";
import Router from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";
import { isAuthenticated } from "@/authentication/authenticationApi";
import { jwtDecode } from "jwt-decode";

let jwt = null;

if (isAuthenticated()) {
  const token = isAuthenticated();
  jwt = jwtDecode(token);
}

const App = () => {
  return (
    <ThemeProvider>
      <ToastContainer />
      {jwt ? (
        <AuthProvider>
          <Router />
        </AuthProvider>
      ) : (
        <Router />
      )}
    </ThemeProvider>
  );
};

export default App;
