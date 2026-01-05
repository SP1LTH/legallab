// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const express = require("express");
const axios = require('axios');
const Document = require("../models/Document");
const User = require("../models/User");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Journal = require("../models/Journal");

// Set up Multer to store files in the local directory
const AWS = require('aws-sdk');

// Configure AWS with your access and secret key.
const s3 = new AWS.S3({
  endpoint: 'https://s3.mcloud.gov.mn',
  region: null,
  accessKeyId: 'T2QSHT8Y',
  secretAccessKey: 'P258ODZ6',
  s3ForcePathStyle: true
});

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Assuming Express and Mongoose are set up
router.get("/top-cited", async (req, res) => {
  try {
    const topDocuments = await Document.find({ status: "approved" })
      .sort({ citationCount: -1 }) // Sort by citationCount descending
      .limit(10); // Limit to top 10 documents
    res.status(200).json(topDocuments);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve top-cited documents" });
  }
});

// Test route to verify session ID
router.get("/test-session", (req, res) => {
  console.log("Session ID:", req.cookies.sessionId);
  res.send(`Session ID: ${req.cookies.sessionId}`);
});

// count citation by user and IP address
router.post("/cite/:documentId", async (req, res) => {
  console.log("Cookies at /cite route:", req.cookies); // Log cookies at the /cite route
  // res.send(`Session ID: ${req.cookies.sessionId}`);
  const documentId = req.params.documentId;
  const sessionId = req.cookies.sessionId;

  console.log("Received Session ID:", sessionId); // Log session ID for verification

  try {
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if the session has cited this document within the last 24 hours
    const lastCitation = document.citations.find(
      (cite) => cite.session === sessionId
    );

    if (lastCitation) {
      const lastCitedTime = new Date(lastCitation.lastCitedAt);
      const now = new Date();
      const hoursSinceLastCite = (now - lastCitedTime) / (1000 * 60 * 60);
      if (hoursSinceLastCite < 24) {
        return res
          .status(400)
          .json({ message: "Та энэ бүтээлээс 24 цаг тутамд нэг удаа иш татах боломжтой." });
      }

      // Update the timestamp if the session cites after 24 hours
      lastCitation.lastCitedAt = now;
    } else {
      // Add new citation log entry
      document.citations.push({
        session: sessionId,
        lastCitedAt: new Date(),
      });
    }

    document.citationCount += 1; // Increment citation count
    await document.save(); // Save changes

    res.status(200).json({ message: "Citation count updated." });
  } catch (error) {
    console.error("Failed to update citation count:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Route to get documents by author
router.get("/author/:author", async (req, res) => {
  try {
    const { author } = req.params;

    // Fetch documents with the matching author
    const documents = await Document.find({ author: author });

    if (documents.length === 0) {
      return res
        .status(404)
        .json({ message: "No documents found for this author." });
    }

    res.status(200).json(documents);
  } catch (error) {
    console.error("Error fetching documents by author:", error);
    res.status(500).json({ message: "Failed to fetch documents by author." });
  }
});

router.post("/favorites", authMiddleware, async (req, res) => {
  try {
    const { documentId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Check if document is already in favorites
    if (user.favorites.includes(documentId)) {
      return res
        .status(400)
        .json({ message: "Document is already in favorites." });
    }

    user.favorites.push(documentId);
    await user.save();
    res.status(200).json({ message: "Document added to favorites." });
  } catch (error) {
    console.error("Error adding document to favorites:", error); // Log the error
    res.status(500).json({ message: "Failed to add document to favorites." });
  }
});

router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favorites");
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve favorite documents." });
  }
});

// Delete a document from the user's favorites
router.delete("/favorites/:documentId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const documentId = req.params.documentId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Remove document from favorites
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== documentId
    );
    await user.save();

    res.status(200).json({ message: "Document removed from favorites." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to remove document from favorites." });
  }
});

// Fetch documents added by the logged-in user
router.get("/my-documents", authMiddleware, async (req, res) => {
  try {
    const documents = await Document.find({ addedBy: req.user.id });
    res.status(200).json(documents);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch documents", error: err.message });
  }
});

// Search route
router.get("/search", async (req, res) => {
  const query = req.query.query;
  console.log(query);

  try {
    // Split the query by " AND " to handle multiple search terms
    const searchTerms = query.split(" БАС ").map((term) => term.trim());

    // Build the $and array for each term to match in title or summary
    const conditions = searchTerms.map((term) => ({
      $or: [
        { title: { $regex: term, $options: "i" } },
        { summary: { $regex: term, $options: "i" } },
        { "journalArticles.title": { $regex: term, $options: "i" } },
      ],
    }));

    // Query documents with approved status and match all conditions
    const documents = await Document.find({
      status: "approved",
      $and: conditions,
    });

    // Deduplicate results: if both document.title and journalArticles.title match, return the original document
    const uniqueDocuments = documents.map((doc) => {
      const hasMatchingJournalArticles = doc.journalArticles.some((journal) =>
        journal.title.toLowerCase().includes(query.toLowerCase())
      );

      if (doc.title.toLowerCase().includes(query.toLowerCase()) && hasMatchingJournalArticles) {
        // If both document.title and journalArticles.title match, return the original document
        return doc;
      }

      return doc;
    });

    // Remove duplicates by ensuring only unique documents are returned
    const deduplicatedResults = uniqueDocuments.filter(
      (doc, index, self) =>
        index === self.findIndex((d) => d._id.toString() === doc._id.toString())
    );

    if (deduplicatedResults.length === 0) {
      return res.status(404).json({ message: "No documents found" });
    }

    console.log(deduplicatedResults.length + " unique documents found");

    res.status(200).json(deduplicatedResults);
  } catch (error) {
    console.error("Error while searching documents:", error);
    res.status(500).json({ error: "Error while searching documents" });
  }
});

// Get all documents
router.get("/getAll", async (req, res) => {
  try {
    const documents = await Document.find({ status: "approved" });

    if (documents.length === 0) {
      return res.status(404).json({ message: "No approved documents found" });
    }

    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get documents by category
router.get("/category/:category", async (req, res) => {
  const category = decodeURIComponent(req.params.category); // Decode the category parameter

  try {
    // Query documents by category and status 'approved'
    const documents = await Document.find({ category, status: "approved" });
    console.log(documents + " documents found in this category");

    // Query documents that have journalArticles with the specified category
    const journalArticlesDocuments = await Document.find({
      "journalArticles.category": category,
      status: "approved"
    });

    // Combine both results
    const combinedDocuments = [...documents, ...journalArticlesDocuments];

    if (combinedDocuments.length === 0) {
      return res
        .status(404)
        .json({ message: "No approved documents found in this category" });
    }

    res.json(combinedDocuments); // Return documents as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get documents by sector
router.get("/sector/:sector", async (req, res) => {
  const sector = decodeURIComponent(req.params.sector);

  try {
    // Query documents by sector and status 'approved'
    const documents = await Document.find({ sector, status: "approved" });

    // Query documents that have journalArticles with the specified sector
    const journalArticlesDocuments = await Document.find({
      "journalArticles.sector": sector
    });

    // Combine both results
    const combinedDocuments = [...documents, ...journalArticlesDocuments];

    if (combinedDocuments.length === 0) {
      return res
        .status(404)
        .json({ message: "No approved documents found in this category" });
    }

    res.json(combinedDocuments); // Return documents as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get documents by journal series with journal name equal to title
router.get("/journal-series/:title", async (req, res) => {
  const title = decodeURIComponent(req.params.title);

  console.log(title + " journal series");

  try {
    // Query documents by journal series with journal name equal to title
    const documents = await Document.find({ "title": title });

    if (documents.length === 0) {
      return res.status(404).json({ message: "No documents found for this journal series" });
    }

    res.status(200).json(documents);
  } catch (err) {
    console.error("Error fetching documents by journal series:", err);
    res.status(500).json({ message: "Failed to fetch documents by journal series" });
  }
});

// Add a new document with file upload (store file path instead of binary)
router.post("/add", authMiddleware, upload.fields([{ name: 'file' }, { name: 'coverImage' }]), async (req, res) => {
  const {
    title,
    subtitle,
    author,
    category,
    sector,
    summary,
    keywords,
    publicationDate,
    pageCount,
    language,
    references,
    magazineNameNumber,
    rejectComment,
    journalArticles,
    journalSeries,
    journalNumber
  } = req.body;

  try {
    // Ensure a file was uploaded
    if (!req.files.file) {
      return res.status(400).json({ message: "PDF file is required." });
    }

    // Create S3 upload parameters for the PDF file
    const pdfParams = {
      Bucket: 'legalresearch',
      Key: `${Date.now()}-${req.files.file[0].originalname}`,
      Body: req.files.file[0].buffer,
      ContentType: req.files.file[0].mimetype
    };

    // Upload the PDF file to S3
    const pdfUpload = s3.upload(pdfParams).promise();

    // Create S3 upload parameters for the cover image if provided
    let coverImageUrl = null;
    if (req.files.coverImage) {
      const coverImageParams = {
        Bucket: 'legalresearch',
        Key: `${Date.now()}-${req.files.coverImage[0].originalname}`,
        Body: req.files.coverImage[0].buffer,
        ContentType: req.files.coverImage[0].mimetype
      };
      const coverImageUpload = await s3.upload(coverImageParams).promise();
      coverImageUrl = coverImageUpload.Location;
    }

    const pdfData = await pdfUpload;

    // Create a new document and set the status to 'pending'
    const newDocument = new Document({
      title,
      subtitle,
      author,
      category,
      summary,
      sector: sector.split(","),
      keywords: keywords.split(","), // Split keywords string into an array
      publicationDate,
      pageCount,
      language,
      references,
      magazineNameNumber,
      filePath: pdfData.Location, // Store the file path
      coverImageUrl, // Store the cover image URL
      status: "pending", // Status is 'pending' by default
      addedBy: req.user.id,
      rejectComment,
      journalArticles,
      journalSeries,
      journalNumber
    });

    const savedDocument = await newDocument.save();

    // Add the journal ID and title to the user's journals array only if category is "Сэтгүүл" or "Эмхэтгэл"
    if (savedDocument.category === "Сэтгүүл" || savedDocument.category === "Эмхэтгэл") {
      const user = await User.findById(req.user.id);

      // Check if the user already has a journal with the same title
      const existingJournal = user.journals.find(journal => journal.title === savedDocument.title);
      if (existingJournal) {
        return res.status(201).json(savedDocument);
      }

      // Create a new journal entry
      const newJournal = new Journal({
        title: savedDocument.title,
        publisher: savedDocument.author,
        document: savedDocument._id
      });

      const savedJournal = await newJournal.save();

      user.journals.push({
        id: savedJournal._id,
        title: savedJournal.title,
        publisher: savedDocument.author
      });
      await user.save();
    }

    res.status(201).json(savedDocument);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to download the file by document ID
// TODO - zuwhun approved document-n ID aar haij boldog baih
router.get("/download/:id", authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document || !document.filePath) {
      return res.status(404).json({ message: "File not found" });
    }

    const fileUrl = document.filePath;
    const response = await axios.get(fileUrl, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", "application/pdf");
    response.data.pipe(res); // Stream the file to the client
  } catch (err) {
    console.error("Error fetching file from URL:", err.message);
    res.status(500).json({ message: "Failed to fetch file from URL" });
  }
});

// Get a document by ID
router.get("/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });

    const localDocument = {
      ...document.toObject(),
      coverImageUrl: document.coverImageUrl || 'https://example.com/default-cover-image.jpg'
    };

    res.status(200).json(localDocument);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a document and overwrite file if a new one is uploaded
router.put("/:id", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const documentId = req.params.id;
    const updateData = { ...req.body };

    // Check if the document exists
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Prevent updates to approved documents
    if (document.status === "approved") {
      return res.status(403).json({ message: "Зөвшөөрөгдсөн бүтээлүүд засагдах боломжгүй." });
    }

    // If a new file is uploaded, delete the old one from S3
    if (req.file) {
      const oldFilePath = document.filePath;
      if (oldFilePath) {
        const oldFileKey = oldFilePath.split('/').pop();
        const deleteParams = {
          Bucket: 'legalresearch',
          Key: oldFileKey,
        };
        await s3.deleteObject(deleteParams).promise();
      }

      // Upload the new file to S3
      const params = {
        Bucket: 'legalresearch',
        Key: `${Date.now()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const data = await s3.upload(params).promise();
      updateData.filePath = data.Location;
    }

    // Update document data
    const updatedDocument = await Document.findByIdAndUpdate(
      documentId,
      updateData,
      { new: true }
    );
    if (!updatedDocument) {
      return res.status(404).json({ message: "Document update failed" });
    }

    res.status(200).json(updatedDocument);
  } catch (err) {
    console.error("Error updating document:", err.message);
    res
      .status(500)
      .json({ message: "Failed to update document", error: err.message });
  }
});

// Delete a document
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document)
      return res.status(404).json({ message: "Document not found" });

    // Delete the file from S3
    const filePath = document.filePath;
    if (filePath) {
      const fileKey = filePath.split('/').pop();
      const deleteParams = {
        Bucket: 'legalresearch',
        Key: fileKey,
      };
      await s3.deleteObject(deleteParams).promise();
    }

    // Delete the document from the database
    await Document.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Document and file deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
