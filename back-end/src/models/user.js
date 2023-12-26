const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['free', 'premium', 'admin'], required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
