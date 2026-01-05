// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const mongoose = require('mongoose');
const Sector = require('../models/Sector');
require('dotenv').config();

const sectors = [
  { name: 'Эрх зүйн онолын ба салбар судлагдахуун' },
  { name: 'Үндсэн хуулийн эрх зүй' },
  { name: 'Захиргааны эрх зүй' },
  { name: 'Иргэний эрх зүй' },
  { name: 'Хувийн эрх зүйн тусгай салбар' },
  { name: 'Эрүүгийн /зөрчлийн эрх зүй/' },
  { name: 'Процессын эрх зүй' },
  { name: 'Олон улсын эрх зүй' },
  { name: 'Эдийн засгийн захиргааны эрх зүй' },
  { name: 'Төрийн санхүүгийн эрх зүй' },
  { name: 'Хөдөлмөрийн эрх зүй' },
  { name: 'Гэр бүлийн эрх зүй' },
  { name: 'Нийгмийн хамгааллын эрх зүй' },
  { name: 'Шүүх эрх мэдэл, хууль сахиулах, хэрэгжүүлэх эрх зүй' },
  { name: 'Хэвлэл мэдээллийн эрх зүй' },
  { name: 'Хүрээлэн буй орчны эрх зүй' },
  { name: 'Нутгийн удирдлагын эрх зүй' },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    return Sector.insertMany(sectors);
  })
  .then(() => {
    console.log('Sectors inserted successfully');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error inserting sectors:', err);
  });
