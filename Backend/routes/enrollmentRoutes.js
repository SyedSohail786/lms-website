const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { enrollStudent, getEnrollmentStatus, getAllEnrolledStudents, getEnrollmentStats, removeEnrollment } = require('../controllers/enrollmentController');

// Route: POST /api/enroll/:courseId
router.post('/enroll/:courseId', auth(['student']), enrollStudent);
router.get('/status/:courseId', auth(['student']), getEnrollmentStatus );
router.get('/get-all', auth(['admin']), getAllEnrolledStudents);
router.get('/stats', auth(['admin']), getEnrollmentStats);
router.delete('/delete/:id', auth(['admin']), removeEnrollment);

module.exports = router;
