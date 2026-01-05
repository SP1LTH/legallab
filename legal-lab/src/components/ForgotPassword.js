// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'И-мэйл илгээхэд алдаа гарлаа.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Нууц үг мартсан уу?
      </Typography>
      <form onSubmit={handleForgotPassword}>
        <TextField
          label="Имэйл"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
        />
        {error && <Typography color="error">{error}</Typography>}
        {message && <Typography color="success">{message}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Илгээх
        </Button>
      </form>
    </Container>
  );
};

export default ForgotPassword;
