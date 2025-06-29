// backend/controllers/authController.js
const Admin = require('../models/Admin');
const Student = require('../models/Student');

exports.getCurrentUser = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const admin = await Admin.findById(req.user.id).select('-password');
      if (!admin) return res.status(404).json({ message: 'User not found' });
      return res.json({ role: 'admin', email: admin.email });
    } else if (req.user.role === 'student') {
      const student = await Student.findById(req.user.id).select('-password');
      if (!student) return res.status(404).json({ message: 'User not found' });
      return res.json({ role: 'student', email: student.email });
    }
    res.status(403).json({ message: 'Invalid role' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};