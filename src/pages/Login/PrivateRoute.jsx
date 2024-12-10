import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/authentication/authenticationApi";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();

  if (isAuth && location.pathname === "/login") {
    return <Navigate to="/" replace />; 
  }

  if (!isAuth && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
