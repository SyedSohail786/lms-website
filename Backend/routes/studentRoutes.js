const express = require('express');
const router = express.Router();
const { 
  registerStudent, 
  loginStudent, 
  logoutStudent, 
  getStudentSubjects,
  getStudent,
  getAllStudents
} = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/logout', logoutStudent);
router.get('/', auth(['admin']), getAllStudents);
router.get('/subjects', auth(['student']), getStudentSubjects);
router.get('/me', auth(['student']), getStudent);

module.exports = router;