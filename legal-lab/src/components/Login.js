// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Checkbox, FormControlLabel, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const Login = ({ isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false); // New state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Бүх талбарыг бөглөнө үү.');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

      // Use sessionStorage or localStorage based on "Stay Logged In"
      const storage = stayLoggedIn ? localStorage : sessionStorage;
      storage.setItem('token', token);
      login(user, token);

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err.response || err.message);
      setError(err.response?.data?.message || 'Нэвтрэхэд алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5, padding: 4, backgroundColor: isDarkMode ? "#333" : "#f2f2f2", borderRadius: 5 }}>
        
          <Typography variant="h4" align="center" gutterBottom>
            {language === "en" ? "Login" : "Нэвтрэх"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                label={language === "en" ? "Email" : "Имэйл"}
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label={language === "en" ? "Password" : "Нууц үг"}
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            <FormControlLabel
              control={<Checkbox checked={stayLoggedIn} onChange={(e) => setStayLoggedIn(e.target.checked)} />}
              label={language === "en" ? "Stay logged in" : "Нэвтэрсэн хэвээр байх"}
            />
            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? (language === "en" ? "Loading..." : 'Ачааллаж байна...') : (language === "en" ? "Login" : 'Нэвтрэх')}
            </Button>
          </form>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Typography variant="body2">
              {language === "en" ? "A new user? " : "Шинэ хэрэглэгч үү? "}<a href="#/register">{language === "en" ? "Register" : "Бүртгүүлэх"}</a>
            </Typography>
            <Typography variant="body2">
              <a
                href="#/forgot-password"
              >{language === "en" ? "Forgot password?" : "Нууц үг мартсан уу?"}</a>
            </Typography>
          </Box>
    </Container>
  );
};

export default Login;
