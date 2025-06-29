import { useState, useEffect } from 'react';
import api from '../../../utils/api';

const SubjectForm = ({ initialData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    title: initialData.title || '',
    course: initialData.course?._id || ''
  });
  const [courses, setCourses] = useState([]);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-1">Course</label>
        <select
          name="course"
          value={form.course}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>
      
      <button
        type="submit"
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
      >
        {initialData._id ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default SubjectForm;