import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiKey } from 'react-icons/fi';
import { toast } from 'react-toastify';

const AdminAuth = ({ isRegister }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        await api.post('/api/admin/register', form);
        toast.success('Admin registration successful! Please login.');
        navigate('/admin-login');
      } else {
        const success = await login(form, true);
        if (success) {
          toast.success('Admin login successful!');
          navigate('/admin/dashboard');
        } else {
          toast.error('Invalid admin credentials');
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

  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-gray-800 to-blue-800 p-4 sm:p-6 text-white">
          <div className="flex items-center justify-center space-x-2">
            <FiKey className="w-5 h-5 sm:w-6 sm:h-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-center">
              {isRegister ? 'Admin Registration' : 'Admin Portal'}
            </h2>
          </div>
          <p className="text-center text-gray-300 text-xs sm:text-sm mt-1">
            {isRegister ? 'Create a new admin account' : 'Access the administration dashboard'}
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
                    className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm sm:text-base"
                    placeholder="Admin Name"
                    required
                  />
                </div>
              </div>
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
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm sm:text-base"
                  placeholder="admin@example.com"
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
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm sm:text-base"
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
                className={`w-full py-2 sm:py-3 px-4 bg-gradient-to-r from-gray-800 to-blue-800 hover:from-gray-900 hover:to-blue-900 text-white font-medium rounded-lg shadow-md transition-all duration-300 ${
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
                ) : isRegister ? 'Create Admin' : 'Access Dashboard'}
              </motion.button>
            </div>

            <div className="text-center text-xs sm:text-sm text-gray-500 pt-2">
              {isRegister ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/admin-login')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Admin Login
                  </button>
                </p>
              ) : (
                <p>
                  Need an admin account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/admin-register')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
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

export default AdminAuth;