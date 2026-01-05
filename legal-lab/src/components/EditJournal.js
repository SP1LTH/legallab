// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React, { useState, useEffect } from 'react';
import axios from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Typography, Card, CardContent } from '@mui/material';

const EditJournal = () => {
  const { user, setUser } = useAuth(); // Added setUser to update user data
  const [selectedJournal, setSelectedJournal] = useState(user?.journals ? user.journals[0] : null);
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageName, setCoverImageName] = useState(''); // Add state for file name
  const [coverImagePreview, setCoverImagePreview] = useState(null); // Add state for image preview
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Fetch the user data using /me API endpoint
        const response = await axios.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user); // Set user object from the response
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setIsLoggedIn(false);
        setUser(null); // Clear user if fetching failed
      }
    }
    setLoading(false); // Set loading to false after fetching
  };

  useEffect(() => {
    fetchUser(); // Fetch user data on component mount
  }, []);

  useEffect(() => {
    if (selectedJournal) {
      axios.get(`/api/journals/${selectedJournal.id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(response => {
          setSelectedJournal(response.data);
          setSummary(response.data.summary || ''); // Set summary if it exists
          setCoverImagePreview(response.data.coverImage || null); // Set cover image preview if it exists
        })
        .catch(error => console.error('Error fetching document data:', error));
    }
  }, [selectedJournal]);

  const handleSave = () => {
    const formData = new FormData();
    formData.append('summary', summary || ''); // Ensure summary is always sent, even if empty
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    // Log formData content for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    axios.put(`/api/journals/${selectedJournal._id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        alert('Journal updated successfully');
      })
      .catch(error => {
        console.error('Error updating journal:', error);
        alert('Failed to update journal. Please check the input data.');
      });
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    setCoverImageName(file ? file.name : ''); // Update file name state
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCoverImagePreview(reader.result); // Set preview image
      reader.readAsDataURL(file);
    } else {
      setCoverImagePreview(null); // Clear preview if no file is selected
    }
  };

  return (
    <Card style={{ 
      maxWidth: '800px', 
      margin: '20px auto', 
      padding: '20px', 
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
      border: '2px solid rgb(210, 25, 25)', // Add border
      backgroundColor: '#f5f5f5' // Add background color
    }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>Сэтгүүл, эмхэтгэлийн хуудас засвар</Typography>
        <TableContainer component={Paper} style={{ border: '1px solid #ddd', padding: '10px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Нэр</TableCell>
                <TableCell>Нийтлэгч</TableCell>
                <TableCell>Үйлдэл</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user.journals.map(journal => (
                <TableRow key={journal.id} selected={selectedJournal?.id === journal.id}>
                  <TableCell>{journal.title}</TableCell>
                  <TableCell>{journal.publisher}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setSelectedJournal(journal)}
                    >
                      Засах
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {selectedJournal && (
          <div style={{ marginTop: '20px' }}>
            <Typography variant="h5">{selectedJournal.title}</Typography>
            <TextField
              label="Сэтгүүлийн товч"
              multiline
              rows={4}
              fullWidth
              value={summary}
              onChange={e => setSummary(e.target.value)}
              margin="normal"
            />
            <Button
              variant="contained"
              component="label"
              style={{ marginBottom: '10px' }}
            >
              Сэтгүүлийн хавтасны зураг сонгох
              <input type="file" hidden onChange={handleCoverImageChange} />
            </Button>
            {coverImageName && <Typography variant="body2" style={{ marginLeft: '10px' }}>{coverImageName}</Typography>}
            {coverImagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img src={coverImagePreview} alt="Cover Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              </div>
            )}
            <br />
            <Button variant="contained" color="secondary" onClick={handleSave}>
              Хадгалах
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EditJournal;
