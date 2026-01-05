// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import axios from "../services/api";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCitationDialog, setOpenCitationDialog] = useState(false);
  const [currentCitation, setCurrentCitation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get("/api/documents/favorites", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setFavorites(response.data);
      } catch (err) {
        setError("Could not fetch favorite documents.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleCite = (doc) => {
    setCurrentCitation(doc.references);
    setOpenCitationDialog(true);
  };

  const handleDelete = async (docId) => {
    try {
      await axios.delete(`/api/documents/favorites/${docId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFavorites(favorites.filter((doc) => doc._id !== docId));
      alert("Document removed from favorites.");
    } catch (err) {
      setError("Failed to delete document from favorites.");
    }
  };

  const handleCopyCitation = () => {
    const selection = window.getSelection();
    const range = document.createRange();
    const citationElement = document.getElementById("citation-text");
    range.selectNodeContents(citationElement);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges(); // Clear selection after copy
    alert("Эшлэл хууллаа!");
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Миний хадгалсан бүтээлүүд
      </Typography>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <Grid container spacing={3}>
        {favorites.map((doc) => (
          <Grid item xs={12} sm={6} md={4} key={doc._id}>
            <Card
              sx={{
                marginBottom: "20px",
                padding: "10px",
                ':hover': {
                  boxShadow: 20, // theme.shadows[20]
                }
              }}>
              <CardContent>
                <Typography variant="h6">
                  <Link to={`/documents/${doc._id}`}>{doc.title}</Link>
                </Typography>
                <Typography variant="body2">{doc.author}</Typography>
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  padding: "10px",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => navigate(`/documents/${doc._id}`)}
                >
                  Унших
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleCite(doc)}
                >
                  Эшлэх
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(doc._id)}
                >
                  Устгах
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Citation Dialog */}
      <Dialog
        open={openCitationDialog}
        onClose={() => setOpenCitationDialog(false)}
      >
        <DialogContent dividers>
          <Typography variant="h6">Citation</Typography>
          <Typography
            id="citation-text"
            variant="body1"
            component="div"
            sx={{ whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: currentCitation }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyCitation} variant="contained">Хуулах</Button>
          <IconButton onClick={() => setOpenCitationDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Favorites;
