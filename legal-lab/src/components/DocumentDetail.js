// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../services/api";
import {
  Box,
  Grid,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Paper,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Journal from "./Journal";

const DocumentDetail = () => {
  const { id } = useParams();
  const [localDocument, setLocalDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [citationText, setCitationText] = useState("");
  const [currentDocumentId, setCurrentDocumentId] = useState(null);
  const [citationDialogOpen, setCitationDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`/api/documents/${id}`);
        setLocalDocument(response.data);
      } catch (err) {
        setError("Дэлгэрэнгүй мэдээлэл авахад алдаа гарлаа.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  const handleReadClick = (pageRange = null) => {
    if (!isLoggedIn) {
      alert("Бүтээл уншихын тулд нэвтэрнэ үү.");
      navigate("/login");
    } else {
      const readPath = pageRange ? `/documents/read/${id}?pageRange=${pageRange}` : `/documents/read/${id}`;
      navigate(readPath);
    }
  };

  const handleCite = (result) => {
    const documentLink = `${window.location.origin}/#/documents/${result._id}`;
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${today.getDate().toString().padStart(2, "0")}`;

    let fullCitation;

    if (result.pageRange) {
      fullCitation = `${result.name}, "${result.title}", ${result.journalSeries} <i>${result.journalTitle}</i> №${result.journalNumber} (${result.publicationDate}), ${result.pageRange} дахь тал,`;
    } else {
      fullCitation = `${result.name}, "${result.title}", ${result.publicationDate}.`;
    }

    fullCitation += ` Холбоос: ${documentLink}, Сүүлд үзсэн огноо: ${formattedDate}.`;

    console.log(fullCitation);
    setCitationText(fullCitation);
    setCurrentDocumentId(result._id); // Store document ID
    setCitationDialogOpen(true);
  };

  const handleCopyCitation = async () => {
    try {
      // Copy text logic
      const selection = window.getSelection();
      const range = document.createRange();
      const citationElement = document.getElementById("citation-text");
      range.selectNodeContents(citationElement);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      selection.removeAllRanges();
      alert("Эшлэл хууллаа!");

      // Call the backend to increment the citation count
      if (currentDocumentId) {
        console.log(currentDocumentId);
        await axios.post(
          `/api/documents/cite/${currentDocumentId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
    } catch (err) {
      console.error("Эшлэл хуулж чадсангүй:", err);
      alert(err.response.data.message);
    }
  };

  if (isLoading) {
    return <Typography>Ачааллаж байна...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!localDocument) {
    return <Typography>Бичиг баримт олдсонгүй.</Typography>;
  }

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleBreadcrumbClick = () => {
    setSelectedArticle(null);
  };

  const handleJournalClick = () => {
    navigate("/journal", { state: { title: localDocument.title } });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          color="inherit"
          onClick={handleBreadcrumbClick}
          sx={{ cursor: "pointer" }}
        >
          {localDocument.title}
        </Link>
        {selectedArticle && (
          <Typography color="textPrimary">{selectedArticle.title}</Typography>
        )}
      </Breadcrumbs>

      {!selectedArticle && (
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 1000, margin: '0 auto' }}>
          {localDocument.category === "Сэтгүүл" || localDocument.category === "Эмхэтгэл" ? (
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <img
                  src={localDocument.coverImageUrl || "https://picsum.photos/300/400"}
                  alt="Thumbnail"
                  style={{ width: "100%", height: "auto" }}
                />
              </Grid>
              <Grid item xs={8}>
                <Typography variant="h4" gutterBottom>
                  {localDocument.category === "Эмхэтгэл"
                    ? `${convertToRoman(localDocument.journalSeries)} Боть`
                    : `Цуврал ${localDocument.journalSeries}, ${localDocument.publicationDate} он / Дугаар ${localDocument.journalNumber}`}
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ cursor: "pointer", fontStyle: "italic", textDecoration: "underline" }}
                  onClick={handleJournalClick}
                >
                  <strong>{localDocument.category === "Эмхэтгэл" ? "Эмхэтгэл:" : "Сэтгүүл:"}</strong> {localDocument.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Зохиогч:</strong> {localDocument.author}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Агуулга
                </Typography>
                <ol>
                  {localDocument.journalArticles.map((article, index) => (
                    <li key={index}>
                      <Typography
                        variant="body1"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleArticleClick(article)}
                      >
                        <strong>
                          <u>{article.title}</u>
                        </strong>{" "}
                        (Хуудас {article.pageRange})
                      </Typography>
                      <Typography variant="body2">{article.name}</Typography>
                    </li>
                  ))}
                </ol>
              </Grid>
            </Grid>
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                {localDocument.title}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Metadata Section */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Зохиогч:</strong> {localDocument.author}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Категори:</strong> {localDocument.category}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Товч:</strong> {localDocument.summary}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Эшлэгдсэн тоо:</strong> {localDocument.citationCount}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Салбар эрх зүй:</strong> 
                    <ul>
                      {localDocument.sector.map((sector, index) => (
                        <li key={index}>{sector}</li>
                      ))}
                    </ul>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Он:</strong> {localDocument.publicationDate}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Түлхүүр үг:</strong> {localDocument.keywords}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Хуудас:</strong> {localDocument.pageCount}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Хэл:</strong> {localDocument.language}
                  </Typography>
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReadClick}
                  startIcon={<VisibilityIcon />}
                >
                  Унших
                </Button>

                <Button
                  variant="outlined"
                  onClick={() =>
                    handleCite(localDocument)
                  }
                  startIcon={<ContentCopyIcon />}
                >
                  Эшлэх
                </Button>
              </Box>
            </>
          )}
        </Paper>
      )}

      {selectedArticle && (
        <Paper elevation={3} sx={{ padding: 4, mt: 4, maxWidth: 800, margin: '0 auto' }}>
          <Typography variant="h5" gutterBottom>
            {selectedArticle.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Зохиогч:</strong> {selectedArticle.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Хуудас:</strong> {selectedArticle.pageRange}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Категори:</strong> {selectedArticle.category}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Салбар эрх зүй:</strong> 
            <ul>
              {selectedArticle.sector.map((sector, index) => (
                <li key={index}>{sector}</li>
              ))}
            </ul>
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">{selectedArticle.content}</Typography>
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleReadClick(selectedArticle.pageRange)}
              startIcon={<VisibilityIcon />}
            >
              Унших
            </Button>

            <Button
              variant="outlined"
              onClick={() =>
                handleCite(localDocument)
              }
              startIcon={<ContentCopyIcon />}
            >
              Эшлэх
            </Button>
          </Box>
        </Paper>
      )}

      <div id="canvas-container"></div>

      {/* Citation Dialog */}
      <Dialog
        open={citationDialogOpen}
        onClose={() => setCitationDialogOpen(false)}
      >
        <DialogTitle>Эшлэл</DialogTitle>
        <DialogContent dividers>
          <Typography
            id="citation-text"
            sx={{ fontStyle: "italic" }}
            dangerouslySetInnerHTML={{ __html: citationText }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyCitation} startIcon={<ContentCopyIcon />}>
            Хуулах
          </Button>
          <Button onClick={() => setCitationDialogOpen(false)}>Хаах</Button>
        </DialogActions>
      </Dialog>
    </Box>
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

export default DocumentDetail;
