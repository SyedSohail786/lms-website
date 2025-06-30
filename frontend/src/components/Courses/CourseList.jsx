import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../../../utils/api';
import CourseForm from './CourseForm';
import LoadingSpinner from '../LoadingSpinner';
import { toast } from 'react-toastify';
const baseurl = import.meta.env.VITE_API_BASE_URL;

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);

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

  const refreshCourses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/courses');
      setCourses(data);
    } catch (err) {
      toast.error('Failed to load courses');
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      const { data } = await api.post('/api/courses', formData);
      await refreshCourses(); // Refresh the list after creation
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
      await refreshCourses(); // Refresh the list after update
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
      setCourses(courses.filter(c => c._id !== id));
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
        <button
          onClick={() => setEditingCourse({})}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus className="mr-2" />
          Add New Course
        </button>
      </div>

      {/* Course Form (shown when editing/creating) */}
      {editingCourse && (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-4">
      {editingCourse._id ? 'Edit Course' : 'Create New Course'}
    </h3>
    <CourseForm 
      initialData={editingCourse} 
      onSubmit={editingCourse._id ? handleUpdate : handleCreate}
      onCancel={() => setEditingCourse(null)}
      onSuccess={refreshCourses} // Add this prop
    />
  </div>
)}
      {/* Courses List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">All Courses ({courses.length})</h3>
        </div>
        
        {courses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No courses found. Create your first course!
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {courses.map(course => (
              <li key={course._id} className="hover:bg-gray-50 transition">
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-medium text-gray-800 truncate">
                        {course.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {course.instructor} • {course.category} • {course.level}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        onClick={() => toggleExpand(course._id)}
                        className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100"
                      >
                        {expandedCourse === course._id ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                  </div>

                  {expandedCourse === course._id && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-700">Description</h5>
                          <p className="text-gray-600">{course.description}</p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-700">Details</h5>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <div>
                              <span className="text-sm text-gray-500">Duration:</span>
                              <p>{course.duration?.value} {course.duration?.unit}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Rating:</span>
                              <p>{course.rating}/5</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Students:</span>
                              <p>{course.students}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Price:</span>
                              <p>${course.price}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {course.thumbnail && (
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-700 mb-2">Thumbnail</h5>
                          <img 
                            src={baseurl + course.thumbnail} 
                            alt="Course thumbnail" 
                            className="h-32 rounded-lg object-cover border"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CourseList;