import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiClock, FiUser, FiStar, FiBook, FiArrowLeft } from 'react-icons/fi';
import { FaChalkboardTeacher, FaRegCalendarAlt } from 'react-icons/fa';
import { BsCheckCircle, BsBookHalf } from 'react-icons/bs';
import api from '../utils/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../src/components/LoadingSpinner';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const baseurl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/courses/${id}`);
        setCourse(data);
        
        // Fetch related courses
        const relatedRes = await api.get(`/api/courses?category=${data.category}&limit=3`);
        setRelatedCourses(relatedRes.data.filter(c => c._id !== data._id));
        
        // Check if user is enrolled (you'll need to implement this API endpoint)
        try {
          const enrollmentRes = await api.get(`/api/courses/${id}/enrollment`);
          setEnrolled(enrollmentRes.data.enrolled);
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
      await api.post(`/api/courses/${id}/enroll`);
      toast.success('Successfully enrolled in the course!');
      setEnrolled(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enroll');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!course) return <div className="text-center py-12">Course not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FiArrowLeft className="mr-2" />
          Back to Courses
        </button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Course Header */}
          <div className="md:flex">
            <div className="md:w-1/2 lg:w-2/5">
              <img
                src={course.thumbnail ? `${baseurl}${course.thumbnail}` : 'https://via.placeholder.com/800x450'}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 md:w-1/2 lg:w-3/5">
              <div className="flex items-center mb-2">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {course.level}
                </span>
                <span className="ml-3 text-sm text-gray-500">{course.category}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-6">
                  <FiStar className="text-yellow-400 mr-1" />
                  <span className="font-medium">{course.rating}</span>
                  <span className="text-gray-500 ml-1">({course.students.toLocaleString()})</span>
                </div>
                <div className="flex items-center">
                  <FaChalkboardTeacher className="text-gray-400 mr-1" />
                  <span className="text-gray-600">{course.instructor}</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">{course.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <FiClock className="text-gray-400 mr-2" />
                  <span>{course.duration?.value} {course.duration?.unit}</span>
                </div>
                <div className="flex items-center">
                  <FaRegCalendarAlt className="text-gray-400 mr-2" />
                  <span>Self-paced</span>
                </div>
                <div className="flex items-center">
                  <FiUser className="text-gray-400 mr-2" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center">
                  <BsBookHalf className="text-gray-400 mr-2" />
                  <span>{course.modules?.length || 0} modules</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">${course.price}</span>
                  {course.originalPrice && (
                    <span className="ml-2 text-gray-500 line-through">${course.originalPrice}</span>
                  )}
                </div>
                <button
                  onClick={handleEnroll}
                  disabled={enrolled}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    enrolled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {enrolled ? 'Enrolled' : 'Enroll Now'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Course Content */}
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
            
            <div className="space-y-4">
              {course.modules?.map((module, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                    <h3 className="font-medium">
                      <span className="text-gray-500 mr-2">Module {index + 1}:</span>
                      {module.title}
                    </h3>
                    <span className="text-sm text-gray-500">{module.lessons?.length || 0} lessons</span>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {module.lessons?.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="px-4 py-3 flex items-center">
                        <BsCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{lesson}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Related Courses */}
          {relatedCourses.length > 0 && (
            <div className="border-t border-gray-200 p-8 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedCourses.map(course => (
                  <div key={course._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition duration-300">
                    <Link to={`/courses/${course._id}`}>
                      <div className="h-48 overflow-hidden">
                        <img
                          src={course.thumbnail ? `${baseurl}${course.thumbnail}` : 'https://via.placeholder.com/400x225'}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-500">{course.instructor}</p>
                        <div className="flex items-center mt-2">
                          <FiStar className="text-yellow-400 mr-1" />
                          <span className="text-sm">{course.rating}</span>
                          <span className="text-sm text-gray-500 ml-2">({course.students})</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;