const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      require: true,
      unique: true,
    },
    refresh_token: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = userSchema;
