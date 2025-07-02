import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { format } from 'date-fns';
import LoadingSpinner from '../LoadingSpinner';

const TestResults = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTest, setExpandedTest] = useState(null);

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

  const toggleExpand = (testId) => {
    setExpandedTest(expandedTest === testId ? null : testId);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Test Results</h1>
        <p className="text-gray-500">Review your performance and progress</p>
      </div>

      {tests.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">No test results found</h3>
          <p className="text-gray-500">Complete a test to see your results here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tests.map((test) => (
            <div 
              key={test._id} 
              className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      test.score / test.totalQuestions >= 0.7 ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <h2 className="text-lg font-semibold text-gray-800">{test.subject?.title || 'Unknown Subject'}</h2>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {format(new Date(test.createdAt), 'MMM dd, yyyy')}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {format(new Date(test.createdAt), 'hh:mm a')}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      {test.totalQuestions} questions
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`text-2xl font-bold ${
                    test.score / test.totalQuestions >= 0.7 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.round((test.score / test.totalQuestions) * 100)}%
                  </div>
                  <button 
                    onClick={() => toggleExpand(test._id)}
                    className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    aria-label={expandedTest === test._id ? 'Collapse details' : 'Expand details'}
                  >
                    <svg 
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        expandedTest === test._id ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {expandedTest === test._id && (
                <div className="mt-6 pt-6 border-t border-gray-100 animate-fadeIn">
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Score</span>
                      <span className="text-sm font-medium text-gray-700">
                        {test.score} / {test.totalQuestions}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          test.score / test.totalQuestions >= 0.7 ? 'bg-green-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${(test.score / test.totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {test.questions.map((q, i) => (
                      <div 
                        key={i} 
                        className={`p-4 rounded-lg ${
                          q.selectedAnswer === q.correctAnswer 
                            ? 'bg-green-50 border border-green-100' 
                            : 'bg-red-50 border border-red-100'
                        }`}
                      >
                        <p className="font-medium text-gray-800 mb-2">{i + 1}. {q.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className={`p-2 rounded ${
                            q.selectedAnswer === q.correctAnswer
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            <span className="font-medium">Your answer:</span> {q.selectedAnswer || 'Not answered'}
                          </div>
                          <div className="bg-gray-100 p-2 rounded text-gray-800">
                            <span className="font-medium">Correct answer:</span> {q.correctAnswer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestResults;