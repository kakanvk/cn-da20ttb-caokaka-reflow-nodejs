const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, // Đường dẫn đến ảnh của category
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
