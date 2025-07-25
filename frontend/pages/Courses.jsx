import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiClock, FiUser, FiStar, FiBookOpen } from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';
import api from '../utils/api'; // Import your API utility
import { toast } from 'react-toastify';
import Select from 'react-select'; // Import react-select

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    duration: 'all'
  });

  // Fetch courses from API
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

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filters.category === 'all' || course.category === filters.category;
    const matchesLevel = filters.level === 'all' || course.level === filters.level;
    const matchesDuration = filters.duration === 'all' || 
                          (filters.duration === 'short' && parseInt(course.duration?.value) <= 6) ||
                          (filters.duration === 'medium' && parseInt(course.duration?.value) > 6 && parseInt(course.duration?.value) <= 10) ||
                          (filters.duration === 'long' && parseInt(course.duration?.value) > 10);

    return matchesSearch && matchesCategory && matchesLevel && matchesDuration;
  });

  // Extract unique categories for filter dropdown
  const categories = ['all', ...new Set(courses.map(course => course.category))];
  const categoryOptions = categories.map(category => ({
    value: category,
    label: category === 'all' ? 'All Categories' : category
  }));

  const levelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  const durationOptions = [
    { value: 'all', label: 'Any Duration' },
    { value: 'short', label: 'Short (≤6 weeks)' },
    { value: 'medium', label: 'Medium (7-10 weeks)' },
    { value: 'long', label: 'Long (>10 weeks)' }
  ];

  const handleFilterChange = (field) => (selectedOption) => {
    setFilters({ ...filters, [field]: selectedOption.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Our Courses</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the perfect course to advance your skills and career
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative w-full sm:w-auto">
                <Select
                  options={categoryOptions}
                  value={categoryOptions.find(option => option.value === filters.category)}
                  onChange={handleFilterChange('category')}
                  className="w-full text-sm sm:text-base"
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
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
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
                      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                      color: state.isSelected ? 'white' : 'black',
                      '&:hover': { backgroundColor: '#eff6ff' },
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      marginLeft: '0.5rem', // Slight offset to align with design
                    }),
                  }}
                  components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator: () => (
                      <div className="pr-2">
                        <FiFilter className="text-gray-400 w-4 h-4" />
                      </div>
                    ),
                  }}
                />
              </div>

              <div className="relative w-full sm:w-auto">
                <Select
                  options={levelOptions}
                  value={levelOptions.find(option => option.value === filters.level)}
                  onChange={handleFilterChange('level')}
                  className="w-full text-sm sm:text-base"
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
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
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
                      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                      color: state.isSelected ? 'white' : 'black',
                      '&:hover': { backgroundColor: '#eff6ff' },
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      marginLeft: '0.5rem', // Slight offset to align with design
                    }),
                  }}
                  components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator: () => (
                      <div className="pr-2">
                        <FiFilter className="text-gray-400 w-4 h-4" />
                      </div>
                    ),
                  }}
                />
              </div>

              <div className="relative w-full sm:w-auto">
                <Select
                  options={durationOptions}
                  value={durationOptions.find(option => option.value === filters.duration)}
                  onChange={handleFilterChange('duration')}
                  className="w-full text-sm sm:text-base"
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
                        borderColor: '#3b82f6',
                        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
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
                      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
                      color: state.isSelected ? 'white' : 'black',
                      '&:hover': { backgroundColor: '#eff6ff' },
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      marginLeft: '0.5rem', // Slight offset to align with design
                    }),
                  }}
                  components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator: () => (
                      <div className="pr-2">
                        <FiClock className="text-gray-400 w-4 h-4" />
                      </div>
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <FiBookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    category: 'all',
                    level: 'all',
                    duration: 'all'
                  });
                }}
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course }) => {
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-300 h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img
          src={course.thumbnail ? `${baseurl}${course.thumbnail}` : 'https://via.placeholder.com/400x225'}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-center mb-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
            course.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {course.level}
          </span>
          <span className="ml-2 text-sm text-gray-500">{course.category}</span>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{course.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <FaChalkboardTeacher className="mr-1" />
          <span className="mr-4">{course.instructor}</span>
          <FiClock className="mr-1" />
          <span>{course.duration?.value} {course.duration?.unit}</span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FiStar className="text-yellow-400 mr-1" />
            <span className="font-medium">{course.rating}</span>
            <span className="text-gray-500 ml-1">({Math.floor(course.students / 100) * 100}+)</span>
          </div>
          <span className="text-sm text-gray-500">
            <FiUser className="inline mr-1" />
            {course.students.toLocaleString()}
          </span>
        </div>
        
        <Link
          to={`/courses/${course._id}`}
          className="mt-auto block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

export default Courses;