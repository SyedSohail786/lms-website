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


// Get all enrolled students with pagination and search
exports.getAllEnrolledStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { studentEmail: { $regex: search, $options: 'i' } },
        { courseTitle: { $regex: search, $options: 'i' } },
        { courseCategory: { $regex: search, $options: 'i' } }
      ];
    }

    const enrolledStudents = await EnrolledStudent.find(query)
      .sort({ enrolledAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('studentId', 'name email')
      .populate('course', 'title thumbnail');

    const count = await EnrolledStudent.countDocuments(query);

    res.json({
      enrolledStudents,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalEnrollments: count
    });
  } catch (error) {
    console.error('Error fetching enrolled students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get enrollment statistics
exports.getEnrollmentStats = async (req, res) => {
  try {
    const totalEnrollments = await EnrolledStudent.countDocuments();
    const enrollmentsByCategory = await EnrolledStudent.aggregate([
      { $group: { _id: '$courseCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const recentEnrollments = await EnrolledStudent.find()
      .sort({ enrolledAt: -1 })
      .limit(5)
      .populate('course', 'title');

    res.json({
      totalEnrollments,
      enrollmentsByCategory,
      recentEnrollments
    });
  } catch (error) {
    console.error('Error fetching enrollment stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove enrollment
exports.removeEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await EnrolledStudent.findByIdAndDelete(id);
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    res.json({ message: 'Enrollment removed successfully' });
  } catch (error) {
    console.error('Error removing enrollment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};