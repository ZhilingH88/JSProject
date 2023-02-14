const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  user_id: {
    type: String,
    ref: "User",
    required: true,
  },
});

module.exports = adminSchema;
