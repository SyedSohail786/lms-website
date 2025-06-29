// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { getCurrentUser } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.get('/me', auth(['admin', 'student']), getCurrentUser);

module.exports = router;