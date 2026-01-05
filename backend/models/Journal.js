// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    coverImage: { type: String },
    publisher: { type: String, required: true },
    summary: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Journal", journalSchema);
