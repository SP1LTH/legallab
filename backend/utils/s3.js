// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
    endpoint: 'https://s3.mcloud.gov.mn',
    region: null,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3ForcePathStyle: true
});

const uploadToS3 = (file) => {
  if (!file || !file.buffer || !file.originalname || !file.mimetype) {
    throw new Error("Invalid file object. Ensure buffer, originalname, and mimetype are provided.");
  }

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: file.buffer, // Ensure buffer is passed correctly
    Key: `${Date.now()}-${file.originalname}`, // Add timestamp to the key
    ContentType: file.mimetype,
  };

  return s3.upload(uploadParams).promise().then((data) => {
    return data.Location;
  });
};

module.exports = { uploadToS3 };
