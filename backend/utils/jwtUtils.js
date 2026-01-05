// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({
    id: user._id,
    email: user.email,
    role: user.role
  }, process.env.JWT_SECRET, {
    expiresIn: '24h',  // Token expires in 8 hours
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
