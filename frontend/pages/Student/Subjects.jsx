import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import { FiBook, FiClock, FiBarChart2, FiAward } from 'react-icons/fi';
import { format } from 'date-fns';

const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/api/students/subjects');
        const subjectsWithStats = await Promise.all(
          res.data.map(async (subject) => {
            try {
              const testRes = await api.get(`/api/tests/subject/${subject._id}`);
              const tests = testRes.data;
              
              if (tests.length === 0) {
                return {
                  ...subject,
                  lastTestDate: null,
                  averageScore: null,
                  bestScore: null
                };
              }

              const scores = tests.map(test => (test.score / test.totalQuestions) * 100);
              const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
              const bestScore = Math.max(...scores);
              const lastTestDate = tests[0].createdAt; // Assuming tests are sorted by date

              return {
                ...subject,
                lastTestDate,
                averageScore: Math.round(averageScore),
                bestScore: Math.round(bestScore)
              };
            } catch (error) {
              console.error(`Error fetching tests for subject ${subject._id}:`, error);
              return {
                ...subject,
                lastTestDate: null,
                averageScore: null,
                bestScore: null
              };
            }
          })
        );
        
        setSubjects(subjectsWithStats);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) return <LoadingSpinner />;

  const formatTestDate = (dateString) => {
    if (!dateString) return 'Not taken yet';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatScore = (score) => {
    return score !== null ? `${score}%` : '--%';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Dashboard</h1>
          <p className="text-lg text-gray-600">Select a subject to begin your mock test</p>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mb-4">
              <FiBook className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No subjects available</h3>
            <p className="mt-1 text-sm text-gray-500">Your course subjects will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(subject => (
              <div 
                key={subject._id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                      <FiBook className="h-6 w-6 text-purple-600" />
                    </div>
                    <h2 className="ml-4 text-xl font-semibold text-gray-900">{subject.title}</h2>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiClock className="mr-2 text-gray-400" />
                      <span>Last test: {formatTestDate(subject.lastTestDate)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiBarChart2 className="mr-2 text-gray-400" />
                      <span>Average score: {formatScore(subject.averageScore)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiAward className="mr-2 text-gray-400" />
                      <span>Best score: {formatScore(subject.bestScore)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/student/mock-test/${subject._id}`)}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Take Mock Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSubjects;