// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import axios from '../services/api';
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { useLanguage } from "../context/LanguageContext";

const cyrillicAlphabet = [
  "А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "К", "Л", "М", "Н", "О",
  "Ө", "П", "Р", "С", "Т", "У", "Ү", "Ф", "Х", "Ц", "Ч", "Ш", "Э", "Ю", "Я",
];

const latinAlphabet = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
  "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];

// const mockData = [
//   { term: "БАРАА БҮТЭЭГДЭХҮҮН", explanation: "Explanation 1", extra: "", ru: "", en: "PRODUCT" },
//   { term: "ТЭЭШ", explanation: "ачаа тээш", extra: "", ru: "", en: "LUGGAGE" },
//   { term: "ТЭЭШ 2", explanation: "гар тээш", extra: "", ru: "", en: "LUGGAGE" },
//   // Add more data as needed
// ];

const Dictionary = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchExplanation, setSearchExplanation] = useState("");
  const [searchExtra, setSearchExtra] = useState("");
  const [searchRu, setSearchRu] = useState("");
  const [searchEn, setSearchEn] = useState("");
  const [searchLa, setSearchLa] = useState("");
  const [searchDe, setSearchDe] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const { language } = useLanguage();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/dictionary");
        console.log(response.data.terms); // Inspect the structure
        setData(response.data.terms || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]); // Fallback to an empty array
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (letter) => setFilter(letter);

  // Filter data by alphabet and search
  const filteredData = data
    .filter((item) => item.term.toLowerCase().startsWith(filter.toLowerCase()) 
                      || item.en.toLowerCase().startsWith(filter.toLowerCase()))
    .filter((item) => item.term.toLowerCase().includes(searchTerm.toLowerCase())
      && item.explanation.toLowerCase().includes(searchExplanation.toLowerCase()) 
      && item.extra.toLowerCase().includes(searchExtra.toLowerCase()) 
      && item.ru.toLowerCase().includes(searchRu.toLowerCase()) 
      && item.en.toLowerCase().includes(searchEn.toLowerCase())
      && item.la.toLowerCase().includes(searchLa.toLowerCase())
      && item.de.toLowerCase().includes(searchDe.toLowerCase())
    );

  // Pagination
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const renderSearchField = (value, onChange, placeholder) => (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => onChange({ target: { value: "" } })}
            >
              {value ? <ClearIcon /> : <SearchIcon />}
            </IconButton>
          </InputAdornment>
        )
      }}
      sx={{ mt: 1 }}
    />
  );

  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <h1>{language === "en" ? "Legal Terms" : "Хууль зүйн нэр томьёо"}</h1>
      {/* Cyrillic Alphabet Navigation */}
      <Typography variant="h6">{language === "en" ? "In Cyrillic" : "Кирилл үсгээр"}</Typography>
      <Box sx={{ display: "flex", justifyContent: 'center', gap: 1, mb: 2, flexWrap: "wrap" }}>
        {cyrillicAlphabet.map((letter) => (
          <Typography
            key={letter}
            sx={{ cursor: 'pointer', textDecoration: filter === letter ? 'underline' : 'none' }}
            onClick={() => handleFilterChange(letter)}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = filter === letter ? 'underline' : 'none'}
          >
            {letter}
          </Typography>
        ))}
      </Box>

      {/* Latin Alphabet Navigation */}
      <Typography variant="h6">{language === "en" ? "In Latin letters" : "Латин үсгээр"}</Typography>
      <Box sx={{ display: "flex", justifyContent: 'center', gap: 1, mb: 2, flexWrap: "wrap" }}>
        {latinAlphabet.map((letter) => (
          <Typography
            key={letter}
            sx={{ cursor: 'pointer', textDecoration: filter === letter ? 'underline' : 'none' }}
            onClick={() => handleFilterChange(letter)}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = filter === letter ? 'underline' : 'none'}
          >
            {letter}
          </Typography>
        ))}
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>
                {language === "en" ? "Terminology" : "Нэр томьёо"}
                {renderSearchField(searchTerm, (e) => setSearchTerm(e.target.value), (language === "en" ? "Search..." : "Хайх..."))}
              </TableCell>
              <TableCell>
                {language === "en" ? "Description" : "Тайлбар"}
                {renderSearchField(searchExplanation, (e) => setSearchExplanation(e.target.value), (language === "en" ? "Search..." : "Хайх..."))}
              </TableCell>
              <TableCell>
                {language === "en" ? "Source" : "Эх сурвалж"}
                {renderSearchField(searchExtra, (e) => setSearchExtra(e.target.value), (language === "en" ? "Search..." : "Хайх..."))}
              </TableCell>
              <TableCell>
                {language === "en" ? "Russian" : "Орос"}
                {renderSearchField(searchRu, (e) => setSearchRu(e.target.value), (language === "en" ? "Search..." : "Хайх..."))}
              </TableCell>
              <TableCell>
                {language === "en" ? "English" : "Англи"}
                {renderSearchField(searchEn, (e) => setSearchEn(e.target.value), (language === "en" ? "Search..." : "Хайх..."))}
              </TableCell>
              <TableCell>
                {language === "la" ? "Latin" : "Латин"}
                {renderSearchField(searchLa, (e) => setSearchLa(e.target.value), (language === "la" ? "Search..." : "Хайх..."))}
              </TableCell>
              <TableCell>
                {language === "de" ? "German" : "Герман"}
                {renderSearchField(searchDe, (e) => setSearchDe(e.target.value), (language === "de" ? "Search..." : "Хайх..."))}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>{row.term}</TableCell>
                <TableCell>{row.explanation}</TableCell>
                <TableCell>{row.extra}</TableCell>
                <TableCell>{row.ru}</TableCell>
                <TableCell>{row.en}</TableCell>
                <TableCell>{row.la}</TableCell>
                <TableCell>{row.de}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(filteredData.length / rowsPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default Dictionary;
