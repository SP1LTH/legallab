// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import RightSidebar from "./RightSidebar";
import SearchBar from "./SearchBar";
import { Box, Grid, Divider } from "@mui/material";
import "../styles/HomePage.css";

const HomePage = ({ isDarkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategories, setFilterCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [yearFilter, setYearFilter] = useState(null); // State to store year filter

  const onCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const onSectorClick = (sector) => {
    setSelectedSector(sector);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSearchWithinResults = (subTerm) => {
    const formattedSubTerm = `(${subTerm})`;
    const newSearchTerm = searchTerm
      ? `${searchTerm} БАС ${formattedSubTerm}`
      : formattedSubTerm;

    console.log("New Combined Search Term:", newSearchTerm);
    setSearchTerm(newSearchTerm);
  };

  const handleCategoryFilterChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const onYearFilter = ({ range }) => {
    setYearFilter({ range });
    // console.log("Year Filter Applied:", { range });
  };

  return (
    <Box sx={{ padding: { xs: "10px", md: "20px" } }}>
      <SearchBar handleSearch={handleSearch} searchTerm={searchTerm} isDarkMode={isDarkMode} />
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Sidebar
            onCategoryClick={onCategoryClick}
            onSectorClick={onSectorClick}
            onSearchWithinResults={handleSearchWithinResults}
            searchTerm={searchTerm}
            filterCategories={filterCategories}
            onCategoryFilterChange={handleCategoryFilterChange}
            onYearFilter={onYearFilter} // Pass the onYearFilter function to Sidebar
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MainContent
            selectedCategory={selectedCategory}
            selectedSector={selectedSector}
            searchTerm={searchTerm}
            onFilterCategories={setFilterCategories}
            selectedCategories={selectedCategories}
            yearFilter={yearFilter} // Pass the year filter to MainContent if needed
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <RightSidebar />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
