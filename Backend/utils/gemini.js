const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateTestQuestions = async (subjectTitle) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Generate 5 multiple choice questions about ${subjectTitle} with 4 options each and mark the correct answer. Format as JSON array like this: [{
      "question": "What is...",
      "options": ["Option1", "Option2", "Option3", "Option4"],
      "correctAnswer": "Option2"
    }]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text.trim());
  } catch (err) {
    console.error('AI generation error:', err);
    throw new Error('Failed to generate questions');
  }
};

module.exports = generateTestQuestions;