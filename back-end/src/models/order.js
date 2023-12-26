const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: [
    {
      songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true },
      lyricsOrder: [
        {
          order: { type: Number, required: true },
          content: { type: String, required: true },
        },
      ],
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
