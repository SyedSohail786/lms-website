import { Link, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const location = useLocation();
  
  // Hide footer on auth pages
  const hideFooterPaths = [
    '/admin-login',
    '/admin-register',
    '/student-login',
    '/student-register',
    "/student/results",
    "/student/subjects",
    "/admin/dashboard",
     "/admin/courses",
     "/admin/subjects",
     "/admin/students",
     "/admin/enrolled",
  ];
  
  if (hideFooterPaths.some(path => location.pathname.includes(path))) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-r from-purple-600 to-purple-700 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center cursor-pointer"
            >
              <FaGraduationCap className="h-8 w-8" />
              <h1 className="ml-2 text-xl font-bold">EduExam</h1>
            </motion.div>
            <p className="text-purple-100">
              Empowering students with the best exam preparation tools.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-purple-200 hover:text-white">
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-purple-200 hover:text-white">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-purple-200 hover:text-white">
                <FaGithub className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-purple-100 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-purple-100 hover:text-white">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/student-login" className="text-purple-100 hover:text-white">
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/admin-login" className="text-purple-100 hover:text-white">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-purple-100 hover:text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-purple-100 hover:text-white">
                  Guides
                </a>
              </li>
              <li>
                <a href="#" className="text-purple-100 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-purple-100 hover:text-white">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Contact
            </h3>
            <address className="mt-4 not-italic space-y-2">
              <p className="text-purple-100">123 Education Street</p>
              <p className="text-purple-100">Boston, MA 02115</p>
              <p className="text-purple-100">Email: info@eduexam.com</p>
              <p className="text-purple-100">Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-purple-500 text-center text-purple-200 text-sm">
          <p>&copy; {new Date().getFullYear()} EduExam. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-6">
            <a className="hover:text-white">
              Privacy Policy
            </a>
            <a  className="hover:text-white">
              Terms of Service
            </a>
            <a  className="hover:text-white">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;