import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiClock, FiUser, FiStar, FiBookOpen } from 'react-icons/fi';
import { FaChalkboardTeacher } from 'react-icons/fa';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    duration: 'all'
  });

  // Mock data - replace with real API calls
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          setCourses([
            {
              id: 1,
              title: 'Introduction to Web Development',
              instructor: 'Sarah Johnson',
              category: 'Web Development',
              level: 'Beginner',
              duration: '8 weeks',
              rating: 4.7,
              students: 1250,
              thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build your first websites.'
            },
            {
              id: 2,
              title: 'Advanced Data Science',
              instructor: 'Michael Chen',
              category: 'Data Science',
              level: 'Advanced',
              duration: '12 weeks',
              rating: 4.9,
              students: 890,
              thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              description: 'Master machine learning algorithms and data analysis techniques.'
            },
            {
              id: 3,
              title: 'Mobile App Development with React Native',
              instructor: 'David Wilson',
              category: 'Mobile Development',
              level: 'Intermediate',
              duration: '10 weeks',
              rating: 4.5,
              students: 1500,
              thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              description: 'Build cross-platform mobile apps using React Native framework.'
            },
            {
              id: 4,
              title: 'Digital Marketing Fundamentals',
              instructor: 'Emily Rodriguez',
              category: 'Marketing',
              level: 'Beginner',
              duration: '6 weeks',
              rating: 4.3,
              students: 2100,
              thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              description: 'Learn SEO, social media marketing, and content strategy basics.'
            },
            {
              id: 5,
              title: 'Python for Data Analysis',
              instructor: 'Michael Chen',
              category: 'Data Science',
              level: 'Intermediate',
              duration: '8 weeks',
              rating: 4.6,
              students: 1800,
              thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              description: 'Use Python libraries like Pandas and NumPy for data manipulation.'
            },
            {
              id: 6,
              title: 'UX/UI Design Principles',
              instructor: 'Lisa Wong',
              category: 'Design',
              level: 'Beginner',
              duration: '6 weeks',
              rating: 4.8,
              students: 950,
              thumbnail: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              description: 'Master user experience and interface design fundamentals.'
            }
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
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
                          (filters.duration === 'short' && parseInt(course.duration) <= 6) ||
                          (filters.duration === 'medium' && parseInt(course.duration) > 6 && parseInt(course.duration) <= 10) ||
                          (filters.duration === 'long' && parseInt(course.duration) > 10);

    return matchesSearch && matchesCategory && matchesLevel && matchesDuration;
  });

  // Extract unique categories for filter dropdown
  const categories = ['all', ...new Set(courses.map(course => course.category))];

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
              <div className="relative">
                <select
                  className="appearance-none block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <FiFilter className="text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <select
                  className="appearance-none block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.level}
                  onChange={(e) => setFilters({...filters, level: e.target.value})}
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <FiFilter className="text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <select
                  className="appearance-none block w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.duration}
                  onChange={(e) => setFilters({...filters, duration: e.target.value})}
                >
                  <option value="all">Any Duration</option>
                  <option value="short">Short (≤6 weeks)</option>
                  <option value="medium">Medium (7-10 weeks)</option>
                  <option value="long">Long (10 weeks)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <FiClock className="text-gray-400" />
                </div>
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
              <CourseCard key={course.id} course={course} />
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
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-300 h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img
          src={course.thumbnail}
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
          <span>{course.duration}</span>
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
          to={`/courses/${course.id}`}
          className="mt-auto block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

export default Courses;