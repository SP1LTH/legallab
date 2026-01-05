// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../services/api";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListSubheader,
  Grid,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const Journal = () => {
  const location = useLocation();
  const { title } = location.state || {};
  const [journalSeries, setJournalSeries] = useState([]);
  const [journalDetails, setJournalDetails] = useState(null); // State for journal details
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDecades, setOpenDecades] = useState({});

  useEffect(() => {
    const fetchJournalDetails = async () => {
      try {
        // Fetch journal details by title
        const journalResponse = await axios.get(`/api/journals/title/${title}`);
        setJournalDetails(journalResponse.data); // Save summary and coverImage
      } catch (err) {
        console.error("Error fetching journal details:", err);
        if (err.response && err.response.status === 404) {
          setError("Сэтгүүл олдсонгүй.");
        } else {
          setError("Сэтгүүлийн мэдээлэл авахад алдаа гарлаа.");
        }
      }
    };

    const fetchJournalSeries = async () => {
      try {
        const url = `/api/documents/journal-series/${title}`;
        console.log("Requesting URL:", url); // Log the requested URL
        const response = await axios.get(url);
        setJournalSeries(response.data);
      } catch (err) {
        console.error("Error fetching journal series:", err); // Log the error details
        if (err.response && err.response.status === 404) {
          setError("Сэтгүүлийн цуврал олдсонгүй.");
        } else {
          setError("Сэтгүүлийн цуврал авахад алдаа гарлаа.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (title) {
      fetchJournalDetails();
      fetchJournalSeries();
    } else {
      setError("Сэтгүүлийн гарчиг олдсонгүй.");
      setIsLoading(false);
    }
  }, [title]);

  const groupByDecades = (series) => {
    return series.reduce((acc, item) => {
      const decade = Math.floor(item.publicationDate / 10) * 10;
      if (!acc[decade]) acc[decade] = [];
      acc[decade].push(item);
      return acc;
    }, {});
  };

  const handleToggleDecade = (decade) => {
    setOpenDecades((prev) => ({ ...prev, [decade]: !prev[decade] }));
  };

  if (isLoading) {
    return <Typography>Ачааллаж байна...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const groupedSeries = groupByDecades(journalSeries);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Сэтгүүлийн танилцуулга
      </Typography>

      {/* Display journal summary and cover image */}
      {journalDetails && (
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 1000, margin: "0 auto", marginBottom: 4 }}>
          <Grid container spacing={2}>
            {/* Cover Image on the Left */}
            <Grid item xs={4}>
              {journalDetails.coverImage && (
                <img
                  src={journalDetails.coverImage}
                  alt="Cover"
                  style={{ width: "100%", height: "auto", borderRadius: "4px" }}
                />
              )}
            </Grid>

            {/* Summary on the Right */}
            <Grid item xs={8}>
              <Typography variant="body1" sx={{ textAlign: "justify" }}>
                {journalDetails.summary}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Paper elevation={3} sx={{ padding: 4 }}>
        <List>
          {Object.keys(groupedSeries)
            .sort((a, b) => b - a)
            .map((decade) => (
              <React.Fragment key={decade}>
                <ListSubheader
                  onClick={() => handleToggleDecade(decade)}
                  sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                  {decade}s
                  {openDecades[decade] ? <ExpandLess /> : <ExpandMore />}
                </ListSubheader>
                <Collapse in={openDecades[decade]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {groupedSeries[decade].map((series, index) => (
                      <ListItem
                        key={index}
                        sx={{ pl: 4, cursor: "pointer" }}
                        onClick={() => (window.location.href = `#/documents/${series._id}`)} // Navigate to document
                      >
                        <ListItemText
                          primary={`${series.publicationDate} (Цуврал ${series.journalSeries})`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Journal;
