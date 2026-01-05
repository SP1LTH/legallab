// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box
} from "@mui/material";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const MyDocuments = () => {
  const { user } = useAuth(); // Get the logged-in user info
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Fetch the user's uploaded documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get("/api/documents/my-documents", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setDocuments(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Failed to fetch documents");
        console.error("Error fetching documents:", err);
      }
    };
    fetchDocuments();
  }, []);

  // Delete a document
  const handleDelete = async (documentId) => {
    try {
      await axios.delete(`/api/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDocuments(documents.filter((doc) => doc._id !== documentId)); // Update UI
      alert("Document deleted successfully");
    } catch (err) {
      setError("Failed to delete document");
      console.error("Error deleting document:", err);
    }
  };

  // Determine the ribbon style based on status
  const getRibbonStyles = (status) => {
    switch (status) {
      case "rejected":
        return { backgroundColor: "red", text: (language === "en" ? "Rejected" : "Буцаагдсан")};
      case "approved":
        return { backgroundColor: "green", text: (language === "en" ? "Accepted" : "Зөвшөөрсөн")};
      case "pending":
        return { backgroundColor: "blue", text: (language === "en" ? "Pending" : "Хүлээгдэж буй")};
      default:
        return { backgroundColor: "gray", text: (language === "en" ? "Pending" : "Хүлээгдэж буй")};
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        {language === "en" ? "My uploaded documents" : "Миний оруулсан бүтээлүүд"}
      </Typography>
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      <Grid container spacing={3}>
        {documents.map((doc) => {
          const ribbon = getRibbonStyles(doc.status);
          const isApproved = doc.status === "approved";

          return (
            <Grid item xs={12} sm={6} md={4} key={doc._id}>
              <Box sx={{ position: "relative" }}>
                {/* Ribbon */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -10,
                    left: -5,
                    backgroundColor: ribbon.backgroundColor,
                    color: "white",
                    padding: "5px 10px",
                    transformOrigin: "top left",
                    zIndex: 1,
                    fontSize: "12px",
                  }}
                >
                  {ribbon.text}
                </Box>

                {/* Card */}
                <Card
                  variant="outlined"
                  sx={{
                    mt: 3,
                    ':hover': {
                      boxShadow: 20, // theme.shadows[20]
                    }
                  }}>
                  <CardContent>
                    <Typography variant="h6">{doc.title}</Typography>
                    {doc.subtitle && (
                      <Typography variant="subtitle1" color="text.secondary">
                        {doc.subtitle}
                      </Typography>
                    )}
                    {doc.journalSeries && (
                      <Typography variant="h6">
                        {doc.category === "Эмхэтгэл"
                          ? `${convertToRoman(doc.journalSeries)} Боть`
                          : `Цуврал ${doc.journalSeries}`}
                      </Typography>
                    )}
                    {doc.journalNumber && (
                      <Typography variant="h6">Дугаар {doc.journalNumber}</Typography>
                    )}
                    <Typography variant="h6">({doc.publicationDate})</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doc.rejectComment}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate(`/documents/edit/${doc._id}`)}
                      disabled={isApproved}
                    >
                      {language === "en" ? "Edit" : "Засах"}
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(doc._id)}
                    >
                      {language === "en" ? "Delete" : "Устгах"}
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

// Utility function to convert numbers to Roman numerals
const convertToRoman = (num) => {
  const romanNumerals = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1],
  ];
  let result = "";
  for (const [roman, value] of romanNumerals) {
    while (num >= value) {
      result += roman;
      num -= value;
    }
  }
  return result;
};

export default MyDocuments;
