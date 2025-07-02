import { useEffect, useState } from 'react';
import api from '../../utils/api';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

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
          api.get('/api/students/all'),
          api.get('/api/tests')
        ]);

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

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      </div>
    );

  const chartData = [
    { name: 'Courses', count: stats.courses },
    { name: 'Subjects', count: stats.subjects },
    { name: 'Students', count: stats.students },
    { name: 'Tests', count: stats.tests }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8"
    >
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-purple-700">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">Courses</h2>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.courses}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">Subjects</h2>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.subjects}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">Students</h2>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.students}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">Tests Taken</h2>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.tests}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">Summary Graph</h3>
        <ResponsiveContainer width="100%" height={250} sm={{ height: 300 }}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} sm={{ fontSize: 14 }} />
            <YAxis allowDecimals={false} fontSize={12} sm={{ fontSize: 14 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#7e22ce" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;