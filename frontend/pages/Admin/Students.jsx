import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { FaTrash, FaUserGraduate, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../../src/components/LoadingSpinner';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const fetchStudents = async () => {
    try {
      const res = await api.get('/api/students/all');
      setStudents(res.data);
    } catch (err) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.delete(`/api/students/del/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      toast.success('Student deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term
  const filteredStudents = students.filter(student => {
    const searchContent = `${student.name} ${student.email} ${student.course?.title || ''}`.toLowerCase();
    return searchContent.includes(searchTerm.toLowerCase());
  });

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftBound = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const rightBound = Math.min(totalPages, leftBound + maxVisiblePages - 1);

      if (leftBound > 1) {
        pageNumbers.push(1);
        if (leftBound > 2) {
          pageNumbers.push('...');
        }
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pageNumbers.push(i);
      }

      if (rightBound < totalPages) {
        if (rightBound < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 gap-3 sm:gap-0">
        <div className="text-xs sm:text-sm text-gray-700">
          Showing <span className="font-medium">{indexOfFirstStudent + 1}</span> to{' '}
          <span className="font-medium">
            {Math.min(indexOfLastStudent, filteredStudents.length)}
          </span>{' '}
          of <span className="font-medium">{filteredStudents.length}</span> students
        </div>

        <div className="flex flex-wrap justify-center space-x-1 sm:space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FaChevronLeft className="inline" />
          </motion.button>

          {pageNumbers.map((number, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: number !== '...' ? 1.1 : 1 }}
              whileTap={{ scale: number !== '...' ? 0.9 : 1 }}
              onClick={() => typeof number === 'number' ? paginate(number) : null}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm ${
                currentPage === number
                  ? 'bg-indigo-600 text-white'
                  : number === '...'
                  ? 'bg-white text-gray-400 cursor-default'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
              disabled={number === '...'}
            >
              {number}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FaChevronRight className="inline" />
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center">
            <FaUserGraduate className="text-xl sm:text-2xl md:text-3xl text-indigo-600 mr-2 sm:mr-3" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Students Dashboard</h1>
          </div>

          <div className="relative w-full sm:w-64 md:w-80">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-12 sm:py-16"
          >
            <LoadingSpinner />
          </motion.div>
        ) : filteredStudents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center"
          >
            <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded-full bg-indigo-100 mb-3 sm:mb-4">
              <FaUserGraduate className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
              {searchTerm ? "No matching students" : "No students found"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search" : "Add students to get started"}
            </p>
          </motion.div>
        ) : (
          <div>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                        <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {currentStudents.map((student) => (
                          <motion.tr
                            key={student._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm sm:text-base">
                                  {student.name.charAt(0)}
                                </div>
                                <div className="ml-3 sm:ml-4">
                                  <div className="text-sm sm:text-base font-medium text-gray-900">{student.name}</div>
                                  <div className="text-xs sm:text-sm text-gray-500 capitalize">{student.role}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{student.email}</td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-xs sm:text-sm text-gray-900">{student.course?.title || 'N/A'}</div>
                              <div className="text-xs text-gray-500">{student.course?.level || ''}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{student.course?.instructor || 'N/A'}</td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                              {new Date(student.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(student._id)}
                                className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition inline-flex items-center justify-center"
                                title="Delete student"
                              >
                                <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </motion.div>
              <Pagination />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              <AnimatePresence>
                {currentStudents.map((student) => (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-sm sm:text-base mr-2 sm:mr-3">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-medium text-gray-900">{student.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(student._id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition"
                        title="Delete student"
                      >
                        <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.button>
                    </div>
                    <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Course:</span>{' '}
                        <span className="text-gray-600">{student.course?.title || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Instructor:</span>{' '}
                        <span className="text-gray-600">{student.course?.instructor || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Level:</span>{' '}
                        <span className="text-gray-600">{student.course?.level || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Registered:</span>{' '}
                        <span className="text-gray-600">
                          {new Date(student.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Pagination />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Students;