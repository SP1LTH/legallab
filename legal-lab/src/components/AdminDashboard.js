// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid } from '@mui/material';
import axios from '../services/api';
import AdminDocumentItem from './AdminDocumentItem';
import { useLanguage } from "../context/LanguageContext";

const AdminDashboard = () => {
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();

  // Fetch all pending documents
  const fetchPendingDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/documents/pending', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPendingDocuments(response.data); // Update the state with the pending documents
    } catch (err) {
      setError('Failed to fetch pending documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending documents on component mount
  useEffect(() => {
    fetchPendingDocuments();
  }, []);

  // Refresh documents after approval/rejection
  const handleDocumentUpdate = () => {
    fetchPendingDocuments();
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        {language === "en" ? "Admin Dashboard - Pending Documents" : "Админ хяналтын самбар - Хүлээгдэж буй бүтээлүүд"}
      </Typography>

      {error && <Typography color="error">{error}</Typography>}
      {loading ? (
        <Typography>Loading documents...</Typography>
      ) : (
        <Grid container spacing={3}>
          {pendingDocuments.length > 0 ? (
            pendingDocuments.map((document) => (
              <Grid item xs={12} key={document._id}>
                <AdminDocumentItem
                  document={document}
                  onDocumentUpdate={handleDocumentUpdate} // Refetch the list
                />
              </Grid>
            ))
          ) : (
            <Typography>Бүтээл хоосон байна</Typography>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default AdminDashboard;
