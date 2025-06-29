import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const MockTest = () => {
  const { subjectId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const generateTest = async () => {
      try {
        const res = await api.post('/api/tests/generate', { subjectId });
        const questionsWithSelection = res.data.map(q => ({
          ...q,
          selectedAnswer: ''
        }));
        setQuestions(questionsWithSelection);
      } catch (err) {
        console.error('Failed to generate test:', err);
        navigate('/student/subjects');
      } finally {
        setLoading(false);
      }
    };
    generateTest();
  }, [subjectId, navigate]);

  const handleAnswerSelect = (questionIndex, answer) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].selectedAnswer = answer;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    if (questions.some(q => !q.selectedAnswer)) {
      alert('Please answer all questions before submitting');
      return;
    }

    try {
      const res = await api.post('/api/tests/submit', {
        subject: subjectId,
        questions
      });
      setScore(res.data.test.score);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit test:', err);
    }
  };

  if (loading) return <div>Loading test...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Mock Test
      </h1>

      {questions.map((question, index) => (
        <div key={index} className="mb-6 p-4 border rounded shadow bg-white">
          <p className="font-semibold mb-2">
            Q{index + 1}. {question.question}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {question.options.map((option, i) => (
              <label
                key={i}
                className={`px-4 py-2 border rounded cursor-pointer ${
                  question.selectedAnswer === option
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name={`q-${index}`}
                  value={option}
                  checked={question.selectedAnswer === option}
                  onChange={() => handleAnswerSelect(index, option)}
                  className="hidden"
                  disabled={submitted}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
          onClick={handleSubmit}
        >
          Submit Test
        </button>
      ) : (
        <div className="text-center mt-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold text-green-600 mb-2">
            Your Score: {score} / {questions.length}
          </h2>
          <button
            className="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
            onClick={() => navigate('/student/results')}
          >
            View All Results
          </button>
        </div>
      )}
    </div>
  );
};

export default MockTest;