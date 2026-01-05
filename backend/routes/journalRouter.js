// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const express = require("express");
const router = express.Router();
const Journal = require("../models/Journal");
const authMiddleware = require("../middlewares/authMiddleware");
const { uploadToS3 } = require("../utils/s3"); // Import S3 utility
const multer = require("multer"); // Import multer

// Configure multer for file uploads
const upload = multer();

// Get all journals
router.get("/", async (req, res) => {
  try {
    const journals = await Journal.find();
    res.status(200).json(journals);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve journals" });
  }
});

// Get a journal by ID
router.get("/:id", async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) return res.status(404).json({ message: "Journal not found" });
    res.status(200).json(journal);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve journal" });
  }
});

// Get a journal by title
router.get("/title/:title", async (req, res) => {
  try {
    const journal = await Journal.findOne({ title: req.params.title });
    if (!journal) return res.status(404).json({ message: "Journal not found" });
    res.status(200).json(journal);
  } catch (error) {
    console.error("Error retrieving journal by title:", error);
    res.status(500).json({ message: "Failed to retrieve journal by title" });
  }
});

// Add a new journal
router.post("/", authMiddleware, async (req, res) => {
  const { title, publisher, document } = req.body;
  try {
    const newJournal = new Journal({ title, publisher, document });
    const savedJournal = await newJournal.save();
    res.status(201).json(savedJournal);
  } catch (error) {
    res.status(400).json({ message: "Failed to add journal" });
  }
});

// Update a journal by ID
router.put("/:id", authMiddleware, upload.single("coverImage"), async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);
    console.log("Request Params:", req.params);

    const { summary, ...updateData } = req.body;

    let coverImageUrl = null;
    if (req.file) {
      try {
        const coverImageParams = {
          Bucket: "legalresearch",
          Key: `${Date.now()}-${req.file.originalname}`,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };
        const coverImageUpload = await uploadToS3(req.file); // Pass the file object directly
        console.log("S3 Upload Response:", coverImageUpload); // Debugging log
        if (coverImageUpload) {
          coverImageUrl = coverImageUpload;
          console.log("Cover Image URL:", coverImageUpload);
          updateData.coverImage = coverImageUpload;
        } else {
          console.error("Invalid S3 Upload Response:", coverImageUpload);
          updateData.coverImage = coverImageUpload;
        }
      } catch (error) {
        console.error("S3 Upload Error:", error);
        return res.status(500).json({ message: "Failed to upload cover image" });
      }
    }

    if (summary) {
      updateData.summary = summary;
    }

    const updatedJournal = await Journal.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedJournal) return res.status(404).json({ message: "Journal not found" });
    res.status(200).json(updatedJournal);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Failed to update journal" });
  }
});

// Delete a journal by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedJournal = await Journal.findByIdAndDelete(req.params.id);
    if (!deletedJournal) return res.status(404).json({ message: "Journal not found" });
    res.status(200).json({ message: "Journal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete journal" });
  }
});

module.exports = router;
