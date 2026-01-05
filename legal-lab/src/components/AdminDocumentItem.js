// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState, useEffect } from "react";
import {
  ListItem,
  Typography,
  Button,
  Box,
  TextField,
  Card,
  CardActions,
  CardContent,
} from "@mui/material";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminDocumentItem = ({ document, onDocumentUpdate }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectComment, setRejectComment] = useState(
    document.rejectComment || ""
  );

  const handleApprove = async () => {
    try {
      const response = await axios.put(
        `/admin/documents/approve/${document._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Бүтээл амжилттай батлагдлаа");
      onDocumentUpdate(response.data);
    } catch (err) {
      console.error("Бүтээлийг батлахад алдаа гарлаа:", err);
    }
  };

  const handleReject = async () => {
    console.log("Reject payload:", { rejectComment });

    try {
      const response = await axios.put(
        `/admin/documents/reject/${document._id}`,
        { rejectComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Бүтээлийг буцаалаа");
      onDocumentUpdate(response.data);
      setIsRejecting(false);
      setRejectComment("");
    } catch (err) {
      console.error("Бүтээлийг татгалзахад алдаа гарлаа:", err);
    }
  };

  const handleRead = () => {
    navigate(`/documents/${document._id}`);
  };

  return (
    <ListItem
      sx={{ mb: 2, border: "1px solid #ccc", borderRadius: "5", padding: 2, backgroundColor: "#f9f9f9" }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6">
          {document.title}{" "}
          {document.category === "Сэтгүүл" &&
            `Цуврал: ${document.journalSeries} Дугаар: ${document.journalNumber}`}
          {document.category === "Эмхэтгэл" &&
            `Боть: ${document.journalSeries}`}
        </Typography>
        {document.category === "Эмхэтгэл" && document.subtitle && (
          <Typography variant="subtitle2" sx={{ color: "#79747E", fontStyle: "italic" }}>
            {document.subtitle}
          </Typography>
        )}
        <Typography variant="body2">Зохиогч: {document.author}</Typography>
        <Typography variant="body2">Товч: {document.summary}</Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRead}
          sx={{ mb: 1 }}
        >
          Унших
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleApprove}
          sx={{ mb: 1 }}
        >
          Оруулах
        </Button>
        {!isRejecting ? (
          <Button
            variant="contained"
            color="error"
            onClick={() => setIsRejecting(true)}
          >
            Буцаах
          </Button>
        ) : (
          <Card sx={{ mt: 2, width: "100%" }}>
            <CardContent>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Тайлбар бичих:
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Тайлбар оруулна уу..."
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
              />
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="error"
                onClick={() => {
                  setIsRejecting(false);
                  setRejectComment("");
                }}
              >
                Болих
              </Button>
              <Button size="small" color="primary" onClick={handleReject}>
                Илгээх
              </Button>
            </CardActions>
          </Card>
        )}
      </Box>
    </ListItem>
  );
};

export default AdminDocumentItem;
