// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const mongoose = require('mongoose');

// Define the main sector schema
const sectorSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model('Sector', sectorSchema);
