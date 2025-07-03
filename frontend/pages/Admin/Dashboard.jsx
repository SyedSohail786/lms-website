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
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { FiUsers, FiBook, FiPieChart, FiAward, FiLayers } from 'react-icons/fi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#7e22ce', '#ef4444'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    subjects: 0,
    students: 0,
    tests: 0,
    enrollments: 0,
    enrollmentsData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesRes, subjectsRes, studentsRes, testsRes, enrollmentsRes] = await Promise.all([
          api.get('/api/courses'),
          api.get('/api/subjects'),
          api.get('/api/students/all'),
          api.get('/api/tests'),
          api.get('api/get-all') 
        ]);

        setStats({
          courses: Array.isArray(coursesRes?.data) ? coursesRes.data.length : 0,
          subjects: Array.isArray(subjectsRes?.data) ? subjectsRes.data.length : 0,
          students: Array.isArray(studentsRes?.data) ? studentsRes.data.length : 0,
          tests: Array.isArray(testsRes?.data) ? testsRes.data.length : 0,
          enrollments: enrollmentsRes?.data?.totalEnrollments || 0,
          enrollmentsData: enrollmentsRes?.data?.enrolledStudents || []
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

  // Transform enrollment data for charts
  const getEnrollmentsByCategory = () => {
    const categoryMap = {};
    
    stats.enrollmentsData.forEach(enrollment => {
      const category = enrollment.courseCategory;
      categoryMap[category] = (categoryMap[category] || 0) + 1;
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    })).sort((a, b) => b.value - a.value);
  };

  const barChartData = [
    { name: 'Courses', count: stats.courses },
    { name: 'Subjects', count: stats.subjects },
    { name: 'Students', count: stats.students },
    { name: 'Tests', count: stats.tests },
    { name: 'Enrollments', count: stats.enrollments }
  ];

  const pieChartData = getEnrollmentsByCategory();

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm sm:text-base">
          {error}
        </div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8"
    >
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-purple-700">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <FiBook size={20} />
            </div>
            <div className="ml-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700">Courses</h2>
              <p className="text-2xl sm:text-3xl font-bold text-indigo-600">{stats.courses}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiLayers size={20} />
            </div>
            <div className="ml-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700">Subjects</h2>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.subjects}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiUsers size={20} />
            </div>
            <div className="ml-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700">Students</h2>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.students}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiAward size={20} />
            </div>
            <div className="ml-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700">Tests</h2>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.tests}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiPieChart size={20} />
            </div>
            <div className="ml-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-700">Enrollments</h2>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.enrollments}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Platform Overview Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">Platform Overview</h3>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                />
                <YAxis 
                  allowDecimals={false} 
                  tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#7e22ce" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Enrollments by Category Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">Enrollments by Category</h3>
          {pieChartData.length > 0 ? (
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={window.innerWidth < 640 ? 80 : 100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    className='text-xs sm:text-sm'
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} enrollments`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
              <p className="text-gray-500">No enrollment data available by category</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Top Categories List */}
      {pieChartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white p-4 sm:p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">Top Categories</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pieChartData.slice(0, 6).map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                className="p-3 sm:p-4 border rounded-lg flex items-center"
              >
                <div 
                  className="w-3 h-3 rounded-full mr-3" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{category.name}</h4>
                  <p className="text-sm text-gray-500">{category.value} enrollments</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminDashboard;