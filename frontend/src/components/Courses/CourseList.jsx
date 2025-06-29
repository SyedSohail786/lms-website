import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import CourseForm from './CourseForm';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCreate = async (formData) => {
    try {
      const res = await api.post('/api/courses', formData);
      setCourses([...courses, res.data]);
      setEditingCourse(null);
    } catch (err) {
      console.error('Failed to create course:', err);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const res = await api.put(`/api/courses/${editingCourse._id}`, formData);
      setCourses(courses.map(c => c._id === res.data._id ? res.data : c));
      setEditingCourse(null);
    } catch (err) {
      console.error('Failed to update course:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await api.delete(`/api/courses/${id}`);
      setCourses(courses.filter(c => c._id !== id));
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Courses</h2>
      
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">
          {editingCourse ? 'Edit Course' : 'Add New Course'}
        </h3>
        <CourseForm 
          initialData={editingCourse || {}} 
          onSubmit={editingCourse ? handleUpdate : handleCreate} 
        />
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">All Courses</h3>
        {courses.length === 0 ? (
          <p>No courses found</p>
        ) : (
          <ul className="divide-y">
            {courses.map(course => (
              <li key={course._id} className="py-3 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{course.title}</h4>
                  {course.description && (
                    <p className="text-gray-600 text-sm">{course.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingCourse(course)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
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