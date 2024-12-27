import { ThemeProvider } from "./context/ThemeContext";
import Router from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastContainer />
        <Router />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
