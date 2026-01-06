// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, sparse: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "editor", "journal", "superAdmin", "author"], default: "user" }, // can be 'user' or 'admin'
    isVerified: { type: Boolean, default: false },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Document" }],
    resetPasswordToken: { type: String, default: null },
    resetPasswordTokenExpiry: { type: Date, default: null },
    journals: [
      {
        id: { type: Schema.Types.ObjectId, ref: "Journal" },
        title: { type: String },
        publisher: { type: String }
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
