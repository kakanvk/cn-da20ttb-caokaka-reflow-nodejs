const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên của đoạn (Verse, Chorus, Bridge)
  lyrics: { type: String, required: true }, // Lời bài hát của đoạn
  order: { type: Number, required: true }, // Thứ tự của đoạn
});

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sections: [sectionSchema], // Mảng các đoạn trong bài hát
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
