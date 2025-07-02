const express = require('express');
const router = express.Router();
const { 
  registerStudent, 
  loginStudent, 
  logoutStudent, 
  getStudentSubjects,
  getStudent,
  getAllStudents,
  deleteStudentById
} = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/logout', logoutStudent);
router.get('/subjects', auth(['student']), getStudentSubjects);
router.get('/me', auth(['student']), getStudent);
router.get('/all', getAllStudents);
router.delete('/del/:id', auth(['admin']), deleteStudentById);

module.exports = router;