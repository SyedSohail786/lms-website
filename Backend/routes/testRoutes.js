const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const { 
  submitTest, 
  getTestHistory, 
  getAllTests, 
  getTestResult
} = require('../controllers/testController');

const { generateQuestions } = require('../controllers/aiController');

router.get('/', auth(['admin']), getAllTests);
router.post('/submit', auth(['student']), submitTest);
router.get('/history', auth(['student']), getTestHistory);
router.post('/generate', auth(['student']), generateQuestions);
router.get("/subject/:subjectId", auth(['student']), getTestResult);

module.exports = router;