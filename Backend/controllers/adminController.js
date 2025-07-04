const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.json({ message: 'Email already exists' });

    const admin = await Admin.create({ name, email, password });
    const token = generateToken(admin._id, 'admin');

    res.cookie('aToken', token, { 
      // httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(admin._id, 'admin');

    res.cookie('aToken', token, { 
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
  res.clearCookie('aToken', { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: "None",
    path: '/'
  }).json({ message: 'Logged out' });
};

exports.getAdmin = (req, res) => {
  res.json({ role: req.user.role, email: req.user.email });
};
