const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  selectedAnswer: { type: String }
});

const testSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  questions: [questionSchema],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);