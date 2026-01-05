// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import axios from "../services/api";
import {
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookIcon from "@mui/icons-material/Book";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Pagination from "@mui/material/Pagination"; // Import Pagination component
import { useLanguage } from "../context/LanguageContext";

const MainContent = ({
  selectedCategory,
  selectedSector,
  searchTerm,
  onFilterCategories,
  selectedCategories,
  yearFilter, // Add yearFilter prop
}) => {
  const [documents, setDocuments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [citationDialogOpen, setCitationDialogOpen] = useState(false);
  const [citationText, setCitationText] = useState("");
  const [currentDocumentId, setCurrentDocumentId] = useState(null); // New state to store document ID
  const [sortOption, setSortOption] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { language } = useLanguage();

  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const resultsPerPage = 25; // Number of results per page

  // Filter documents by year
  const applyYearFilter = (data) => {
    console.log("Applying year filter:", yearFilter);
    if (!yearFilter || !yearFilter.range) {
      console.log("No year filter applied.");
      return data; // If no year filter is applied, return the original data
    }
  
    const yearRangeRegex = /^\d{4}-\d{4}$/; // Validate the format "YYYY-YYYY"
    if (!yearRangeRegex.test(yearFilter.range)) {
      console.error("Invalid year range format. Expected format: YYYY-YYYY");
      return data; // Return original data if the format is invalid
    }
  
    const [fromYear, toYear] = yearFilter.range.split("-").map(Number);
  
    console.log("Year Filter Applied:", { fromYear, toYear });
    return data.filter((doc) => {
      return doc.publicationDate >= fromYear && doc.publicationDate <= toYear;
    });
  };

  // Inside your `MainContent` useEffect for fetching documents, include `searchTerm`
  // TODO: setguul darahad uguuleluud haragdaad baigaag zasah. shuult towch setguul darahad haragdaad uguulel darahad alga bolood baina.
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm) {
        setLoading(true);
        setError(null);

        try {
          const response = await axios.get(
            `/api/documents/search?query=${searchTerm}`
          );

          const filteredData = response.data.flatMap((doc) => {
            const results = [];

            // Check if the doc.title includes the searchTerm
            if (doc.title.toLowerCase().includes(searchTerm.toLowerCase())) {
              results.push(doc);
            }

            // Check if journalArticles exist and filter based on searchTerm
            if (doc.journalArticles && doc.journalArticles.length > 0) {
              const matchingArticles = doc.journalArticles.filter((journal) =>
                journal.title.toLowerCase().includes(searchTerm.toLowerCase())
              );

              // Add metadata to matching articles
              matchingArticles.forEach((journal) => {
                journal.publicationDate = doc.publicationDate;
                journal.journalTitle = doc.title;
                journal.journalSeries = doc.journalSeries;
                journal.journalNumber = doc.journalNumber;
                journal.journalId = doc._id;
              });

              results.push(...matchingArticles);
            }

            return results;
          });

          const yearFilteredData = applyYearFilter(filteredData); // Apply year filter
          setFilteredData(yearFilteredData);

          console.log(yearFilteredData);

          // Calculate counts per category
          const categoryCounts = response.data.reduce((acc, doc) => {
            acc[doc.category] = (acc[doc.category] || 0) + 1;
            return acc;
          }, {});

          onFilterCategories(categoryCounts); // Pass categories to Sidebar
        } catch (err) {
          setError("Хайлтын илэрцийг дуудаж чадсангүй.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSearchResults();
  }, [searchTerm, onFilterCategories, yearFilter]); // Add yearFilter as a dependency

  useEffect(() => {
    const fetchDocumentsByCategory = async () => {
      if (selectedCategory) {
        setLoading(true);
        setError(null);

        try {
          const response = await axios.get(
            `/api/documents/category/${selectedCategory}`
          );
          setDocuments(response.data);

          // Filter data based on selectedCategory
          const filteredData = response.data.flatMap((doc) => {
            if (doc.category === selectedCategory) {
              return [doc];
            }
            return (doc.journalArticles || []).filter((journal) => {
              if (journal.category === selectedCategory) {
                journal.publicationDate = doc.publicationDate;
                journal.journalTitle = doc.title;
                journal.journalSeries = doc.journalSeries;
                journal.journalNumber = doc.journalNumber;
                journal.journalId = doc._id;
                return true;
              }
              return false;
            });
          });

          const yearFilteredData = applyYearFilter(filteredData); // Apply year filter
          setFilteredData(yearFilteredData);
          console.log(filteredData);
        } catch (err) {
          setError("Сонгосон бүтээлийн төрөл хоосон байна.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDocumentsByCategory();
  }, [selectedCategory, yearFilter]); // Add yearFilter as a dependency

  useEffect(() => {
    const fetchDocumentsBySector = async () => {
      if (selectedSector) {
        setLoading(true);
        setError(null);

        try {
          const response = await axios.get(
            `/api/documents/sector/${selectedSector}`
          );
          const yearFilteredData = applyYearFilter(response.data); // Apply year filter
          setFilteredData(yearFilteredData);
        } catch (err) {
          setError("Сонгосон салбар эрх зүй хоосон байна.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDocumentsBySector();
  }, [selectedSector, yearFilter]); // Add yearFilter as a dependency

  const handleAuthorClick = async (author) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/documents/author/${author}`);
      setDocuments(response.data);
    } catch (err) {
      setError("Хайсан зохиогчийн бүтээлүүдийг дуудаж чадсангүй.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (documentId) => {
    try {
      await axios.post(
        `/api/documents/favorites`,
        { documentId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Бүтээл хадгаллаа!");
    } catch (err) {
      console.error("Failed to save document:", err);
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

      // rank update hiih
    } catch (err) {
      console.error("Failed to cite document:", err.response.data.message);
      alert(err.response.data.message);
    }
  };

  // Sorting logic
  const sortDocuments = (option) => {
    const sorted = [...documents];
    if (option === "Шинэ нь эхэндээ") {
      sorted.sort(
        (a, b) => new Date(b.publicationDate) - new Date(a.publicationDate)
      );
    } else if (option === "Хуучин нь эхэндээ") {
      sorted.sort(
        (a, b) => new Date(a.publicationDate) - new Date(b.publicationDate)
      );
    } else if (option === "Үсгийн дарааллаар (А-Я)") {
      sorted.sort((a, b) => {
        const titleA = a.title.toLowerCase(); // Convert to lowercase for case-insensitive comparison
        const titleB = b.title.toLowerCase();
        return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
      });
    } else if (option === "Үсгийн дарааллаар (Я-А)") {
      sorted.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return titleA > titleB ? -1 : titleA < titleB ? 1 : 0;
      });
    }
    setDocuments(sorted);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    sortDocuments(option);
    setAnchorEl(null); // Close dropdown
  };

  // Handle dropdown menu opening and closing
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredDocuments = selectedCategories.length
    ? filteredData.filter((doc) => selectedCategories.includes(doc.category))
    : filteredData;

  // Calculate the documents to display on the current page
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentDocuments = filteredDocuments.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value); // Update the current page
  };

  return (
    <div>
      {loading &&
        (language === "en" ? <p>Loading...</p> : <p>Уншиж байна...</p>)}
      {error && <p>{error}</p>}

      {filteredDocuments.length > 0 ? (
        <ul>
          <h2>
            {filteredDocuments.length}{" "}
            {language === "en" ? "results" : "илэрц"}
          </h2>

          {/* Sort Dropdown */}
          <Box sx={{ display: "flex", mb: 2, bgcolor: "background.paper", width: "fit-content" }}>
            <Button
              variant="outlined"
              onClick={handleMenuOpen}
              startIcon={<BookIcon />}
              endIcon={<ExpandMoreIcon />}
              sx={{
                textTransform: "none", // Optional: Keep button text readable
              }}
            >
              {language === "en" ? "Sort by: " : "Шүүлт: "}
              {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {[
                "Үсгийн дарааллаар (А-Я)",
                "Үсгийн дарааллаар (Я-А)",
                "Шинэ нь эхэндээ",
                "Хуучин нь эхэндээ",
              ].map((option) => (
                <MenuItem
                  key={option}
                  selected={sortOption === option}
                  onClick={() => handleSortChange(option)}
                >
                  <Typography variant="inherit">
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Typography>
                  {sortOption === option && (
                    <ListItemIcon sx={{ marginRight: "auto" }}>
                      <CheckIcon fontSize="small" />
                    </ListItemIcon>
                  )}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Display current page documents */}
          {currentDocuments.map((result, index) => (
            <Card
              variant="outlined"
              key={index}
              sx={{
                display: "flex",
                alignItems: "stretch",
                mb: 3,
                ":hover": {
                  boxShadow: 20, // theme.shadows[20]
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ display: "flex", alignItems: "center", color: "#79747E" }}>
                  {result.pageRange ? (
                    <ArticleOutlinedIcon sx={{ mr: 1 }} />
                  ) : (
                    <BookOutlinedIcon sx={{ mr: 1 }} />
                  )}
                  {result.category}
                </Typography>
                <Typography variant="h6">
                  <Link
                    to={result.pageRange ? `/documents/${result.journalId}` : `/documents/${result._id}`}
                    style={{ color: "black", textDecoration: "none", fontWeight: "bold" }}
                    onMouseOver={(e) => {
                      e.target.style.color = "red";
                      e.target.style.textDecoration = "underline";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = "black";
                      e.target.style.textDecoration = "none";
                    }}
                  >
                    {result.category === "Сэтгүүл"
                      ? `${result.title} Цуврал ${result.journalSeries} Дугаар ${result.journalNumber}`
                      : result.title}
                  </Link>
                </Typography>
                {result.category === "Эмхэтгэл" && result.subtitle && (
                  <Typography variant="body2" sx={{ color: "#79747E", fontStyle: "italic" }}>
                    {result.subtitle}
                  </Typography>
                )}
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" sx={{ color: "#79747E", fontStyle: result.pageRange ? "italic" : "normal" }}>
                  {result.pageRange
                    ? `${result.journalTitle}, Цуврал ${result.journalSeries}, Дугаар ${result.journalNumber} (${result.publicationDate}), ${result.pageRange}`
                    : result.publicationDate}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mb: 1, minWidth: "120px" }}
                  onClick={() =>
                    (window.location.href = `#/documents/${result._id}`)
                  }
                  startIcon={<VisibilityIcon />}
                  style={{ justifyContent: "flex-start" }}
                >
                  {language === "en" ? "Read" : "Унших"}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1, minWidth: "120px" }}
                  onClick={() => handleSave(result._id)}
                  startIcon={<BookmarkIcon />}
                  style={{ justifyContent: "flex-start" }}
                >
                  {language === "en" ? "Save" : "Хадгалах"}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: "120px" }}
                  onClick={() => handleCite(result)}
                  startIcon={<ContentCopyIcon />}
                  style={{ justifyContent: "flex-start" }}
                  disabled={result.category === "Сэтгүүл"} // Disable button for "Сэтгүүл" category
                >
                  {language === "en" ? "Cite" : "Эшлэх"}
                </Button>
              </Box>
            </Card>
          ))}

          {/* Pagination Component */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredDocuments.length / resultsPerPage)} // Total pages
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </ul>
      ) : (
        !loading && (
          <font size="6" face="Times New Roman">
            {language === "en" ? (
              <p>Noscere, Lucere, Impartire</p>
            ) : (
              <p>Судал, Бүтээ, Түгээ</p>
            )}
          </font>
        )
      )}

      <Dialog
        open={citationDialogOpen}
        onClose={() => setCitationDialogOpen(false)}
      >
        <DialogTitle>Эшлэл</DialogTitle>
        <DialogContent dividers>
          <Typography
            id="citation-text"
            component="span"
            dangerouslySetInnerHTML={{ __html: citationText }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCopyCitation}
            startIcon={<ContentCopyIcon />}
            variant="contained"
          >
            Хуулах
          </Button>
          <Button onClick={() => setCitationDialogOpen(false)}>Хаах</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MainContent;
