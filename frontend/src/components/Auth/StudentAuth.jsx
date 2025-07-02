import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiBook } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Select from 'react-select'; // Import react-select

const StudentAuth = ({ isRegister }) => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    course: '' 
  });
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/courses');
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target ? e.target.name : 'course']: e.target ? e.target.value : e.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isRegister) {
        const response = await api.post('/api/students/register', form);
        toast.success('Registration successful! Please login.');
        navigate('/student-login');
      } else {
        const success = await login(form);
        if (success) {
          toast.success('Login successful!');
          navigate('/student/subjects');
        } else {
          toast.error('Invalid email or password');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Something went wrong';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare options for react-select
  const courseOptions = courses.map(course => ({
    value: course._id,
    label: course.title
  }));

  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 sm:p-6 text-white">
          <h2 className="text-xl sm:text-2xl font-bold text-center">
            {isRegister ? 'Student Registration' : 'Student Login'}
          </h2>
          <p className="text-center text-purple-100 text-xs sm:text-sm mt-1">
            {isRegister ? 'Join our learning community' : 'Welcome back to your learning journey'}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-xs sm:text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {isRegister && (
              <>
                <div className="space-y-1">
                  <label className="block text-gray-700 text-xs sm:text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm sm:text-base"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-700 text-xs sm:text-sm font-medium">Course</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBook className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <Select
                      options={courseOptions}
                      value={courseOptions.find(option => option.value === form.course)}
                      onChange={(selectedOption) => handleChange({ value: selectedOption.value })}
                      className="w-full text-sm sm:text-base"
                      classNamePrefix="react-select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          padding: '0.375rem 0', // Matches py-2 sm:py-3
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          boxShadow: 'none',
                          '&:hover': {
                            borderColor: '#e5e7eb',
                          },
                          '&:focus-within': {
                            borderColor: '#9333ea',
                            boxShadow: '0 0 0 2px rgba(147, 51, 234, 0.2)',
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
                          backgroundColor: state.isSelected ? '#9333ea' : state.isFocused ? '#f3e8ff' : 'white',
                          color: state.isSelected ? 'white' : 'black',
                          '&:hover': {
                            backgroundColor: '#f3e8ff',
                          },
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          marginLeft: '2.5rem', // Matches pl-10
                        }),
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="block text-gray-700 text-xs sm:text-sm font-medium">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm sm:text-base"
                  placeholder="student@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-gray-700 text-xs sm:text-sm font-medium">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 sm:py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 ${
                  isLoading ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : isRegister ? 'Create Account' : 'Sign In'}
              </motion.button>
            </div>

            <div className="text-center text-xs sm:text-sm text-gray-500 pt-2">
              {isRegister ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/student-login')}
                    className="text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/student-register')}
                    className="text-purple-600 hover:text-purple-800 font-medium"
                  >
                    Register
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentAuth;