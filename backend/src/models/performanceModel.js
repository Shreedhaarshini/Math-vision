const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Performance = mongoose.model('Performance', performanceSchema);

module.exports = Performance;
