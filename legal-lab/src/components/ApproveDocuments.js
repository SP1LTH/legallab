// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Button, CircularProgress } from '@mui/material';
import axios from '../services/api'; // Adjust the path as needed

const ApproveDocuments = () => {
  const [pendingDocuments, setPendingDocuments] = useState([]); // State for storing pending documents
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch pending documents on component mount
  useEffect(() => {
    const fetchPendingDocuments = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/admin/pending-documents'); // Backend endpoint for pending documents
        setPendingDocuments(response.data);
      } catch (err) {
        setError('Failed to load pending documents');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDocuments();
  }, []);

  // Handle approval
  const handleApprove = async (docId) => {
    try {
      await axios.put(`/admin/documents/${docId}/approve`); // Endpoint for approving document
      setPendingDocuments(prevDocs => prevDocs.filter(doc => doc._id !== docId)); // Remove the approved document from the list
    } catch (err) {
      console.error('Error approving document', err);
    }
  };

  // Handle rejection
  const handleReject = async (docId) => {
    try {
      await axios.put(`/admin/documents/${docId}/reject`); // Endpoint for rejecting document
      setPendingDocuments(prevDocs => prevDocs.filter(doc => doc._id !== docId)); // Remove the rejected document from the list
    } catch (err) {
      console.error('Error rejecting document', err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Approve or Reject Documents
      </Typography>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {pendingDocuments.length === 0 && !loading ? (
        <Typography>No pending documents</Typography>
      ) : (
        pendingDocuments.map((document) => (
          <Card key={document._id} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">{document.title}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                By: {document.author} | Category: {document.category}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleApprove(document._id)} 
                sx={{ mr: 2 }}
              >
                Approve
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => handleReject(document._id)}
              >
                Reject
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default ApproveDocuments;
