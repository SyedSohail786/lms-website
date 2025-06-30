import { Link } from 'react-router-dom';
import { FiClock, FiUser, FiStar } from 'react-icons/fi';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
            course.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {course.level}
          </span>
          <span className="text-sm text-gray-500">{course.category}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="flex items-center mr-4">
            <FiClock className="mr-1" /> {course.duration}
          </span>
          <span className="flex items-center">
            <FiUser className="mr-1" /> {course.students} students
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FiStar className="text-yellow-400 mr-1" />
            <span className="font-medium">{course.rating}</span>
          </div>
          <span className="font-bold">${course.price}</span>
        </div>
        
        <Link
          to={`/courses/${course._id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;