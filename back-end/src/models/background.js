const mongoose = require('mongoose');

const backgroundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  premium_only: { type: Boolean },
});

const Background = mongoose.model('Background', backgroundSchema);

module.exports = Background;
