const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  user_id: { type: String, required: true },
  product_id: { type: String, required: true },
  quantity: {
    type: Number,
    required: true,
  },
});

module.exports = cartSchema;
