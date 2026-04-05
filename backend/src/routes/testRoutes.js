const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: "Backend running clean" });
});

module.exports = router;
