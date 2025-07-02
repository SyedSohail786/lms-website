import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiChevronDown, FiChevronUp, FiEye, FiSearch } from 'react-icons/fi';
import api from '../../../utils/api';
import CourseForm from './CourseForm';
import LoadingSpinner from '../LoadingSpinner';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/api/courses');
        setCourses(data);
      } catch (err) {
        toast.error('Failed to load courses');
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const searchContent = `${course.title} ${course.instructor} ${course.category}`.toLowerCase();
    return searchContent.includes(searchTerm.toLowerCase());
  });

  const handleCreate = async (formData) => {
    try {
      const { data } = await api.post('/api/courses', formData);
      setCourses(prev => [data, ...prev]);
      setEditingCourse(null);
      toast.success('Course created successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
      console.error('Failed to create course:', err);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const { data } = await api.put(`/api/courses/${editingCourse._id}`, formData);
      setCourses(prev => prev.map(c => c._id === data._id ? data : c));
      setEditingCourse(null);
      setExpandedCourse(null);
      toast.success('Course updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update course');
      console.error('Failed to update course:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await api.delete(`/api/courses/${id}`);
      setCourses(prev => prev.filter(c => c._id !== id));
      toast.success('Course deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
      console.error('Failed to delete course:', err);
    }
  };

  const toggleExpand = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Course Management</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage all courses in your platform</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditingCourse({})}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              <FiPlus size={18} /> Add Course
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {editingCourse && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            >
              <CourseForm 
                initialData={editingCourse} 
                onSubmit={editingCourse._id ? handleUpdate : handleCreate}
                onCancel={() => setEditingCourse(null)}
                setEditingCourse={setEditingCourse}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
        >
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              All Courses <span className="text-gray-500">({filteredCourses.length})</span>
            </h3>
          </div>
          
          {filteredCourses.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="mx-auto h-12 sm:h-16 w-12 sm:w-16 flex items-center justify-center rounded-full bg-indigo-100 mb-3 sm:mb-4">
                <FiEye className="h-5 w-5 sm:h-8 sm:w-8 text-indigo-600" />
              </div>
              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
                {searchTerm ? "No matching courses" : "No courses found"}
              </h4>
              <p className="text-gray-500 mb-4 text-sm sm:text-base">
                {searchTerm ? "Try adjusting your search" : "Create your first course"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditingCourse({})}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base"
              >
                <FiPlus className="inline mr-2" />
                Add Course
              </motion.button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredCourses.map(course => (
                  <motion.li
                    key={course._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center min-w-0">
                          <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                            {course.title.charAt(0)}
                          </div>
                          <div className="ml-3 sm:ml-4 min-w-0">
                            <h4 className="text-base sm:text-lg font-medium text-gray-900 truncate">
                              {course.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                              <span className="text-xs sm:text-sm text-gray-500">{course.instructor}</span>
                              <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">•</span>
                              <span className="text-xs sm:text-sm text-gray-500">{course.category}</span>
                              <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">•</span>
                              <span className="text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                {course.level}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end sm:justify-normal gap-1 sm:gap-2 sm:ml-4">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditingCourse(course)}
                            className="p-1.5 sm:p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-50"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(course._id)}
                            className="p-1.5 sm:p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleExpand(course._id)}
                            className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
                          >
                            {expandedCourse === course._id ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                          </motion.button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedCourse === course._id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Description</h5>
                                <p className="text-gray-600 text-sm sm:text-base">{course.description}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Details</h5>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                  <div>
                                    <p className="text-xs sm:text-sm text-gray-500">Duration</p>
                                    <p className="font-medium text-sm sm:text-base">{course.duration?.value} {course.duration?.unit}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs sm:text-sm text-gray-500">Rating</p>
                                    <p className="font-medium text-sm sm:text-base">{course.rating}/5</p>
                                  </div>
                                  <div>
                                    <p className="text-xs sm:text-sm text-gray-500">Students</p>
                                    <p className="font-medium text-sm sm:text-base">{course.students}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs sm:text-sm text-gray-500">Price</p>
                                    <p className="font-medium text-sm sm:text-base">${course.price}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {course.thumbnail && (
                              <div className="mt-3 sm:mt-4">
                                <h5 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Thumbnail</h5>
                                <img 
                                  src={course.thumbnail} 
                                  alt="Course thumbnail" 
                                  className="h-32 sm:h-40 rounded-lg object-cover border"
                                />
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CourseList;