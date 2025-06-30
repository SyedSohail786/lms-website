import { useEffect, useState } from 'react';
import api from '../../utils/api';
import LoadingSpinner from '../../src/components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    subjects: 0,
    students: 0,
    tests: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesRes, subjectsRes, studentsRes, testsRes] = await Promise.all([
          api.get('/api/courses'),
          api.get('/api/subjects'),
          api.get('/api/students'),
          api.get('/api/tests')
        ]);

        // More robust response handling
        setStats({
          courses: Array.isArray(coursesRes?.data) ? coursesRes.data.length : 0,
          subjects: Array.isArray(subjectsRes?.data) ? subjectsRes.data.length : 0,
          students: Array.isArray(studentsRes?.data) ? studentsRes.data.length : 0,
          tests: Array.isArray(testsRes?.data) ? testsRes.data.length : 0
        });
      } catch (err) {
        setError('Failed to fetch statistics. Please try again later.');
        console.error('API Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner/>
  if (error) return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-purple-700">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-700">Courses</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.courses}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-700">Subjects</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.subjects}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-700">Students</h2>
          <p className="text-3xl font-bold text-green-600">{stats.students}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold text-gray-700">Tests Taken</h2>
          <p className="text-3xl font-bold text-yellow-600">{stats.tests}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;