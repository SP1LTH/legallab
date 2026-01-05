// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React from 'react';
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h1" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Хуудас олдсонгүй!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Та хаягаа буруу оруулсан эсвэл энэ хуудас устгагдсан байна.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleGoHome}>
          Эхлэл рүү буцах
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
