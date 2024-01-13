const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
  selected_background: { type: mongoose.Schema.Types.ObjectId, ref: 'Background' },
  role: { type: String, enum: ['Free', 'Premium', 'Admin'], required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
