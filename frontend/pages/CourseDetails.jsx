import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiClock, FiUser, FiStar, FiBook, FiArrowLeft } from 'react-icons/fi';
import { FaChalkboardTeacher, FaRegCalendarAlt } from 'react-icons/fa';
import { BsCheckCircle, BsBookHalf } from 'react-icons/bs';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import LoadingSpinner from '../src/components/LoadingSpinner';
import Cookies from 'js-cookie';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const [enrolling, setEnrolling] = useState(false);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/courses/${id}`);
        setCourse(data);

        // Fetch related courses
        const relatedRes = await api.get(`/api/courses?category=${data.category}&limit=3`);
        setRelatedCourses(relatedRes.data.filter(c => c._id !== data._id));

        // Check if user is enrolled
        try {
          const res = await api.get(`/api/status/${id}`);
          if (res.data.enrolled) return setEnrolled(true);
        } catch {
          setEnrolled(false);
        }
      } catch (err) {
        toast.error('Failed to load course details');
        console.error(err);
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

 const handleEnroll = async () => {
  try {
    setEnrolling(true);
    const token = Cookies.get('sToken');

    console.log('All cookies:', document.cookie);
    console.log('Specific cookie:', Cookies.get('sToken'));
    console.log('Cookies with options:', Cookies.get('sToken', { path: '/' }));
    
    if (!token) {
      toast.error('You must be logged in to enroll');
      navigate('/student-login');
      return;
    }

    await api.post(`/api/enroll/${id}`, {}, {
      withCredentials: true // This ensures cookies are sent
    });
    toast.success('Successfully enrolled in the course!');
    setEnrolled(true);
  } catch (err) {
    if (err.response?.status === 401) {
      toast.error('Session expired. Please login again');
      navigate('/student-login');
    } else {
      toast.error(err.response?.data?.message || 'Failed to enroll');
    }
  } finally {
    setEnrolling(false);
  }
};
  if (loading) return <LoadingSpinner />;
  if (!course) return <div className="text-center py-12 text-base sm:text-lg">Course not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <FiArrowLeft className="mr-2" />
          Back to Courses
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Course Header */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 lg:w-2/5">
              <img
                src={course.thumbnail ? `${baseurl}${course.thumbnail}` : 'https://via.placeholder.com/800x450'}
                alt={course.title}
                className="w-full h-48 sm:h-64 md:h-full object-cover max-h-96"
              />
            </div>
            <div className="p-4 sm:p-6 md:p-8 md:w-1/2 lg:w-3/5">
              <div className="flex items-center mb-2 sm:mb-3">
                <span
                  className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full ${
                    course.level === 'Beginner'
                      ? 'bg-green-100 text-green-800'
                      : course.level === 'Intermediate'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {course.level}
                </span>
                <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-500">{course.category}</span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                {course.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-6">
                <div className="flex items-center">
                  <FiStar className="text-yellow-400 mr-1" />
                  <span className="font-medium text-sm sm:text-base">{course.rating}</span>
                  <span className="text-gray-500 ml-1 text-xs sm:text-sm">
                    ({course.students.toLocaleString()})
                  </span>
                </div>
                <div className="flex items-center">
                  <FaChalkboardTeacher className="text-gray-400 mr-1" />
                  <span className="text-gray-600 text-sm sm:text-base">{course.instructor}</span>
                </div>
              </div>

              <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">{course.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex items-center">
                  <FiClock className="text-gray-400 mr-2" />
                  <span className="text-sm sm:text-base">
                    {course.duration?.value} {course.duration?.unit}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaRegCalendarAlt className="text-gray-400 mr-2" />
                  <span className="text-sm sm:text-base">Self-paced</span>
                </div>
                <div className="flex items-center">
                  <FiUser className="text-gray-400 mr-2" />
                  <span className="text-sm sm:text-base">{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center">
                  <BsBookHalf className="text-gray-400 mr-2" />
                  <span className="text-sm sm:text-base">{course.modules?.length || 0} modules</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <div>
                  <span className="text-lg sm:text-2xl font-bold">${course.price}</span>
                  {course.originalPrice && (
                    <span className="ml-2 text-gray-500 line-through text-sm sm:text-base">
                      ${course.originalPrice}
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEnroll}
                  disabled={enrolled}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-white ${
                    enrolled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } transition duration-200`}
                >
                  {enrolled ? 'Enrolled' : enrolling? 'Enrolling...' : 'Enroll Now'}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="border-t border-gray-200 p-4 sm:p-6 md:p-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Course Content
            </h2>
            <div className="space-y-4">
              {course.modules?.map((module, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                    <h3 className="font-medium text-sm sm:text-base">
                      <span className="text-gray-500 mr-2">Module {index + 1}:</span>
                      {module.title}
                    </h3>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {module.lessons?.length || 0} lessons
                    </span>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {module.lessons?.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="px-4 py-3 flex items-center">
                        <BsCheckCircle className="text-green-500 mr-2 sm:mr-3 flex-shrink-0" />
                        <span className="text-gray-700 text-sm sm:text-base">{lesson}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Related Courses */}
          {relatedCourses.length > 0 && (
            <div className="border-t border-gray-200 p-4 sm:p-6 md:p-8 bg-gray-50">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                You might also like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {relatedCourses.map(course => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-300"
                  >
                    <Link to={`/courses/${course._id}`}>
                      <div className="h-40 sm:h-48 overflow-hidden">
                        <img
                          src={course.thumbnail ? `${baseurl}${course.thumbnail}` : 'https://via.placeholder.com/400x225'}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-sm sm:text-base text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{course.instructor}</p>
                        <div className="flex items-center mt-1 sm:mt-2">
                          <FiStar className="text-yellow-400 mr-1" />
                          <span className="text-xs sm:text-sm">{course.rating}</span>
                          <span className="text-xs sm:text-sm text-gray-500 ml-2">({course.students})</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CourseDetails;
