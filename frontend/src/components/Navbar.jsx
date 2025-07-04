import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaGraduationCap, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };
  
  const navLinks = {
    guest: [
      { to: "/", text: "Home" },
      { to: "/courses", text: "Courses" },
      { to: "/student-login", text: "Student Login" },
      { to: "/admin-login", text: "Admin Login" }
    ],
    admin: [
      { to: "/admin/dashboard", text: "Dashboard" },
      { to: "/admin/courses", text: "Courses" },
      { to: "/admin/subjects", text: "Subjects" },
      { to: "/admin/students", text: "Students" },
      { to: "/admin/enrolled", text: "Enrolled" }
    ],
    student: [
      { to: "/courses", text: "Courses" },
      { to: "/student/subjects", text: "Mock Tests" },
      { to: "/student/results", text: "Results" }
    ]
  };

  const redirectToHome = () =>{
    if(auth.role === "admin") return navigate("/admin/dashboard") 
    navigate("/")
  }
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-gradient-to-r from-purple-600 to-purple-700 py-1'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => redirectToHome }
            className="flex-shrink-0 flex items-center cursor-pointer"
          >
            <FaGraduationCap className={`h-8 w-8 ${scrolled ? 'text-purple-600' : 'text-white'}`} />
            <h1 className={`ml-2 text-xl font-bold ${scrolled ? 'text-gray-800' : 'text-white'}`}>
              EduExam
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {(navLinks[auth.role === 'admin' || auth.role === 'student' ? auth.role : 'guest'] || []).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white hover:text-purple-200'}`}
                >
                  {link.text}
                </Link>
              ))}
              {(auth.role === 'admin' || auth.role === 'student') && (
                <button
                  onClick={handleLogout}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white hover:text-purple-200'}`}
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${scrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white hover:text-purple-200'}`}
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden ${scrolled ? 'bg-white' : 'bg-purple-700'}`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {(navLinks[auth.role === 'admin' || auth.role === 'student' ? auth.role : 'guest'] || []).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-purple-600'}`}
                >
                  {link.text}
                </Link>
              ))}
              {(auth.role === 'admin' || auth.role === 'student') && (
                <button
                  onClick={handleLogout}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-purple-600'}`}
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
