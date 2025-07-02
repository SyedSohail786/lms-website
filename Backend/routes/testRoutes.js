const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const { 
  submitTest, 
  getTestHistory, 
  getAllTests 
} = require('../controllers/testController');

const { generateQuestions } = require('../controllers/aiController');

router.get('/', auth(['admin']), getAllTests);
router.post('/submit', auth(['student']), submitTest);
router.get('/history', auth(['student']), getTestHistory);
router.post('/generate', auth(['student']), generateQuestions);

module.exports = router;