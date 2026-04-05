const express = require('express');
const router = express.Router();
const { solveProblem } = require('../controllers/solveController');
const upload = require('../middleware/upload');

router.post('/solve', upload.single('image'), solveProblem);

module.exports = router;