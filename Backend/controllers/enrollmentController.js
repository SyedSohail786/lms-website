const EnrolledStudent = require('../models/EnrolledStudent');
const Course = require('../models/Course');
const Student = require('../models/Student');

exports.enrollStudent = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check if already enrolled
    const alreadyEnrolled = await EnrolledStudent.findOne({
      studentEmail: student.email,
      course: course._id
    });
    if (alreadyEnrolled) return res.status(400).json({ message: 'Already enrolled in this course' });

    const newEnrollment = new EnrolledStudent({
      studentName: student.name,
      studentEmail: student.email,
      course: course._id,
      courseTitle: course.title,
      courseCategory: course.category,
      studentId: student._id,
    });

    await newEnrollment.save();

    res.status(201).json({ success: true, message: 'Enrolled successfully' });
  } catch (err) {
    console.error('Enrollment error:', err.message);
    res.status(500).json({ message: 'Server error during enrollment' });
  }
};


// routes/enroll.js

exports.getEnrollmentStatus = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user.id;
     console.log(req.user)
  const alreadyEnrolled = await EnrolledStudent.findOne({
    course: courseId,
    studentId
  });

  if (alreadyEnrolled) {
    return res.json({ enrolled: true });
  }

  return res.json({ enrolled: false });
}