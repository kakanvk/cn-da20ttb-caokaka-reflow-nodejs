const mongoose = require('mongoose');

const singerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, 
});

const Singer = mongoose.model('Singer', singerSchema);

module.exports = Singer;
