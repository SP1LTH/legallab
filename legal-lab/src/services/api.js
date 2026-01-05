// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import axios from "axios";

const api = axios.create({
  // baseURL: "https://backend.legalresearch.mn/",
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Assuming 401 indicates token expiration
      alert("Таны нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү.");
      // Optionally, redirect to the login page or clear the token
      localStorage.removeItem("token");
      window.location.href = "#/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
