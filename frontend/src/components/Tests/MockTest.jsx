import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import LoadingSpinner from '../LoadingSpinner';
import { FiClock, FiCheckCircle, FiXCircle, FiChevronLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

const MockTest = () => {
  const { subjectId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const navigate = useNavigate();

  // Keep your original fetch function exactly as is
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

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0 || submitted) {
      if (timeLeft <= 0 && !submitted) {
        handleSubmit(); // Auto-submit when time runs out
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].selectedAnswer = answer;
    setQuestions(updatedQuestions);
  };

  // Your original submit function with added toast notifications
  const handleSubmit = async () => {
    if (questions.some(q => !q.selectedAnswer)) {
      const confirmSubmit = window.confirm(
        'You have unanswered questions. Are you sure you want to submit?'
      );
      if (!confirmSubmit) return;
    }

    try {
      const res = await api.post('/api/tests/submit', {
        subject: subjectId,
        questions
      });
      setScore(res.data.test.score);
      setSubmitted(true);
      toast.success('Test submitted successfully!');
    } catch (err) {
      console.error('Failed to submit test:', err);
      toast.error('Failed to submit test results');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            <FiChevronLeft className="mr-1" />
            Back
          </button>
          
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
            <FiClock className="text-purple-600 mr-2" />
            <span className="font-medium">Time: {formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Mock Test
            </h1>
            {!submitted && (
              <p className="text-center text-gray-600 mt-2">
                {questions.filter(q => q.selectedAnswer).length} of {questions.length} questions answered
              </p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {questions.map((question, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <span className="bg-purple-100 text-purple-800 font-medium rounded-full px-3 py-1 mr-3">
                    Q{index + 1}
                  </span>
                  <p className="font-medium text-gray-900 flex-1">{question.question}</p>
                </div>
                
                <div className="space-y-3">
                  {question.options.map((option, i) => {
                    const isSelected = question.selectedAnswer === option;
                    const isCorrect = submitted && option === question.correctAnswer;
                    const isWrong = submitted && isSelected && !isCorrect;
                    
                    return (
                      <label
                        key={i}
                        className={`block px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-purple-100 border-purple-300'
                            : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                        } ${
                          submitted && isCorrect ? 'bg-green-50 border-green-300' : ''
                        } ${
                          isWrong ? 'bg-red-50 border-red-300' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name={`q-${index}`}
                            value={option}
                            checked={isSelected}
                            onChange={() => handleAnswerSelect(index, option)}
                            className="hidden"
                            disabled={submitted}
                          />
                          <span className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${
                            isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
                          } ${
                            submitted && isCorrect ? 'bg-green-500 border-green-500' : ''
                          } ${
                            isWrong ? 'bg-red-500 border-red-500' : ''
                          }`}>
                            {submitted && (isCorrect || isWrong) && (
                              isCorrect 
                                ? <FiCheckCircle className="h-3 w-3 text-white" />
                                : <FiXCircle className="h-3 w-3 text-white" />
                            )}
                          </span>
                          <span className={`${submitted && isCorrect ? 'font-medium text-green-700' : ''} ${
                            isWrong ? 'font-medium text-red-700' : ''
                          }`}>
                            {option}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!submitted ? (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md transition-colors"
            >
              Submit Test
            </button>
          </div>
        ) : (
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 text-center">
              <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${
                score / questions.length >= 0.7 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              } mb-4`}>
                <FiCheckCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Test Completed!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Your score: <span className="font-bold">{score} / {questions.length}</span> (
                {Math.round((score / questions.length) * 100)}%)
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/student/subjects')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back to Subjects
                </button>
                <button
                  onClick={() => navigate('/student/results')}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                >
                  View All Results
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockTest;