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
  TextField,
  IconButton,
  Button,
  Pagination,
  Box,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";
import { useLanguage } from "../context/LanguageContext";

const DictionaryEdit = () => {
  const [data, setData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/dictionary");
        setData(response.data.terms);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = (row) => {
    setEditingRow(row._id);
    setEditedRow({ ...row });
  };

  const handleInputChange = (field, value) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`/admin/dictionary/${editingRow}`, editedRow, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData((prevData) =>
        prevData.map((row) => (row._id === editingRow ? editedRow : row))
      );
      setEditingRow(null);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Та устгахдаа итгэлтэй байна уу?")) {
      try {
        await axios.delete(`/admin/dictionary/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setData((prevData) => prevData.filter((row) => row._id !== id));
      } catch (error) {
        console.error("Error deleting term:", error);
      }
    }
  };

  const filteredData = data.filter((row) =>
    row.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleAddTerm = () => {
    navigate("/dictionary-create");
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {language === "en" ? "Edit Dictionary" : "Нэр томьёо засах"}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddTerm}
        sx={{ mb: 2 }}
      >
        {language === "en" ? "Add Term" : "Нэр томьёо нэмэх"}
      </Button>
      <TextField
        variant="outlined"
        size="small"
        fullWidth
        placeholder={language === "en" ? "Search terms..." : "Нэр томьёо хайх..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>{language === "en" ? "Terminology" : "Нэр томьёо"}</TableCell>
              <TableCell>{language === "en" ? "Description" : "Тайлбар"}</TableCell>
              <TableCell>{language === "en" ? "Source" : "Эх сурвалж"}</TableCell>
              <TableCell>{language === "en" ? "Russian" : "Орос"}</TableCell>
              <TableCell>{language === "en" ? "English" : "Англи"}</TableCell>
              <TableCell>{language === "en" ? "Latin" : "Латин"}</TableCell>
              <TableCell>{language === "en" ? "German" : "Герман"}</TableCell>
              <TableCell>{language === "en" ? "Actions" : "Үйлдлүүд"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={row._id}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                {editingRow === row._id ? (
                  <>
                    <TableCell>
                      <TextField
                        value={editedRow.term}
                        onChange={(e) => handleInputChange("term", e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editedRow.explanation}
                        onChange={(e) =>
                          handleInputChange("explanation", e.target.value)
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editedRow.extra}
                        onChange={(e) => handleInputChange("extra", e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editedRow.ru}
                        onChange={(e) => handleInputChange("ru", e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editedRow.en}
                        onChange={(e) => handleInputChange("en", e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editedRow.la}
                        onChange={(e) => handleInputChange("la", e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editedRow.de}
                        onChange={(e) => handleInputChange("de", e.target.value)}
                        fullWidth
                      />
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{row.term}</TableCell>
                    <TableCell>{row.explanation}</TableCell>
                    <TableCell>{row.extra}</TableCell>
                    <TableCell>{row.ru}</TableCell>
                    <TableCell>{row.en}</TableCell>
                    <TableCell>{row.la}</TableCell>
                    <TableCell>{row.de}</TableCell>
                  </>
                )}
                <TableCell>
                  {editingRow === row._id ? (
                    <IconButton color="primary" onClick={handleSave}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(row)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(row._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(filteredData.length / rowsPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default DictionaryEdit;
