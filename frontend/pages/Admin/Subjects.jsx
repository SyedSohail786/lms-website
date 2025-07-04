import { useState, useEffect } from 'react';
import api from '../../utils/api';
import SubjectList from '../../src/components/Subjects/SubjectList';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import { motion } from 'framer-motion';
import Select from 'react-select'; // Import react-select

const AdminSubjects = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);

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

  // Prepare options for react-select
  const courseOptions = courses.map(course => ({
    value: course._id,
    label: course.title
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Manage Subjects</h1>
          {courses.length > 0 ? (
            <Select
              options={courseOptions}
              value={courseOptions.find(option => option.value === selectedCourse)}
              onChange={(selectedOption) => setSelectedCourse(selectedOption.value)}
              className="w-full sm:w-64 text-sm sm:text-base"
              classNamePrefix="react-select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  padding: '0.375rem 0', // Matches py-2
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#e5e7eb' },
                  '&:focus-within': {
                    borderColor: '#6366f1',
                    boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
                  },
                }),
                menu: (provided) => ({
                  ...provided,
                  marginTop: '0',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                }),
                option: (provided, state) => ({
                  ...provided,
                  fontSize: '0.875rem', // text-sm
                  padding: '0.375rem 0.75rem', // py-1.5 px-3
                  backgroundColor: state.isSelected ? '#6366f1' : state.isFocused ? '#eef2ff' : 'white',
                  color: state.isSelected ? 'white' : 'black',
                  '&:hover': { backgroundColor: '#eef2ff' },
                }),
                singleValue: (provided) => ({
                  ...provided,
                  marginLeft: '0.5rem', // Slight offset to align with design
                }),
              }}
              components={{
                IndicatorSeparator: () => null,
              }}
            />
          ): (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center"
          >
            <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded-full bg-indigo-100 mb-3 sm:mb-4">
              <FaUserGraduate className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
           No subjects found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
               Add courses to get started
            </p>
          </motion.div>
        )
        }
        </div>

        {selectedCourse && <SubjectList courseId={selectedCourse} />}
      </motion.div>
    </div>
  );
};

export default AdminSubjects;
