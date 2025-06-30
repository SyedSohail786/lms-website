const Test = require('../models/Test');

exports.submitTest = async (req, res) => {
  try {
    const { subject, questions } = req.body;
    
    let score = 0;
    questions.forEach(q => {
      if (q.selectedAnswer === q.correctAnswer) score++;
    });

    const test = await Test.create({
      student: req.user.id,
      subject,
      questions,
      score,
      totalQuestions: questions.length
    });

    res.json({ message: 'Test submitted', test });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTestHistory = async (req, res) => {
  try {
    const tests = await Test.find({ student: req.user.id })
      .populate('subject')
      .sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find({});
    res.json(tests);
  } catch (err) {
    console.error("Error getting all tests:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
};