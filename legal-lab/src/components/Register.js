// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const Register = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "user", // default role is "user"
  });
  const [error, setError] = useState("");
  const [phoneWarning, setPhoneWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [cyrillicWarning, setCyrillicWarning] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { language } = useLanguage();

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "firstname" || name === "lastname") &&
      /[^а-яёөү -]/i.test(value) // Allow Cyrillic letters, spaces, and "-"
    ) {
      setCyrillicWarning("Зөвхөн Монгол кирилл үсэг оруулна уу.");
      return;
    }

    // Validate phone number (must be exactly 8 digits)
    if (name === "phoneNumber" && value && !/^\d{0,8}$/.test(value)) {
      setPhoneWarning("Утасны дугаар 8 оронтой байх ёстой.");
      return;
    }

    setFormData({ ...formData, [name]: value });
    setCyrillicWarning("");
    setPhoneWarning("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.password
    ) {
      setError("Бүх талбарыг бөглөнө үү.");
      return;
    }

    if (formData.phoneNumber && formData.phoneNumber.length !== 8) {
      setError("Утасны дугаар 8 оронтой байх ёстой.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/auth/register", formData);
      setSnackbarOpen(true); // Show success Snackbar
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error("Registration error:", err.response || err.message);
      setError(
        err.response?.data?.message ||
          "Бүртгэл амжилтгүй боллоо. Дахин оролдоно уу."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 5,
        padding: 4,
        backgroundColor: isDarkMode ? "#333" : "#f2f2f2",
        borderRadius: 5,
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        {language === "en" ? "Register" : "Бүртгүүлэх"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label={language === "en" ? "Last Name" : "Овог"}
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label={language === "en" ? "First Name" : "Нэр"}
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        {cyrillicWarning && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {cyrillicWarning}
          </Typography>
        )}
        <TextField
          label={language === "en" ? "Email" : "Имэйл"}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label={language === "en" ? "Phone Number (Optional)" : "Утасны дугаар (Сонголт)"}
          name="phoneNumber"
          type="text"
          value={formData.phoneNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {phoneWarning && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {phoneWarning}
          </Typography>
        )}
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="role-label">
            {language === "en" ? "Role" : "Үүрэг"}
          </InputLabel>
          <Select
            labelId="role-label"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            label={language === "en" ? "Role" : "Үүрэг"}
          >
            <MenuItem value="user">
              {language === "en" ? "User" : "Хэрэглэгч"}
            </MenuItem>
            <MenuItem value="author">
              {language === "en" ? "Author" : "Зохиогч"}
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          label={language === "en" ? "Password" : "Нууц үг"}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading
            ? language === "en"
              ? "Registering..."
              : "Бүртгүүлж байна..."
            : language === "en"
            ? "Register"
            : "Бүртгүүлэх"}
        </Button>
      </form>
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        {language === "en"
          ? "Already registered? "
          : "Аль хэдийн бүртгэлтэй юу? "}
        <a href="#/login">
          {language === "en" ? "Login" : "Нэвтрэх"}
        </a>
      </Typography>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {language === "en"
            ? "Successfully registered! Sent you a confirm email link."
            : "Амжилттай бүртгэгдлээ! Бүртгэл баталгаажуулах имэйл хүлээн авна уу."}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
