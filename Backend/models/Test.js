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
  totalQuestions: { type: Number, required: true },
  percentageScore: { type: Number } // Added field
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate percentage score before saving
testSchema.pre('save', function(next) {
  this.percentageScore = Math.round((this.score / this.totalQuestions) * 100);
  next();
});

module.exports = mongoose.model('Test', testSchema);