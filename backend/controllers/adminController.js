// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const Document = require("../models/Document");
const User = require("../models/User");

// Get all pending documents for approval
const getPendingDocuments = async (req, res) => {
  try {
    const pendingDocuments = await Document.find({ status: "pending" }); // Fetch documents with 'pending' status
    res.status(200).json(pendingDocuments);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error fetching pending documents",
        error: err.message,
      });
  }
};

// Approve a pending document
const approveDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    const document = await Document.findByIdAndUpdate(
      documentId,
      { status: "approved" }, // Update the status to 'approved'
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res
      .status(200)
      .json({ message: "Document approved successfully", document });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error approving document", error: err.message });
  }
};

// Reject a pending document
const rejectDocument = async (req, res) => {
  try {
    const documentId = req.params.id;
    const rejectComment = req.body.rejectComment;
    const document = await Document.findByIdAndUpdate(
      documentId,
      { status: "rejected", rejectComment }, // Update the status to 'rejected'
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res
      .status(200)
      .json({ message: "Document rejected successfully", document });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error rejecting document", error: err.message });
  }
};

// Get all users (admin functionality)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

// Delete a user (admin functionality)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
};

// Change user role (admin functionality)
const changeUserRole = async (req, res) => {
  try {
    const userId = req.params.id; // User ID from request parameters
    const { role } = req.body; // New role from request body

    // Ensure the new role is provided
    if (!role) {
      return res.status(400).json({ message: "New role is required" });
    }

    // Find the user and update their role
    const user = await User.findByIdAndUpdate(
      userId,
      { role }, // Updating the role field
      { new: true, runValidators: true } // Options to return the updated user and validate input
    );

    // If the user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user role", error: err.message });
  }
};

module.exports = {
  getPendingDocuments,
  approveDocument,
  rejectDocument,
  getAllUsers,
  deleteUser,
  changeUserRole,
};
