// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import { useLanguage } from "../context/LanguageContext";

const DictionaryCreate = () => {
  const [formData, setFormData] = useState({
    term: "",
    explanation: "",
    extra: "",
    ru: "",
    en: "",
    la: "",
    de: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { language } = useLanguage();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.term || !formData.explanation) {
      setError("Term and explanation are required.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/admin/dictionary", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSnackbarOpen(true);
      setTimeout(() => navigate("/dictionary-edit"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add the term.");
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        {language === "en" ? "Add New Term" : "Нэр томьёо нэмэх"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label={language === "en" ? "Term" : "Нэр томьёо"}
          name="term"
          value={formData.term}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label={language === "en" ? "Explanation" : "Тайлбар"}
          name="explanation"
          value={formData.explanation}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
        />
        <TextField
          label={language === "en" ? "Source" : "Эх сурвалж"}
          name="extra"
          value={formData.extra}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label={language === "en" ? "Russian" : "Орос"}
          name="ru"
          value={formData.ru}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label={language === "en" ? "English" : "Англи"}
          name="en"
          value={formData.en}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label={language === "la" ? "Latin" : "Латин"}
          name="la"
          value={formData.la}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label={language === "de" ? "German" : "Герман"}
          name="de"
          value={formData.de}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box textAlign="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? (language === "en" ? "Saving..." : 'Хадгалж байна...') : (language === "en" ? "Save" : 'Хадгалах')}
          </Button>
        </Box>
      </form>
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
          {language === "en" ? "Term successfully added!" : "Амжилттай хадгалагдлаа!"}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DictionaryCreate;
