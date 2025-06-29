import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { format } from 'date-fns';
import LoadingSpinner from '../LoadingSpinner';

const TestResults = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/api/tests/history');
        setTests(res.data);
      } catch (err) {
        console.error('Failed to fetch test results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <LoadingSpinner/>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Your Test Results
      </h1>

      {tests.length === 0 ? (
        <p className="text-center">No test results found</p>
      ) : (
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{test.subject?.title || 'Unknown Subject'}</h2>
                  <p className="text-sm text-gray-500">
                    Taken on: {format(new Date(test.createdAt), 'dd MMM yyyy, hh:mm a')}
                  </p>
                </div>
                <div className={`text-lg font-bold ${
                  test.score / test.totalQuestions >= 0.7 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {test.score} / {test.totalQuestions}
                </div>
              </div>

              <details className="mt-4">
                <summary className="text-blue-600 cursor-pointer">View Details</summary>
                <div className="mt-2 pl-4 border-l-2 border-gray-200">
                  {test.questions.map((q, i) => (
                    <div key={i} className="mb-3">
                      <p className="font-medium">{q.question}</p>
                      <p className="text-sm">
                        Your answer: <span className={
                          q.selectedAnswer === q.correctAnswer 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }>
                          {q.selectedAnswer}
                        </span>
                      </p>
                      <p className="text-sm">
                        Correct answer: <span className="text-green-600">{q.correctAnswer}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestResults;