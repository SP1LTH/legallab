// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const Profile = () => {
  const { user, setUser } = useAuth(); // Хэрэглэгчийн мэдээллийг авах
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    email: "",
    password: "",
    phoneNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cyrillicWarning, setCyrillicWarning] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Хэрэглэгчийн одоогийн мэдээллээр формыг шинэчлэх
    if (user) {
      setFormData({
        lastname: user.lastname,
        firstname: user.firstname,
        email: user.email,
        password: "",
        phoneNumber: user.phoneNumber
      });
    }
  }, [user]);

  // Оролтын утгуудыг өөрчлөх функц
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "firstname" || name === "lastname") &&
      /[^а-яёөү -]/i.test(value)
    ) {
      setCyrillicWarning("Зөвхөн Монгол кирилл үсэг оруулна уу.");
      return;
    }
    setFormData({ ...formData, [name]: value });
    setCyrillicWarning("");
  };

  // Формыг илгээх үед дуудагдах функц
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.put("/api/auth/me", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(response.data.user); // Хэрэглэгчийн мэдээллийг шинэчлэх
      // setSuccess("Хэрэглэгчийн булан амжилттай шинэчлэгдлээ");
      setSnackbarOpen(true); // Show success Snackbar
    } catch (err) {
      console.error("Хэрэглэгчийн булан шинэчлэхэд алдаа гарлаа:", err);
      // setError("Хэрэглэгчийн булан шинэчлэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!user) {
    return <Typography variant="h5">Хэрэглэгчийн булан ачааллаж байна...</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        {language === "en" ? "Profile" : "Хэрэглэгчийн булан"}
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
        <TextField
          label={language === "en" ? "Password" : "Нууц үг"}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          helperText="Хэрэв та одоогийн нууц үгийг хадгалах бол хоосон орхиорой"
        />
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="primary" sx={{ mt: 2 }}>
            {success}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : (language === "en" ? "Save Change" : "Өөрчлөлт хадгалах")}
        </Button>
      </form>
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
          {language === "en" ? "Successfully saved!" : "Амжилттай хадгаллаа!"}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
