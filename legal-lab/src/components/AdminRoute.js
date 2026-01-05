// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    console.log("AdminRoute - User: ", user);
    console.log("AdminRoute - isLoggedIn: ", isLoggedIn);
  }, [user, isLoggedIn]);

  if (!isLoggedIn || !user) {
    console.log("Redirecting to login because user is not logged in or user is null");
    return <Navigate to="/login" />; // Redirect to login if not logged in
  }

  if (user.role !== "admin") {
    console.log("Redirecting to home because user is not an admin");
    return <Navigate to="/" />; // Redirect to home if not admin
  }

  return children; // Render the children if everything is okay
};

export default AdminRoute;
