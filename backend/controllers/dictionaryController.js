// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const Dictionary = require('../models/Dictionary'); // Assuming you have a Dictionary model

// Get all dictionary terms (public access)
const getDictionary = async (req, res) => {
  try {
    const terms = await Dictionary.find();
    res.status(200).json({ terms });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dictionary terms', error: error.message });
  }
};

// Add a new dictionary term
const addDictionaryTerm = async (req, res) => {
  try {
    const { term, explanation, extra, ru, en, la, de } = req.body;
    const newTerm = new Dictionary({ term, explanation, extra, ru, en, la, de });
    await newTerm.save();
    res.status(201).json({ message: 'Dictionary term added successfully', term: newTerm });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add dictionary term', error: error.message });
  }
};

// Update a dictionary term
const updateDictionaryTerm = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedTerm = await Dictionary.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedTerm) {
      return res.status(404).json({ message: 'Dictionary term not found' });
    }

    res.status(200).json({ message: 'Dictionary term updated successfully', term: updatedTerm });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update dictionary term', error: error.message });
  }
};

// Delete a dictionary term
const deleteDictionaryTerm = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTerm = await Dictionary.findByIdAndDelete(id);

    if (!deletedTerm) {
      return res.status(404).json({ message: 'Dictionary term not found' });
    }

    res.status(200).json({ message: 'Dictionary term deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete dictionary term', error: error.message });
  }
};

module.exports = {
  getDictionary,
  addDictionaryTerm,
  updateDictionaryTerm,
  deleteDictionaryTerm,
};
