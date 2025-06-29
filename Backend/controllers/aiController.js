const { GoogleGenAI } = require("@google/genai");
const Subject = require("../models/Subject");
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.generateQuestions = async (req, res) => {
  try {
    const { subjectId } = req.body;
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    await delay(2000); 
const prompt = `
Generate exactly 5 multiple-choice questions on the topic "${subject.title}", it should not include same question when i ask again, every time all 5 questions should be diffent from past ones.
Each question must follow this JSON format:
[
  {
    "question": "What is ...?",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A"
  }
]
Only return the raw JSON array — no extra text, explanation, or markdown.`;

    const response = await genAI.models.generateContent({
      model:"gemini-2.0-flash",
      contents: prompt,
    })


    const text = response.text;


    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Parse clean JSON
    const questions = JSON.parse(cleanText);

    if (!Array.isArray(questions)) {
      throw new Error("Response is not a valid array");
    }

    res.json(questions);
  } catch (err) {
    console.error("AI generation error:", err.message);
    res.status(500).json({
      message: "AI generation failed",
      error: err.message,
    });
  }
};
