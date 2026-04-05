const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  difficulty: {
    type: Number,
    required: true
  },
  question: {
    type: String
  },
  userAnswer: {
    type: String
  },
  correctAnswer: {
    type: String
  },
  isCorrect: {
    type: Boolean
  },
  timeTaken: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Performance", performanceSchema);
