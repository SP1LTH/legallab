// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
  Box,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  LinearProgress,
Popper,
} from "@mui/material";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import { useAuth } from "../context/AuthContext";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const AddDocument = ({ isDarkMode }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    author: "",
    category: "",
    sector: [], // Initialize sector as an empty array
    summary: "",
    keywords: "",
    publicationDate: "",
    pageCount: "",
    language: "",
    references: "",
    magazineNameNumber: "",
    rejectComment: "",
    journalArticles: []
  });

  const [isPublishedInMagazine, setIsPublishedInMagazine] = useState(false);
  const [file, setFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null); // Cover image state
  const [categories, setCategories] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [citation, setCitation] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [uploadProgress, setUploadProgress] = useState(0); // Upload progress state
  const [formSector, setFormSector] = useState([]); // Separate state for form sector

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get("/api/categories");
        const sectorsResponse = await axios.get("/api/sectors");

        if (user.role !== "journal") {
          // Filter out "Сэтгүүл" from categoriesResponse.data
          categoriesResponse.data = categoriesResponse.data.filter(
              (category) => category.name !== "Сэтгүүл"
          );
        }

        setCategories(categoriesResponse.data);
        setSectors(sectorsResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Load saved form data from localStorage on component mount
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      console.log("Loaded form data from localStorage:", savedFormData); // Debugging log
      setFormData(JSON.parse(savedFormData));
    }
    console.log("Initial form data:", formData); // Debugging log
  }, []);

  useEffect(() => {
    // Save form data to localStorage whenever it changes
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    // Load saved rows from localStorage on component mount
    const savedRows = localStorage.getItem("rows");
    if (savedRows) {
      console.log("Loaded rows from localStorage:", savedRows); // Debugging log
      setRows(JSON.parse(savedRows));
    }
  }, []);

  const generateCitation = (
    author,
    publicationDate,
    title,
    category,
    magazineNameNumber
  ) => {
    const titleItalic = `<i>${title}</i>`;
    if (category === "Ном") {
      return [
        `${author}, `,
        `<i>${title}</i> `,
        `(Уб, ${publicationDate}), `,
        `...дахь тал`,
      ];
    } else if (category === "Сэтгүүл") {
      return [
        `${author}, `,
        `"${title}", `,
        `<i>${magazineNameNumber}</i> `,
        `(Уб, ${publicationDate}): `,
        `...дахь тал`,
      ];
    } else if (category === "Хууль зүйн орчуулга") {
      return [
        author,
        `(Уб, ${publicationDate}). `,
        titleItalic,
        " (Орчуулга). Улаанбаатар: Publisher.",
      ];
    } else {
      return [
        `<i>${title}</i>, `,
        `${author}, `,
        `<i>${magazineNameNumber}</i> `,
        `(Уб, ${publicationDate}): `,
        `...дахь тал`,
      ];
    }
    return [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: name === "sector" ? value.split(",") : value, // Handle sector as an array
      ...(name === "title" && value === "Эрх зүй" && { author: "Монгол улсын их сургууль, Хууль зүйн сургууль" }),
      ...(name === "title" && value === "Хууль дээдлэх ёс" && { author: "Хууль зүйн үндэсний хүрээлэн" }),
      ...(name === "title" && value === "Шихихутуг" && { author: "Шихихутуг их сургууль" }),
      ...(name === "title" && value === "Монголын төр, эрх зүй" && { author: "Улсын дээд шүүх, Шүүхийн сургалт, судалгаа, мэдээллийн хүрээлэн" }),
      ...(name === "title" && value === "Law in action" && { author: "OT нөхөрлөл" }),
      ...(name === "title" && value === "Сонгуулийн боловсрол" && { author: "Монгол Улсын Сонгуулийн ерөнхий хороо" }),
      ...(name === "title" && value === "Шүүх эрх мэдэл" && { author: "Шүүхийн ерөнхий зөвлөл" }),
      ...(name === "title" && value === "Хүний эрх" && { author: "Хүний эрхийн Үндэсний комисс" }),
      ...(name === "title" && value === "Шударга ёс" && { author: "Авилгатай тэмцэх газар" }),
      ...(name === "title" && value === "Шүүхийн шийдвэрийн судалгаа" && { author: "Нээлттэй нийгэм форум" }),
    }));

    const { author, publicationDate, title, category, magazineNameNumber } = {
      ...formData,
      [name]: value,
      ...(name === "title" && value === "Эрх зүй" && { author: "Монгол улсын их сургууль, Хууль зүйн сургууль" }),
      ...(name === "title" && value === "Хууль дээдлэх ёс" && { author: "Хууль зүйн үндэсний хүрээлэн" }),
      ...(name === "title" && value === "Шихихутуг" && { author: "Шихихутуг их сургууль" }),
      ...(name === "title" && value === "Монголын төр, эрх зүй" && { author: "Улсын дээд шүүх, Шүүхийн сургалт, судалгаа, мэдээллийн хүрээлэн" }),
      ...(name === "title" && value === "Law in action" && { author: "OT нөхөрлөл" }),
      ...(name === "title" && value === "Сонгуулийн боловсрол" && { author: "Монгол Улсын Сонгуулийн ерөнхий хороо" }),
      ...(name === "title" && value === "Шүүх эрх мэдэл" && { author: "Шүүхийн ерөнхий зөвлөл" }),
      ...(name === "title" && value === "Хүний эрх" && { author: "Хүний эрхийн Үндэсний комисс" }),
      ...(name === "title" && value === "Шударга ёс" && { author: "Авилгатай тэмцэх газар" }),
      ...(name === "title" && value === "Шүүхийн шийдвэрийн судалгаа" && { author: "Нээлттэй нийгэм форум" }),
    };
    const newCitation = generateCitation(
      author,
      publicationDate,
      title,
      category,
      magazineNameNumber
    );
    setCitation(newCitation);
    setFormData((prevFormData) => ({
      ...prevFormData,
      references: newCitation.join(" "),
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Form Data before validation:", formData); // Debugging log
    for (const key in formData) {
      if (!formData[key]
        && key !== "magazineNameNumber"
        && key !== "rejectComment"
        && key !== "journalArticles"
        && key !== "summary"
        && key !== "keywords"
        && key !== "sector") {
        setError("Бүх талбарыг бөглөнө үү.");
        return;
      }
    }

    // If checkbox is checked, validate magazineNameNumber
    if (isPublishedInMagazine && formData.magazineNameNumber === "") {
      setError("Сэтгүүлийн нэр, дугаарыг оруулна уу.");
      return;
    }

    if (!file) {
      setError("PDF файл оруулах шаардлагатай.");
      return;
    }

    // Transform sector field for saving
    const transformedFormData = {
      ...formData,
      sector: formData.sector.map((s) => s.name), // Extract the names of selected sectors
      journalArticles: ["Сэтгүүл", "Эмхэтгэл"].includes(formData.category) ? rows : [], // Include journalArticles only for Сэтгүүл or Эмхэтгэл
    };

    console.log("Transformed Form Data:", transformedFormData); // Debugging log

      const formDataToSend = new FormData();
      for (const key in transformedFormData) {
        if (key === "journalArticles") {
          transformedFormData[key].forEach((author, index) => {
            formDataToSend.append(`journalArticles[${index}][category]`, author.category);
            formDataToSend.append(`journalArticles[${index}][name]`, author.name);
            formDataToSend.append(`journalArticles[${index}][title]`, author.title);
            formDataToSend.append(`journalArticles[${index}][pageRange]`, author.pageRange);
            (author.sector || []).forEach((sector, sectorIndex) => {
              formDataToSend.append(`journalArticles[${index}][sector][${sectorIndex}]`, sector.name);
            });
          });
        } else {
        formDataToSend.append(key, transformedFormData[key]);
      }
      }
      formDataToSend.append("file", file);
      formDataToSend.append("coverImage", coverImage); // Append cover image

      try {
        setLoading(true);

        console.log("Form Data to Send:", formDataToSend); // Debugging log
        await axios.post("/api/documents/add", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      // Check if a journal with the same title already exists
      const existingJournalResponse = await axios.get(`/api/journals?title=${formData.title}`);
      if (existingJournalResponse.data.exists) {
        setSnackbarOpen(true); // Open Snackbar on success
        localStorage.removeItem("formData");
        localStorage.removeItem("rows");
        setTimeout(() => navigate(`/my-documents`), 2000); // Navigate to My Documents
      } else {
        setSnackbarOpen(true); // Open Snackbar on success
        localStorage.removeItem("formData");
        localStorage.removeItem("rows");
        setTimeout(() => navigate(`/my-documents/`), 2000); // Navigate to Edit Journal
      }
    } catch (err) {
      setError(err.response?.data?.message || "Бүтээл оруулахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Function to flatten sectors with nested subsectors
  const flattenSectors = (sectors) => {
    const flattened = [];
    let idCounter = 0; // Add a unique id generator
  
    const traverse = (items, level = 0) => {
      items.forEach((item) => {
        const id = idCounter++; // Assign a unique id
        flattened.push({ id, name: item.name, level }); // Add the sector with its id and level
        if (item.subsectors) {
          if (Array.isArray(item.subsectors)) {
            traverse(
              item.subsectors.map((sub) =>
                typeof sub === "string" ? { name: sub } : sub
              ),
              level + 1
            );
          }
        }
      });
    };
  
    traverse(sectors);
    return flattened;
  };

  const flattenedSectors = flattenSectors(sectors);

  const [rows, setRows] = useState([
    { category: "Эрдэм шинжилгээний өгүүлэл", sector: "", name: "", title: "", pageRange: "", isSelected: false },
    { category: "Эрдэм шинжилгээний өгүүлэл", sector: "", name: "", title: "", pageRange: "", isSelected: false },
    { category: "Эрдэм шинжилгээний өгүүлэл", sector: "", name: "", title: "", pageRange: "", isSelected: false },
  ]);

  const handleInputChange = (index, field, value) => {
    console.log(`Updating row ${index}, field: ${field}, value: ${value}`);
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[index][field] = value;
      return updatedRows;
    });
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        category: formData.category === "Сэтгүүл" ? "Эрдэм шинжилгээний өгүүлэл" : "Судалгааны тайлан",
        sector: "",
        name: "",
        title: "",
        pageRange: "",
        isSelected: false,
      },
    ]);
  };

  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleSectorChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      sector: newValue || [],
    }));
  };

  const handleFormSectorChange = (event, newValue) => {
    setFormSector(newValue || []);
    setFormData((prev) => ({
      ...prev,
      sector: newValue || [], // Ensure sector is always an array
    }));
  };

  useEffect(() => {
    // Save rows to localStorage whenever it changes
    localStorage.setItem("rows", JSON.stringify(rows));
  }, [rows]);

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5, backgroundColor: isDarkMode ? "#333" : "#f9f9f9", padding: 4, borderRadius: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Бүтээл оруулах
      </Typography>
      <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal" required>
          <InputLabel id="category-label">Бүтээлийн төрөл</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            label="Бүтээлийн төрөл"
          >
            {categories.flatMap((category) => [
              <MenuItem key={category._id} value={category.name}>
                {category.name}
              </MenuItem>,
              ...(category.subcategories || []).map((sub) => (
                <MenuItem key={sub._id} value={sub.name} sx={{ pl: 4 }}>
                  └ {sub.name}
                </MenuItem>
              )),
            ])}
          </Select>
        </FormControl>
        {formData.category === "Сэтгүүл" ? (
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="journal-title-label">Сэтгүүлийн нэр</InputLabel>
            <Select
              labelId="journal-title-label"
              id="journal-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              label="Сэтгүүлийн нэр"
            >
              <MenuItem value="Эрх зүй">Эрх зүй</MenuItem>
              <MenuItem value="Хууль дээдлэх ёс">Хууль дээдлэх ёс</MenuItem>
              <MenuItem value="Шихихутуг">Шихихутуг</MenuItem>
              <MenuItem value="Монголын төр, эрх зүй">Монголын төр, эрх зүй</MenuItem>
              <MenuItem value="Law in action">Law in action</MenuItem>
              <MenuItem value="Сонгуулийн боловсрол">Сонгуулийн боловсрол</MenuItem>
              <MenuItem value="Шүүх эрх мэдэл">Шүүх эрх мэдэл</MenuItem>
              <MenuItem value="Хүний эрх">Хүний эрх</MenuItem>
              <MenuItem value="Шударга ёс">Шударга ёс</MenuItem>
              <MenuItem value="Шүүхийн шийдвэрийн судалгаа">Шүүхийн шийдвэрийн судалгаа</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <TextField
            label="Бүтээлийн нэр"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        )}
        {formData.category === "Эмхэтгэл" && (
          <TextField
            label="Дэд гарчиг"
            name="subtitle"
            value={formData.subtitle || ""} // Ensure subtitle is handled in formData
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        )}
        {["Сэтгүүл", "Эмхэтгэл"].includes(formData.category) && (
          <Box display="flex" alignItems="center" gap={2}>
            {["Эрх зүй", "Шүүхийн шийдвэрийн судалгаа", "Монголын төр, эрх зүй", "Шударга ёс", "Хууль дээдлэх ёс"].includes(formData.title) || formData.category === "Эмхэтгэл" ? (
              <TextField
                label={formData.category === "Эмхэтгэл" ? "Боть" : "Сэтгүүлийн цуврал"}
                name="journalSeries"
                type="number"
                value={formData.journalSeries}
                onChange={handleChange}
                onWheel={(e) => e.target.blur()}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            ) : null}
            {formData.category !== "Эмхэтгэл" && ["Эрх зүй", "Шихихутуг", "Монголын төр, эрх зүй", "Law in action",
            "Сонгуулийн боловсрол", "Шүүх эрх мэдэл", "Хүний эрх", "Шударга ёс",
            "Хууль дээдлэх ёс"].includes(formData.title) && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="journal-number-label">Сэтгүүлийн дугаар</InputLabel>
                <Select
                  labelId="journal-number-label"
                  name="journalNumber"
                  value={formData.journalNumber || ""}
                  onChange={handleChange}
                  label="Сэтгүүлийн дугаар"
                >
                  {[1, 2, 3, 4, 5].map((number) => (
                    <MenuItem key={number} value={number}>
                      {number}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        )}
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            label="Зохиогч"
            placeholder="Жишээ: Г.Алтангэрэл"
            name="author"
            value={formData.author}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Tooltip title="Хулганаа гарчиг дээр аваачихад бүтэн текст харагдана">
            <HelpOutlineIcon color="action" />
          </Tooltip>
        </Box>
        {[
          "Сэтгүүл",
          "Эмхэтгэл"
        ].includes(formData.category) && (
          <Box>
            {rows.map((row, index) => (
              <Box
                key={index}
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems="center"
                gap={2}
                marginBottom={2}
              >
                {/* Төрөл Select */}
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel id={`type-label-${index}`}>Төрөл</InputLabel>
                  <Select
                    labelId={`type-label-${index}`}
                    id={`type-${index}`}
                    name="type"
                    value={row.category || (formData.category === "Сэтгүүл" ? "Эрдэм шинжилгээний өгүүлэл" : "Судалгааны тайлан")}
                    onChange={(e) => handleInputChange(index, "category", e.target.value)} // Update the correct row
                    label="Төрөл"
                  >
                    {formData.category === "Сэтгүүл" ? (
                      [
                        <MenuItem key="Эрдэм шинжилгээний өгүүлэл" value="Эрдэм шинжилгээний өгүүлэл">
                          Эрдэм шинжилгээний өгүүлэл
                        </MenuItem>,
                        <MenuItem key="Шүүхийн шийдвэрийн дүн шинжилгээ" value="Шүүхийн шийдвэрийн дүн шинжилгээ">
                          Шүүхийн шийдвэрийн дүн шинжилгээ
                        </MenuItem>,
                        <MenuItem key="Судалгааны тойм, үр дүн" value="Судалгааны тойм, үр дүн">
                          Судалгааны тойм, үр дүн
                        </MenuItem>,
                        <MenuItem key="Шинжлэх ухааны тайлбар" value="Шинжлэх ухааны тайлбар">
                          Шинжлэх ухааны тайлбар
                        </MenuItem>,
                        <MenuItem key="Хууль зүйн орчуулга" value="Хууль зүйн орчуулга">
                          Хууль зүйн орчуулга
                        </MenuItem>,
                      ]
                    ) : (
                      [
                        <MenuItem key="Судалгааны тайлан" value="Судалгааны тайлан">
                          Судалгааны тайлан
                        </MenuItem>,
                        <MenuItem key="Судалгааны тойм, үр дүн" value="Судалгааны тойм, үр дүн">
                          Судалгааны тойм, үр дүн
                        </MenuItem>,
                      ]
                    )}
                  </Select>
                </FormControl>

                {/* Салбар эрх зүй Autocomplete */}
                <Autocomplete
                  sx={{ minWidth: 200 }}
                  multiple // Enable multiple selection
                  options={flattenedSectors} // Use your flattenedSectors array
                  getOptionLabel={(option) => option.name || ""}
                  value={row.sector || []} // Ensure this is always an array
                  onChange={(event, newValue) => handleInputChange(index, "sector", newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Салбар эрх зүй"
                      placeholder="Салбар эрх зүй сонгох"
                    />
                  )}
                  renderOption={(props, option) => {
                    const isSelected = (row.sector || []).some(
                      (selected) => selected.name === option.name
                    ); // Safeguard against null/undefined
                    return (
                      <MenuItem
                        {...props}
                        key={option.id || option.name} // Use unique key
                        sx={{ pl: option.level * 2, justifyContent: "space-between" }}
                      >
                        {option.name}
                        {isSelected && <CheckIcon color="info" />}
                      </MenuItem>
                    );
                  }}
                  PopperComponent={(props) => (
                    <Popper {...props} style={{ width: "fit-content" }} placement="bottom-start" />
                  )}
                />
                
                {/* Зохиогч Input */}
                <Box display="flex" alignItems="center" gap={1}>
                  <TextField
                    label="Зохиогч"
                    name="name"
                    value={row.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                    InputProps={{
                      style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
                      title: row.name
                    }}
                  />
                  <Tooltip title="Хулганаа гарчиг дээр аваачихад бүтэн текст харагдана">
                    <HelpOutlineIcon color="action" />
                  </Tooltip>
                </Box>

                {/* Бүтээл Input */}
                <Box display="flex" alignItems="center" gap={1}>
                  <TextField
                    label="Гарчиг"
                    name="title"
                    value={row.title}
                    onChange={(e) => handleInputChange(index, "title", e.target.value)}
                    InputProps={{
                      style: {
                        whiteSpace: "normal", // Allow text to wrap
                        overflow: "visible", // Ensure text is not clipped
                        textOverflow: "ellipsis",
                      },
                      title: row.title, // Tooltip for full text
                    }}
                    multiline // Enable multiline for long text
                    rows={Math.min(10, Math.ceil(row.title.length / 50)) || 1} // Dynamically adjust rows based on text length
                    fullWidth // Ensure the TextField takes up the full width
                  />
                  <Tooltip title="Хулганаа гарчиг дээр аваачихад бүтэн текст харагдана">
                    <HelpOutlineIcon color="action" />
                  </Tooltip>
                </Box>

                {/* Хуудас Input */}
                <TextField
                  label="Хуудас"
                  placeholder="Жишээ: 10-15"
                  name="pageRange"
                  value={row.pageRange}
                  onChange={(e) =>
                    handleInputChange(index, "pageRange", e.target.value)
                  }
                />

                {/* Delete Row Button */}
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => deleteRow(index)}
                >
                  Устгах
                </Button>
              </Box>
            ))}

            {/* + Нэмэх Button */}
            <Button variant="contained" onClick={addRow}>
              + Нэмэх
            </Button>
          </Box>
        )}
        {[
          "Эрх зүйн шүүмж",
          "Эрдэм шинжилгээний илтгэл, өгүүлэл",
          "Хууль зүйн орчуулга",
        ].includes(formData.category) && (
          <Box display="flex" alignItems="center" gap={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPublishedInMagazine}
                  onChange={(e) => setIsPublishedInMagazine(e.target.checked)}
                />
              }
              label="Сэтгүүлд нийтлүүлсэн эсэх"
            />
            <TextField
              label="Сэтгүүл нэр, дугаар"
              name="magazineNameNumber"
              value={formData.magazineNameNumber}
              onChange={handleChange}
              fullWidth
              disabled={!isPublishedInMagazine}
            />
          </Box>
        )}
        <FormControl fullWidth margin="normal" required>
        {formData.category !== "Сэтгүүл" && ( // Hide Autocomplete when "Сэтгүүл" or "Эмхэтгэл" is selected
          <Autocomplete
            multiple
            options={flattenedSectors}
            getOptionLabel={(option) => option.name || ""}
            disableCloseOnSelect
            value={formSector} // Bind value to formSector
            onChange={handleFormSectorChange} // Use separate handler
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Салбар эрх зүй"
                placeholder="Салбар эрх зүй сонгох"
              />
            )}
            renderOption={(props, option) => {
              const isSelected = (formSector || []).some(
                (selected) => selected.id === option.id
              );
              return (
                <MenuItem
                  {...props}
                  key={option.id}
                  sx={{ pl: option.level * 2, justifyContent: "space-between" }}
                >
                  {option.name}
                  {isSelected && <CheckIcon color="info" />}
                </MenuItem>
              );
            }}          
          />
        )}
        </FormControl>
        {formData.category !== "Сэтгүүл" && (
          <TextField
            label="Бүтээлийн товч"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
        )}
        {formData.category !== "Сэтгүүл" && (
          <TextField
            label="Түлхүүр үг"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        )}
        <TextField
          label="Бүтээл бичсэн он"
          name="publicationDate"
          type="number"
          value={formData.publicationDate}
          onChange={handleChange}
          onWheel={(e) => e.target.blur()}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          onInput={(e) => {
            e.target.value = Math.max(0, parseInt(e.target.value))
              .toString()
              .slice(0, 4);
          }}
        />
        <TextField
          label="Хуудсын тоо"
          name="pageCount"
          type="number"
          value={formData.pageCount}
          onChange={handleChange}
          onWheel={(e) => e.target.blur()}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="language-label">Хэл</InputLabel>
          <Select
            labelId="language-label"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            label="Хэл"
          >
            <MenuItem value="Монгол">Монгол</MenuItem>
            <MenuItem value="Англи">Англи</MenuItem>
            <MenuItem value="Орос">Орос</MenuItem>
            <MenuItem value="Герман">Герман</MenuItem>
            <MenuItem value="Хятад">Хятад</MenuItem>
            <MenuItem value="Япон">Япон</MenuItem>
            <MenuItem value="Солонгос">Солонгос</MenuItem>
          </Select>
        </FormControl>
        {formData.category !== "Сэтгүүл" && formData.category !== "Эмхэтгэл" && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Бүтээлийн эшлэл
            </Typography>
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "16px",
                minHeight: "70px",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {citation.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  sx={
                    index === 2 ? { fontStyle: "italic" } : { fontStyle: "normal" }
                  }
                  dangerouslySetInnerHTML={{ __html: part }}
                />
              ))}
            </Box>
          </Box>
        )}
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Box>
            <input
              style={{ display: "none" }}
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
            />
            <label htmlFor="file-upload">
              <Button variant="contained" component="span">
                Файл сонгох
              </Button>
            </label>
            {file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {file.name}
              </Typography>
            )}
          </Box>
          {[
            "Сэтгүүл",
            "Эмхэтгэл"
          ].includes(formData.category) && (
            <Box>
              <input
                style={{ display: "none" }}
                id="cover-image-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                required
              />
              <label htmlFor="cover-image-upload">
                <Button variant="contained" component="span">
                  Нүүр зураг сонгох
                </Button>
              </label>
              {coverImage && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {coverImage.name}
                </Typography>
              )}
            </Box>
          )}
        </Box>
        {error && (
          <Typography color="error" align="center" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}
        {loading && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" color="textSecondary" align="center">
              {uploadProgress}%
            </Typography>
          </Box>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? "Хадгалж байна..." : "Хадгалах"}
        </Button>
      </form>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Бүтээл амжилттай нэмэгдлээ!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddDocument;
