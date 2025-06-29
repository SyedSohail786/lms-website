import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import LoadingSpinner from '../../src/components/LoadingSpinner';

const StudentSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/api/students/subjects');
        setSubjects(res.data);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) return <LoadingSpinner/>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-700">
        Your Subjects
      </h1>
      
      {subjects.length === 0 ? (
        <p className="text-center">No subjects found for your course</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map(subject => (
            <div key={subject._id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">{subject.title}</h2>
              <button
                className="mt-4 w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
                onClick={() => navigate(`/student/mock-test/${subject._id}`)}
              >
                Take Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSubjects;