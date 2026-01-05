// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const express = require('express');
const { 
  getPendingDocuments, 
  approveDocument, 
  rejectDocument, 
  getAllUsers, 
  deleteUser,
  changeUserRole
} = require('../controllers/adminController');
const { 
  getDictionary, 
  addDictionaryTerm, 
  updateDictionaryTerm, 
  deleteDictionaryTerm 
} = require('../controllers/dictionaryController');
const verifyRole = require('../middlewares/verifyRole');

const router = express.Router();

// Admin routes for document management
router.get('/documents/pending', verifyRole(['admin']), getPendingDocuments);
router.put('/documents/approve/:id', verifyRole(['admin']), approveDocument);
router.put('/documents/reject/:id', verifyRole(['admin']), rejectDocument);

// Admin routes for user management
router.get('/users', verifyRole(['admin']), getAllUsers);
router.delete('/users/:id', verifyRole(['admin']), deleteUser);
router.patch('/users/:id/role', verifyRole(['admin']), changeUserRole);

// Routes for dictionary management (admin and editor)
router.get('/dictionary', getDictionary);  // Public route to fetch dictionary terms
router.post('/dictionary', verifyRole(['admin', 'editor']), addDictionaryTerm);  // Add a term
router.put('/dictionary/:id', verifyRole(['admin', 'editor']), updateDictionaryTerm);  // Update a term
router.delete('/dictionary/:id', verifyRole(['admin', 'editor']), deleteDictionaryTerm);  // Delete a term

module.exports = router;