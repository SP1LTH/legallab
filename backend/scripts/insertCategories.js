// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categories = [
  { name: 'Ном, сурах бичиг',
    subcategories: [
      { name: 'Ном' },
      { name: 'Сурах бичиг' },
      { name: 'Докторын диссертаци' },
      { name: 'Эмхэтгэл' }
    ],
  },
  { name: 'Сэтгүүл' },
  { name: 'Судалгааны тайлан' },
  { name: 'Эрдэм шинжилгээний өгүүлэл' },
  { name: 'Шүүхийн шийдвэрийн дүн шинжилгээ' },
  { name: 'Бусад',
    subcategories: [
      { name: 'Судалгааны тойм, үр дүн' },
      { name: 'Шинжлэх ухааны тайлбар' },
      { name: 'Хууль зүйн орчуулга' }
    ],
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    return Category.insertMany(categories);
  })
  .then(() => {
    console.log('Categories inserted successfully');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error inserting categories:', err);
  });
