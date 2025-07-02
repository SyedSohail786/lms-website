const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { enrollStudent, getEnrollmentStatus } = require('../controllers/enrollmentController');

// Route: POST /api/enroll/:courseId
router.post('/enroll/:courseId', auth(['student']), enrollStudent);
router.get('/status/:courseId', auth(['student']), getEnrollmentStatus );

module.exports = router;
