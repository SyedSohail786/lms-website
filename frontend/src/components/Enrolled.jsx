import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiSearch, FiChevronDown, FiChevronUp, FiUsers, FiBook, FiPieChart } from 'react-icons/fi';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';

const Enrolled = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedEnrollment, setExpandedEnrollment] = useState(null);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [enrollmentsRes, statsRes] = await Promise.all([
          api.get(`/api/get-all?page=${currentPage}&limit=${limit}&search=${searchTerm}`),
          api.get('/api/stats')
        ]);
        
        setEnrollments(enrollmentsRes.data.enrolledStudents);
        setTotalPages(enrollmentsRes.data.totalPages);
        setStats(statsRes.data);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to fetch enrollment data');
        console.error('Error:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm, limit]);

  const handleRemoveEnrollment = async (id) => {
    if (!window.confirm('Are you sure you want to remove this enrollment?')) return;
    
    try {
      await api.delete(`/api/delete/${id}`);
      setEnrollments(prev => prev.filter(e => e._id !== id));
      toast.success('Enrollment removed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove enrollment');
      console.error('Error:', err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedEnrollment(expandedEnrollment === id ? null : id);
  };

  if (loading && !enrollments.length) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <FiUsers size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-500">Total Enrollments</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FiBook size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-500">Top Category</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.enrollmentsByCategory[0]?._id || 'N/A'}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FiPieChart size={24} />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-500">Categories</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.enrollmentsByCategory.length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Search and Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Enrolled Students</h1>
            <p className="text-gray-500 mt-1">Manage all student enrollments</p>
          </div>
          
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search enrollments..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Enrollments Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {enrollments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100 mb-4">
                <FiUsers className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-1">
                {searchTerm ? "No matching enrollments" : "No enrollments found"}
              </h4>
              <p className="text-gray-500">
                {searchTerm ? "Try adjusting your search" : "Students will appear here when they enroll"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrolled On
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {enrollments.map((enrollment) => (
                      <motion.tr
                        key={enrollment._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                              {enrollment.studentName.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{enrollment.studentName}</div>
                              <div className="text-sm text-gray-500">{enrollment.studentEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{enrollment.courseTitle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {enrollment.courseCategory}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleExpand(enrollment._id)}
                              className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                            >
                              {expandedEnrollment === enrollment._id ? (
                                <FiChevronUp size={18} />
                              ) : (
                                <FiChevronDown size={18} />
                              )}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRemoveEnrollment(enrollment._id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                            >
                              <FiTrash2 size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Enrolled;