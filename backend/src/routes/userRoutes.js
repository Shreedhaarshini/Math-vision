const express = require("express");
const router = express.Router();

// Mock user database (in production, use MongoDB/PostgreSQL)
let userProfile = {
  id: "1",
  name: "Shree",
  email: "shree@student.com",
  role: "Student",
  avatar: "",
  bio: "",
  grade: "10th",
  school: "",
  phone: "",
  preferences: {
    notifications: true,
    darkMode: true,
    language: "en"
  },
  stats: {
    problemsSolved: 0,
    streakDays: 0,
    totalPoints: 0,
    joinedDate: new Date().toISOString()
  }
};

// Get current user profile
router.get("/user", (req, res) => {
  res.json(userProfile);
});

// Get user profile by ID
router.get("/user/:id", (req, res) => {
  if (req.params.id === userProfile.id) {
    res.json(userProfile);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Update user profile
router.put("/user/:id", (req, res) => {
  if (req.params.id !== userProfile.id) {
    return res.status(404).json({ error: "User not found" });
  }

  const { name, email, bio, grade, school, phone, avatar } = req.body;

  // Update fields if provided
  if (name) userProfile.name = name;
  if (email) userProfile.email = email;
  if (bio !== undefined) userProfile.bio = bio;
  if (grade) userProfile.grade = grade;
  if (school !== undefined) userProfile.school = school;
  if (phone !== undefined) userProfile.phone = phone;
  if (avatar !== undefined) userProfile.avatar = avatar;

  res.json({
    message: "Profile updated successfully",
    user: userProfile
  });
});

// Update user preferences
router.put("/user/:id/preferences", (req, res) => {
  if (req.params.id !== userProfile.id) {
    return res.status(404).json({ error: "User not found" });
  }

  const { notifications, darkMode, language } = req.body;

  if (notifications !== undefined) userProfile.preferences.notifications = notifications;
  if (darkMode !== undefined) userProfile.preferences.darkMode = darkMode;
  if (language) userProfile.preferences.language = language;

  res.json({
    message: "Preferences updated successfully",
    preferences: userProfile.preferences
  });
});

// Update user stats
router.put("/user/:id/stats", (req, res) => {
  if (req.params.id !== userProfile.id) {
    return res.status(404).json({ error: "User not found" });
  }

  const { problemsSolved, streakDays, totalPoints } = req.body;

  if (problemsSolved !== undefined) userProfile.stats.problemsSolved = problemsSolved;
  if (streakDays !== undefined) userProfile.stats.streakDays = streakDays;
  if (totalPoints !== undefined) userProfile.stats.totalPoints = totalPoints;

  res.json({
    message: "Stats updated successfully",
    stats: userProfile.stats
  });
});

// Change password
router.post("/user/:id/change-password", (req, res) => {
  if (req.params.id !== userProfile.id) {
    return res.status(404).json({ error: "User not found" });
  }

  const { currentPassword, newPassword } = req.body;

  // In production, verify current password hash and update with new password hash
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current password and new password are required" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  res.json({ message: "Password changed successfully" });
});

// Delete account
router.delete("/user/:id", (req, res) => {
  if (req.params.id !== userProfile.id) {
    return res.status(404).json({ error: "User not found" });
  }

  // In production, soft delete or permanently remove from database
  res.json({ message: "Account deleted successfully" });
});

module.exports = router;
