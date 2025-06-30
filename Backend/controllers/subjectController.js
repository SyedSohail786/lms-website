const Subject = require('../models/Subject');

exports.createSubject = async (req, res) => {
  try {
    const { title, course } = req.body;
    const subject = await Subject.create({ 
      title, 
      course,
      createdBy: req.user.id
    });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSubjectsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const subjects = await Subject.find({ course: courseId });
    res.json(subjects);
  } catch (err) {
  console.error("Error in [function name]:", err.message);
  res.status(500).json({ message: 'Server error' });
}
};

exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Subject.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    await Subject.findByIdAndDelete(id);
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add this to your subjectController.js
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects); // Returns array of subjects directly
  } catch (err) {
    console.error("Error getting all subjects:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};