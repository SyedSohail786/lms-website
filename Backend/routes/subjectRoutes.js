const express = require('express');
const router = express.Router();
const { 
  createSubject, 
  getSubjectsByCourse, 
  updateSubject, 
  deleteSubject, 
  getAllSubjects
} = require('../controllers/subjectController');
const auth = require('../middleware/auth');

router.post('/', auth(['admin']), createSubject);
router.get('/', auth(['admin', 'student']), getAllSubjects); 
router.get('/:courseId', auth(['admin', 'student']), getSubjectsByCourse);
router.put('/:id', auth(['admin']), updateSubject);
router.delete('/:id', auth(['admin']), deleteSubject);

module.exports = router;