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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesRes, subjectsRes, studentsRes, testsRes] = await Promise.all([
          api.get('/api/courses'),
          api.get('/api/subjects/all'),
          api.get('/api/students/all'),
          api.get('/api/tests/all')
        ]);
        
        setStats({
          courses: coursesRes.data.length,
          subjects: subjectsRes.data.length,
          students: studentsRes.data.length,
          tests: testsRes.data.length
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner/>

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