import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import Cookies from 'js-cookie';

const StudentAuth = ({ isRegister }) => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    course: '' 
  });
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token")
    const fetchCourses = async () => {
      try {
        if(token){
          const res = await api.get('/api/courses');
          setCourses(res.data);
        }
        
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegister) {
        await api.post('/api/students/register', form);
        alert('Registration successful! Please login.');
        navigate('/student-login');
      } else {
        const success = await login(form);
        if (success) navigate('/student/subjects');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isRegister ? 'Student Register' : 'Student Login'}
      </h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <>
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
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
          </>
        )}
        
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>

        <div>
          {
            isRegister ? 
            <p>already have a account? <a className='text-blue-500 cursor-pointer' onClick={()=>navigate('/student-login')}> Login</a></p>
            :
            <p>dont have an account? <a className='text-blue-500 cursor-pointer' onClick={()=>navigate('/student-register')}> Register</a></p>
          }
          
        </div>
        
        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default StudentAuth;