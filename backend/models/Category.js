// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
}, { _id: false }); // Disable _id for each subcategory to keep data simple

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  subcategories: [subcategorySchema], // Allow an array of subcategory objects
});

module.exports = mongoose.model('Category', categorySchema);
