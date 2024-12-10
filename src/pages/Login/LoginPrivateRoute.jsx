import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/authentication/authenticationApi";

const LoginPrivateRoute = ({ children }) => {
    const isAuth = isAuthenticated();

    // If the user is authenticated, redirect to the home page
    if (isAuth) {
        return <Navigate to="/" replace />;
    }
    // else{
    //     return <Navigate to="/login" replace />;
    // }

    // If the user is not authenticated, render the login page
    return children;
};

export default LoginPrivateRoute;
