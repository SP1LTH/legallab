// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const mongoose = require("mongoose");

const journalArticleSchema = new mongoose.Schema({
  name: { type: String}, // Name of the author
  title: { type: String}, // Title of the journal entry
  category: { type: String}, // Category of the journal entry
  sector: [String], // Sector of the journal entry
  pageRange: { type: String}, // Page range
});

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    journalSeries: { type: Number }, // Journal цуврал
    journalNumber: { type: Number }, // Journal дугаар
    author: { type: String, required: true },
    category: { type: String, required: true },
    sector: [String], // zaawal songuulna
    summary: { type: String },
    keywords: [String],
    publicationDate: { type: Number, required: true }, // Year only
    pageCount: { type: Number, required: true },
    language: { type: String, required: true },
    references: { type: String },
    magazineNameNumber: { type: String, required: false },
    filePath: { type: String, required: true }, // Store file path instead of binary data
    coverImageUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    }, // New status field
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to user model
      required: true,
    },
    citationCount: { type: Number, default: 0 }, // Total citation count
    downloadCount: { type: Number, default: 0 },
    // Array to log citations per user and IP with timestamps
    citations: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who cited, if logged in
        ipAddress: String, // IP address of the citer
        lastCitedAt: { type: Date, default: Date.now }, // Date of the citation
        session: { type: String, required: true }
      },
    ],
    journalArticles: [journalArticleSchema],
    rejectComment: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
