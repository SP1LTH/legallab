// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateToken } = require("../utils/jwtUtils");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const crypto = require('crypto');

const verificationSecret = process.env.JWT_SECRET || "your-verification-secret"; // You can use a separate secret for verification

// Configure Nodemailer transporter (e.g., using Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail", // You can also use other services like SendGrid
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app password
  },
});

// Reset Password Endpoint
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() } // Check token validity
    });

    if (!user) {
      return res.status(400).json({ message: "Буруу эсвэл хугацаа нь дууссан холбоос байна." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Нууц үг амжилттай шинэчлэгдлээ.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(400).json({ message: 'Токен буруу эсвэл хугацаа нь дууссан байна.' });
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Token generation logic here
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset link via email
    const resetLink = `${process.env.FRONTEND_URL}#/reset-password?token=${resetToken}`;
    // Add a console log to verify email sending
    console.log(`Reset link generated: ${resetLink}`);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Нууц үг сэргээх хүсэлт",
      html: `<p>Нууц үгээ шинэчлэхийн тулд дараах холбоос дээр дарна уу:</p>
             <a href="${resetLink}">Нууц үг сэргээх холбоос</a>
             <p>энэ холбоос 1 цаг хүчинтэй болно.</p></br></br>
             <p>Хүндэтгэсэн,</p>
             <p>Legal Research</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error); // Log email error
        return res.status(500).json({ message: "Failed to send email. Please try again." });
      }
      res.status(200).json({ message: "Нууц үг сэргээх имэйл илгээгдлээ." });
    });

  } catch (error) {
    console.error("Forgot password error:", error); // Log route error
    res.status(500).json({ message: "Алдаа гарлаа, дахин оролдоно уу." });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Нэвтрэх нэр эсвэл нууц үг буруу байна" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Нэвтрэх нэр эсвэл нууц үг буруу байна" });
    }

    // Check if the user has verified their email
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Таны бүртгэл баталгаажаагүй байна. И-мэйлээ шалгана уу.",
      });
    }

    // Generate JWT token
    const token = generateToken(user);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register a new user and send verification email
router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password, role, phoneNumber } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Хэрэглэгч бүртгэлтэй байна" });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: false,
      phoneNumber
    });
    const savedUser = await newUser.save();

    // Generate verification token
    const verificationToken = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      verificationSecret,
      { expiresIn: "1h" }
    );

    // Send verification email
    const verificationLink = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Legal Research - Бүртгэлээ баталгаажуулна уу",
      html: `<p>Legal Research-д бүртгүүлсэнд баярлалаа! Бүртгэлээ баталгаажуулахын тулд дараах холбоос дээр дарна уу:</p>
             <a href="${verificationLink}">Баталгаажуулах холбоос</a></br>
             <p>энэ холбоос 1 цаг хүчинтэй болно.</p></br></br>
             <p>Хүндэтгэсэн,</p>
             <p>Legal Research</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          message: "И-мэйл илгээхэд алдаа гарлаа. Дахин оролдоно уу.",
        });
      }
      res.status(201).json({
        message: "Бүртгэл амжилттай. И-мэйлээ шалгаж баталгаажуулна уу.",
      });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Email verification route
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, verificationSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Баталгаажуулалт амжилтгүй боллоо" });
    }

    user.isVerified = true;
    await user.save();

    res
      .status(200)
      .json({ message: "Таны бүртгэл баталгаажлаа. Одоо нэвтэрнэ үү." });
  } catch (err) {
    res.status(400).json({
      message: "Баталгаажуулалтын хугацаа дууссан эсвэл буруу байна.",
    });
  }
});

// Fetch the authenticated user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Fetch user without password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile route
router.put("/me", authMiddleware, async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const updatedFields = { firstname, lastname, email };

    // If the user wants to update the password
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    // Find user by ID and update their info
    const user = await User.findByIdAndUpdate(req.user.id, updatedFields, {
      new: true,
    }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
