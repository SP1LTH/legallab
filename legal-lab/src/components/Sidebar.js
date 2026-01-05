// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState, useEffect } from "react";
import axios from "../services/api";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Divider,
  TextField,
  useMediaQuery,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { useTheme } from "@mui/material/styles";
import { useLanguage } from "../context/LanguageContext";

function Sidebar({
  onCategoryClick,
  onSectorClick,
  onSearchWithinResults,
  searchTerm,
  filterCategories,
  onCategoryFilterChange,
  onYearFilter, // Add this prop to handle year filtering
}) {
  const [expanded, setExpanded] = useState("panel1");
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [yearFilterApplied, setYearFilterApplied] = useState(false); // Define yearFilterApplied state
  const [yearRange, setYearRange] = useState(""); // Define yearRange state
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleSearchToggle = () => setSearchExpanded(!searchExpanded);
  const { language } = useLanguage();

  const handleCategoriesToggle = () =>
    setCategoriesExpanded(!categoriesExpanded);

  const handleSearchWithinResults = (event) => {
    if (event.key === "Enter" || event.type === "click") {
      onSearchWithinResults(searchQuery);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const fetchCategoriesAndSectors = async () => {
      try {
        const categoriesResponse = await axios.get("/api/categories");
        const sectorsResponse = await axios.get("/api/sectors");
        setCategories(categoriesResponse.data);
        setSectors(sectorsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCategoriesAndSectors();
  }, []);

  const isCategoryExpanded = (name) => expandedCategories.includes(name);
  const toggleExpandCategory = (name) => {
    setExpandedCategories((prevExpanded) =>
      isCategoryExpanded(name)
        ? prevExpanded.filter((n) => n !== name)
        : [...prevExpanded, name]
    );
  };

  const handleCheckboxChange = (category) => {
    setCheckedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );

    // Notify parent component about the change
    onCategoryFilterChange(category);
  };

  const renderSubcategories = (subcategories) => {
    return (
      <List sx={{ pl: 4 }}>
        {subcategories.map((subcategory) => (
          <ListItem
            key={subcategory._id}
            button
            onClick={() => onCategoryClick(subcategory.name)}
            sx={{
              fontSize: "12px",
              cursor: "pointer",
              pl: 2,
              userSelect: "none",
            }}
          >
            <ListItemText
              primary={subcategory.name}
              primaryTypographyProps={{
                fontSize: "12px",
                fontWeight: "400",
              }}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Box
      sx={{
        padding: "10px",
        height: "80vh",
        overflowY: "auto",
        width: isSmallScreen ? "100%" : "250px", // Responsive width
        borderRight: isSmallScreen ? "none" : "1px solid #ddd",
      }}
    >
      {/* Dynamically change the title based on the searchTerm */}
      <h3>
        {searchTerm
          ? language === "en"
            ? "Advanced Search"
            : "Дэлгэрэнгүй хайлт"
          : language === "en"
          ? "Documents"
          : "Бүтээлүүд"}
      </h3>

      {/* Conditionally render content */}
      {searchTerm ? (
        <>
          {/* Render only the search functionality when searchTerm is not empty */}
          {/* Search within results Accordion */}
          <Accordion
            variant="outlined"
            expanded={searchExpanded}
            onChange={handleSearchToggle}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {language === "en"
                  ? "Search Within Results"
                  : "Үр дүнгээс хайх"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchWithinResults}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <SearchIcon
                      onClick={handleSearchWithinResults}
                      style={{ cursor: "pointer" }}
                    />
                  ),
                }}
              />
            </AccordionDetails>
          </Accordion>

          {/* Холбогдох ангиллууд */}
          <Accordion
            variant="outlined"
            expanded={categoriesExpanded}
            onChange={handleCategoriesToggle}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {language === "en" ? "Content Type" : "Холбогдох ангиллууд"}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {Object.entries(filterCategories).map(
                  ([category, count], index) => (
                    <React.Fragment key={category}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkedCategories.includes(category)}
                            onChange={() => handleCheckboxChange(category)}
                          />
                        }
                        label={`${category} (${count})`}
                        sx={{
                          userSelect: "none",
                        }}
                      />
                      {index < Object.entries(filterCategories).length - 1 && (
                        <Divider sx={{ my: 1 }} />
                      )}
                    </React.Fragment>
                  )
                )}
              </List>
            </AccordionDetails>
          </Accordion>
          {/* Он */}
          {/* Year Filter Accordion */}
          <Accordion variant="outlined" sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Хэвлэгдсэн огноо</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Жишээ: 2020-2025"
                  type="text"
                  size="small"
                  variant="outlined"
                  value={yearRange}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Allow only numbers and a single dash in the format "YYYY-YYYY"
                    if (/^\d{0,4}-?\d{0,4}$/.test(value)) {
                      setYearRange(value);
                    }
                  }}
                  sx={{ width: "100%" }}
                  placeholder="2020-2025"
                />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {yearFilterApplied && (
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => {
                        setYearRange("");
                        setYearFilterApplied(false);
                      }}
                    >
                      Арилгах
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!yearRange || !/^\d{4}-\d{4}$/.test(yearRange)}
                    onClick={() => {
                      if (yearRange) {
                        const isValidFormat = /^\d{4}-\d{4}$/.test(yearRange);
                        if (isValidFormat) {
                          setYearFilterApplied(true);
                          onYearFilter({ range: yearRange }); // Pass the yearRange as "range"
                        }
                      }
                    }}
                  >
                    Хадгалах
                  </Button>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </>
      ) : (
        <>
          {/* Render "Бүтээлийн төрөл" and "Салбар эрх зүй" when searchTerm is empty */}
          <Accordion
            variant="outlined"
            expanded={expanded === "panel1"}
            onChange={(event, isExpanded) =>
              setExpanded(isExpanded ? "panel1" : false)
            }
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Бүтээлийн төрөл</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List
                sx={{
                  userSelect: "none",
                }}
              >
                {categories.map((category) => (
                  <React.Fragment key={category._id}>
                    <ListItem
                      button
                      onClick={() => {
                        onCategoryClick(category.name);
                        toggleExpandCategory(category.name);
                      }}
                      sx={{
                        fontSize: "12px",
                        cursor: "pointer",
                        pl: 2,
                        userSelect: "none",
                      }}
                    >
                      <ListItemText
                        primary={category.name}
                        primaryTypographyProps={{
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      />
                      {category.subcategories &&
                        category.subcategories.length > 0 && (
                          <ExpandMoreIcon
                            sx={{
                              transform: isCategoryExpanded(category.name)
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.3s ease",
                            }}
                          />
                        )}
                    </ListItem>
                    {category.subcategories &&
                      isCategoryExpanded(category.name) &&
                      renderSubcategories(category.subcategories)}
                    <Divider sx={{ my: 1 }} />
                  </React.Fragment>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Sectors Accordion */}
          <Accordion
            variant="outlined"
            expanded={expanded === "panel2"}
            onChange={(event, isExpanded) =>
              setExpanded(isExpanded ? "panel2" : false)
            }
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Салбар эрх зүй</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List
                sx={{
                  userSelect: "none",
                }}
              >
                {sectors.map((sector) => (
                  <Box key={sector._id}>
                    <ListItem
                      button
                      onClick={() => onSectorClick(sector.name)}
                      sx={{
                        fontSize: "12px",
                        cursor: "pointer",
                        pl: 2,
                        userSelect: "none",
                      }}
                    >
                      <ListItemText
                        primary={sector.name}
                        primaryTypographyProps={{
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      />
                    </ListItem>
                    <Divider sx={{ my: 1 }} />
                  </Box>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Box>
  );
}

export default Sidebar;
