// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const requestIp = require("request-ip");
const cookieParser = require("cookie-parser");
const uuid = require("uuid"); // To generate unique session IDs
const winston = require('winston');
require('dotenv').config();

const app = express();
app.use(cookieParser());

const PORT = process.env.PORT;

// Routes
const documentRouter = require('./routes/documentRouter');
const journalRouter = require('./routes/journalRouter');
const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const categoryRoute = require("./routes/categoryRouter");
const sectorRouter = require('./routes/sectorRouter');
const adminRoutes = require('./routes/adminRoutes');

// Middleware

app.use(express.json());
app.use(cors());
app.use(requestIp.mw());


// Middleware to generate session ID if it doesn't exist
// app.use('/', (req, res, next) => {
//   console.log("Headers:", req.headers.cookie); // Log raw cookie header
//   console.log("Cookies before setting session ID:", req.cookies);
//   if (!req.cookies.sessionId) {
//     const sessionId = uuid.v4();
//     res.cookie("sessionId", sessionId, { httpOnly: true, secure: false, sameSite: "strict" });
//     req.cookies.sessionId = sessionId; // Set it manually in the req object
//     console.log("New Session ID Set:", req.cookies.sessionId); // Log new session ID
//   } else {
//     console.log("Existing Session ID:", req.cookies.sessionId); // Log existing session ID
//   }

//   console.log("Cookies after setting session ID:", req.cookies); // Log cookies after setting session ID

//   next();
// });

// Middleware for URL-encoded form data (if needed)
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// to get ip address
app.set('trust proxy', true);

// Routers
app.use('/api/documents', documentRouter);
app.use('/api/journals', journalRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use("/api/categories", categoryRoute);
app.use('/api/sectors', sectorRouter);

// Admin Routes (Protected)
app.use('/admin', adminRoutes);

// public folder
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to the Legal Research backend!');
});

// Winston logging configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Example usage
logger.info('Winston logger initialized');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = logger;
