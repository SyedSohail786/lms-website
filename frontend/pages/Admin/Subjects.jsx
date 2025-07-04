import { useState, useEffect } from 'react';
import api from '../../utils/api';
import SubjectList from '../../src/components/Subjects/SubjectList';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { FaBook, FaPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const AdminSubjects = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/courses');
        setCourses(res.data);
        if (res.data.length > 0) {
          setSelectedCourse(res.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center"
          >
            <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded-full bg-indigo-100 mb-3 sm:mb-4">
              <FaBook className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
              No courses found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-4">
              Add courses to start managing subjects
            </p>
            <button
              onClick={() => navigate('/admin/courses')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaPlus className="-ml-1 mr-2 h-4 w-4" />
              Create New Course
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Prepare options for react-select
  const courseOptions = courses.map(course => ({
    value: course._id,
    label: course.title
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center">
            <FaBook className="text-xl sm:text-2xl md:text-3xl text-indigo-600 mr-2 sm:mr-3" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Manage Subjects</h1>
          </div>

          <Select
            options={courseOptions}
            value={courseOptions.find(option => option.value === selectedCourse)}
            onChange={(selectedOption) => setSelectedCourse(selectedOption.value)}
            className="w-full sm:w-64"
            classNamePrefix="select"
            placeholder="Select a course..."
            isSearchable
          />
        </div>

        {selectedCourse && <SubjectList courseId={selectedCourse} />}
      </motion.div>
    </div>
  );
};

export default AdminSubjects;
