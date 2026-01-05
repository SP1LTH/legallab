// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const mongoose = require('mongoose');

const dictionarySchema = new mongoose.Schema({
  term: { type: String, required: true },
  explanation: { type: String, required: true },
  extra: { type: String },
  ru: { type: String },
  en: { type: String },
  la: { type: String },
  de: { type: String },
});

module.exports = mongoose.model('Dictionary', dictionarySchema);
