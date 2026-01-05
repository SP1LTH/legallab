// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardActionArea, CardContent, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "../services/api"; // Ensure axios is set up to call your backend
import { useLanguage } from "../context/LanguageContext";

function RightSidebar() {
  const [topDocuments, setTopDocuments] = useState([]);
  const [error, setError] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchTopCitedDocuments = async () => {
      try {
        const response = await axios.get("/api/documents/top-cited");
        setTopDocuments(response.data);
      } catch (err) {
        setError("Failed to load top-cited documents.");
      }
    };
    fetchTopCitedDocuments();
  }, []);

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h6" gutterBottom>
        {language === "en" ? "THE MOST CITED DOCUMENTS" : "ХАМГИЙН ИХ ЭШЛЭГДСЭН БҮТЭЭЛҮҮД"}
      </Typography>
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}
      {topDocuments.map((doc) => (
        <Card
          variant="outlined"
          key={doc._id}
          sx={{
            marginBottom: "20px",
            ':hover': {
              boxShadow: 20, // theme.shadows[20]
            },
          }}>
          <CardActionArea component={Link} to={`/documents/${doc._id}`}>
            <CardContent>
              <Typography
                variant="subtitle1"
                sx={{ textDecoration: "none", color: "inherit" }}
              >
                {doc.title}
              </Typography>
              <Divider sx={{ marginY: 1 }} />
              <Typography variant="body2">
                {language === "en" ? "Cited: " : "Эшлэгдсэн: "}
                {doc.citationCount}
                {language === "en" ? " times" : " удаа"}
                
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}

export default RightSidebar;
