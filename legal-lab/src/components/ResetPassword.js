// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from '../services/api';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the token from the URL
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (!token) {
      // Redirect if no token is present
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/auth/reset-password', { token, newPassword });
      setSuccess('Нууц үг амжилттай шинэчлэгдлээ.');
      setTimeout(() => navigate('/login'), 3000); // Redirect after success
    } catch (err) {
      setError(err.response?.data?.message || 'Нууц үг шинэчлэхэд алдаа гарлаа.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Нууц үг сэргээх
      </Typography>
      {error && <Typography color="error" align="center">{error}</Typography>}
      {success ? (
        <Typography color="primary" align="center">{success}</Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Шинэ нууц үг"
              type="password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Нууц үг шинэчлэх
          </Button>
        </form>
      )}
    </Container>
  );
};

export default ResetPassword;
