const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: {
    type: String,
    default: "Student"
  }
});

module.exports = mongoose.model("User", userSchema);
