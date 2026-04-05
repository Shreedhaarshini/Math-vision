const Performance = require('../models/Performance');

// Utility function to calculate accuracy
function calculateAccuracy(data) {
  const total = data.length;
  if (total === 0) return 0;
  const correct = data.filter(record => record.isCorrect).length;
  return correct / total;
}

// Store performance data after solving
async function storePerformance(req, res) {
  try {
    const {
      userId,
      topic,
      difficulty,
      question,
      userAnswer,
      correctAnswer,
      timeTaken
    } = req.body;

    const isCorrect = userAnswer === correctAnswer;

    const performance = new Performance({
      userId,
      topic,
      difficulty,
      question,
      userAnswer,
      correctAnswer,
      isCorrect,
      timeTaken
    });

    await performance.save();

    res.json({
      success: true,
      isCorrect,
      message: isCorrect ? "Correct answer!" : "Incorrect answer."
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get performance analysis by topic
async function getPerformanceAnalysis(req, res) {
  try {
    const { userId } = req.params;

    const records = await Performance.find({ userId });

    // Group by topic
    const topicGroups = {};
    records.forEach(record => {
      if (!topicGroups[record.topic]) {
        topicGroups[record.topic] = [];
      }
      topicGroups[record.topic].push(record);
    });

    // Calculate accuracy for each topic
    const analysis = Object.keys(topicGroups).map(topic => {
      const topicData = topicGroups[topic];
      const accuracy = calculateAccuracy(topicData);
      return {
        topic,
        accuracy: parseFloat(accuracy.toFixed(2)),
        total: topicData.length
      };
    });

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get recommendation based on weakest topic
async function getRecommendation(req, res) {
  try {
    const { userId } = req.params;

    const records = await Performance.find({ userId });

    if (records.length === 0) {
      return res.json({
        topic: "algebra",
        difficulty: 1
      });
    }

    // Group by topic
    const topicGroups = {};
    records.forEach(record => {
      if (!topicGroups[record.topic]) {
        topicGroups[record.topic] = [];
      }
      topicGroups[record.topic].push(record);
    });

    // Find weakest topic (lowest accuracy)
    let weakestTopic = null;
    let lowestAccuracy = 1;

    Object.keys(topicGroups).forEach(topic => {
      const accuracy = calculateAccuracy(topicGroups[topic]);
      if (accuracy < lowestAccuracy) {
        lowestAccuracy = accuracy;
        weakestTopic = topic;
      }
    });

    // If all topics have same accuracy, pick first one
    if (!weakestTopic) {
      weakestTopic = Object.keys(topicGroups)[0];
      lowestAccuracy = calculateAccuracy(topicGroups[weakestTopic]);
    }

    // Assign difficulty based on accuracy
    let difficulty;
    if (lowestAccuracy < 0.5) {
      difficulty = 1;
    } else if (lowestAccuracy < 0.7) {
      difficulty = 2;
    } else {
      difficulty = 3;
    }

    res.json({
      topic: weakestTopic,
      difficulty
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Legacy function (keep for backward compatibility)
async function getPerformanceSummary(req, res) {
  try {
    const topicStats = await Performance.aggregate([
      {
        $group: {
          _id: '$topic',
          total: { $sum: 1 },
          correct: {
            $sum: { $cond: [{ $eq: ['$isCorrect', true] }, 1, 0] }
          }
        }
      }
    ]);

    const allTopics = topicStats.map(stat => ({
      topic: stat._id,
      accuracy: Math.round((stat.correct / stat.total) * 100)
    }));

    const weakTopics = allTopics
      .filter(t => t.accuracy < 50)
      .map(t => t.topic);

    const strongTopics = allTopics
      .filter(t => t.accuracy > 70)
      .map(t => t.topic);

    res.json({
      weakTopics,
      strongTopics,
      allTopics
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  storePerformance,
  getPerformanceAnalysis,
  getRecommendation,
  getPerformanceSummary,
  calculateAccuracy
};
