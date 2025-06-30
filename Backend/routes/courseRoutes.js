const express = require('express');
const router = express.Router();
const { 
  createCourse, 
  getCourses, 
  updateCourse, 
  deleteCourse, 
  getSingleCourses
} = require('../controllers/courseController');
const auth = require('../middleware/auth');

router.post('/', auth(['admin']), createCourse);
router.get('/', getCourses);
router.get('/:id', getSingleCourses);
router.put('/:id', auth(['admin']), updateCourse);
router.delete('/:id', auth(['admin']), deleteCourse);

module.exports = router;