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

export default CourseCard;