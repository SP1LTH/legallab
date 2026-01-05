// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const express = require('express');
const Sector = require('../models/Sector');
const router = express.Router();

// Route to get all sectors
router.get('/', async (req, res) => {
  try {
    const sectors = await Sector.find();
    res.status(200).json(sectors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sectors', error: err.message });
  }
});

// Route to add a new sector
router.post('/add', async (req, res) => {
  const { name, subsectors } = req.body;

  const newSector = new Sector({
    name,
    subsectors, // Add subsectors if provided
  });

  try {
    const savedSector = await newSector.save();
    res.status(201).json(savedSector);
  } catch (err) {
    res.status(400).json({ message: 'Error adding sector', error: err.message });
  }
});

module.exports = router;
