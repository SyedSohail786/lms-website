const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Subject = require('../models/Subject');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, course } = req.body;
    const exists = await Student.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const student = await Student.create({ name, email, password, course });
    const token = generateToken(student._id, 'student');

    res.cookie('sToken', token, { 
      // httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(student._id, 'student');

    res.cookie('sToken', token, { 
      // httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('sToken', { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: "None",
    path: '/'
  }).json({ message: 'Logged out' });
};

exports.getStudentSubjects = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate('course');
    const subjects = await Subject.find({ course: student.course._id });
    res.json(subjects);
  } catch (err) {
  console.error("Error in [function name]:", err.message);
  res.status(500).json({ message: 'Server error' });
}
};

exports.getStudent = (req, res) => {
  res.json({ role: req.user.role, email: req.user.email });
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('course').select('-password');
    res.json(students);
  } catch (err) {
    console.error("Error in getAllStudents:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStudentById = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
