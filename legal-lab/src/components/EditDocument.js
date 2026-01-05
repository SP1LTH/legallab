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
  Box,
  Tooltip,
  Autocomplete,
  Popper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../services/api";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckIcon from '@mui/icons-material/Check';

const EditDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    author: "",
    category: "",
    sector: [],
    summary: "",
    keywords: "",
    publicationDate: "",
    pageCount: "",
    language: "",
    references: "",
    journalName: "",
    journalSeries: "",
    journalNumber: "",
    pageRange: "",
  });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [citation, setCitation] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const [rows, setRows] = useState([]);
  const [formSector, setFormSector] = useState([]); // Separate state for form sector

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, sectorsRes, documentRes] = await Promise.all([
          axios.get("/api/categories"),
          axios.get("/api/sectors"),
          axios.get(`/api/documents/${id}`),
        ]);

        setCategories(categoriesRes.data);
        setSectors(sectorsRes.data);
        console.log("Document data:", documentRes.data); // Log the document data
        // Map the sector IDs in the document to the full sector objects
        const selectedSectors = documentRes.data.sector.map((sectorId) =>
          sectorsRes.data.find((sector) => sector._id === sectorId)
        );

        setFormData({
          ...documentRes.data,
          sector: selectedSectors.filter(Boolean), // Filter out any null values
        });

        if (["Сэтгүүл", "Эмхэтгэл"].includes(documentRes.data.category)) {
          setRows(documentRes.data.journalArticles || []);
        }
      } catch (err) {
        setError("Мэдээлэл татаж чадсангүй.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Citation generator
  const generateCitation = (author, publicationDate, title, category, journalName, journalSeries, journalNumber, pageRange) => {
    const titleItalic = `<i>${title}</i>`;
    if (category === "Ном") {
      return [
        author,
        `(${publicationDate}). `,
        titleItalic,
        ". Улаанбаатар: Publisher.",
      ];
    } else if (category === "Сэтгүүл") {
      return [
        author,
        `(${publicationDate}). `,
        titleItalic,
        `. ${journalName}, Цуврал ${journalSeries}, Дугаар ${journalNumber}, ${pageRange}.`,
      ];
    } else if (category === "Хууль зүйн орчуулга") {
      return [
        author,
        `(${publicationDate}). `,
        titleItalic,
        " (Орчуулга). Улаанбаатар: Publisher.",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("formData to send:", formData);
    setError("");

    const formDataToSend = new FormData();
    const editableFields = [
      "title",
      "author",
      "category",
      "sector",
      "summary",
      "keywords",
      "publicationDate",
      "pageCount",
      "language",
      "references",
      "journalName",
      "journalSeries",
      "journalNumber",
      "pageRange",
    ];
    editableFields.forEach((field) => {
      formDataToSend.append(field, formData[field]);
    });

    // Add the updated status field
    formDataToSend.append("status", "pending");

    if (["Сэтгүүл", "Эмхэтгэл"].includes(formData.category)) {
      rows.forEach((row, index) => {
        formDataToSend.append(`journalArticles[${index}][category]`, row.category);
        formDataToSend.append(`journalArticles[${index}][name]`, row.name);
        formDataToSend.append(`journalArticles[${index}][title]`, row.title);
        formDataToSend.append(`journalArticles[${index}][pageRange]`, row.pageRange);
        (row.sector || []).forEach((sector, sectorIndex) => {
          formDataToSend.append(`journalArticles[${index}][sector][${sectorIndex}]`, sector.name);
        });
      });
    }

    if (file) formDataToSend.append("file", file);

    try {
      setLoading(true);
      await axios.put(`/api/documents/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Бүтээл амжилттай шинэчлэгдлээ.");
      navigate("/my-documents");
    } catch (err) {
      setError(err.response?.data?.message || "Шинэчлэхэд алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    if (field === "sector") {
      updatedRows[index][field] = value || []; // Ensure sector is always an array
    } else {
      updatedRows[index][field] = value;
    }
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { category: "Өгүүлэл", sector: [], name: "", title: "", pageRange: "" }]);
  };

  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
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

  const handleFormSectorChange = (event, newValue) => {
    setFormSector(newValue || []);
    setFormData((prev) => ({
      ...prev,
      sector: newValue || [], // Ensure sector is always an array
    }));
  };

  return (
    <Container maxWidth="lr" sx={{ mt: 5, mb: 5 }}>
      {loading ? (
        <Typography variant="h6" align="center">
          Уншиж байна...
        </Typography>
      ) : (
        <>
          {/* Add the title */}
          <Typography variant="h4" gutterBottom align="center">
            Бүтээл засварлах
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Category Selection */}
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
                      {[1, 2, 3, 4, 5, 6].map((number) => (
                        <MenuItem key={number} value={number}>
                          {number}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            )}
            <TextField
              label="Зохиогч"
              name="author"
              value={formData.author}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            
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
                        onChange={(e) => handleInputChange(index, "category", e.target.value)}
                        label="Төрөл"
                      >
                        {formData.category === "Сэтгүүл" ? (
                          <>
                            <MenuItem value="Эрдэм шинжилгээний өгүүлэл">Эрдэм шинжилгээний өгүүлэл</MenuItem>
                            <MenuItem value="Шүүхийн шийдвэрийн дүн шинжилгээ">Шүүхийн шийдвэрийн дүн шинжилгээ</MenuItem>
                            <MenuItem value="Судалгааны тойм, үр дүн">Судалгааны тойм, үр дүн</MenuItem>
                            <MenuItem value="Шинжлэх ухааны тайлбар">Шинжлэх ухааны тайлбар</MenuItem>
                            <MenuItem value="Хууль зүйн орчуулга">Хууль зүйн орчуулга</MenuItem>
                          </>
                        ) : (
                          <>
                            <MenuItem value="Судалгааны тайлан">Судалгааны тайлан</MenuItem>
                            <MenuItem value="Судалгааны тойм, үр дүн">Судалгааны тойм, үр дүн</MenuItem>
                          </>
                        )}
                      </Select>
                    </FormControl>
                    
                    {/* Салбар эрх зүй Autocomplete */}
                    <Autocomplete
                      sx={{ minWidth: 200 }}
                      multiple
                      options={flattenedSectors} // Use your flattenedSectors array
                      getOptionLabel={(option) => option.name || ""} // Display the sector name
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
                          (selected) => selected._id === option._id // Compare by ID
                        );
                        return (
                          <MenuItem
                            {...props}
                            key={option._id || option.name}
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
                        onChange={(e) =>
                          handleInputChange(index, "title", e.target.value)
                        }
                        InputProps={{
                          style: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
                          title: row.title
                        }}
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
                  const isSelected = (formData.sector || []).some(
                    (selected) => selected._id === option._id // Compare by ID
                  );
                  return (
                    <MenuItem
                      {...props}
                      key={option._id || option.name}
                      sx={{ pl: option.level * 2, justifyContent: "space-between" }}
                    >
                      {option.name}
                      {isSelected && <CheckIcon color="info" />}
                    </MenuItem>
                  );
                }}          
              />
            )}

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

            <TextField
              label="Эшлэлүүд"
              name="references"
              value={formData.references}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              required
            />

            <input type="file" accept="application/pdf" onChange={handleFileChange} />

            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? "Шинэчилж байна..." : "Шинэчлэх"}
            </Button>
          </form>
        </>
      )}
    </Container>
  );
};

export default EditDocument;
