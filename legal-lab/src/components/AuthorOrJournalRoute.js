import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthorOrJournalRoute = ({ children }) => {
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    console.log("AuthorRoute - User: ", user);
    console.log("AuthorRoute - isLoggedIn: ", isLoggedIn);
  }, [user, isLoggedIn]);

  if (!isLoggedIn || !user) {
    console.log("Redirecting to login because user is not logged in or user is null");
    return <Navigate to="/login" />; // Redirect to login if not logged in
  }

  if (user.role !== "author" && user.role !== "journal") {
    console.log("Redirecting to home because user is not an author");
    return <Navigate to="/" />; // Redirect to home if not an author
  }

  return children; // Render the children if everything is okay
};

export default AuthorOrJournalRoute;