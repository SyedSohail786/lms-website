const express = require('express');
const router = express.Router();
const { 
  submitTest, 
  getTestHistory, 
  getAllTests 
} = require('../controllers/testController');
const { generateQuestions } = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/submit', auth(['student']), submitTest);
router.get('/history', auth(['student']), getTestHistory);
router.get('/all', auth(['admin']), getAllTests);
router.post('/generate', auth(['student']), generateQuestions);

module.exports = router;