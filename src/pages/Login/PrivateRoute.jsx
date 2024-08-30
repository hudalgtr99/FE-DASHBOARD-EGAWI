import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/authentication/authenticationApi";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();

  // If the user is authenticated (has a valid token) and tries to access the login page
  if (isAuth && location.pathname === "/login") {
    return <Navigate to="/" replace />; // Redirect to home or dashboard
  }

  // If the user is not authenticated and tries to access a protected route
  if (!isAuth && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
