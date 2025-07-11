import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaBook, FaUserGraduate, FaChartLine, FaMobileAlt, FaCertificate } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { auth } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    instructors: 0
  });

  // Mock stats - replace with real API calls
  useEffect(() => {
    setTimeout(() => {
      setStats({
        courses: 42,
        students: 1250,
        instructors: 28
      });
    }, 1000);
  }, []);
  
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Transform Your Learning Experience
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto">
            Our LMS platform provides everything you need to teach, learn, and grow in today's digital world.
          </p>
          
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              to={`${auth.role === "student" ? "/courses":"/student-register" }`}
              className="bg-white text-blue-600 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-50 transition duration-300 flex items-center justify-center"
            >
              Get Started <FiArrowRight className="ml-2" />
            </Link>
            <Link
              to={`${auth.role === "student"? "/student/subjects":"/student-login" }`}
              className="border-2 border-white text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-300"
            >
              {auth.role === "student"? "Mock Test" : "Login"}
            </Link>
          </div>
            
          
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <StatCard
              icon={<FaBook className="text-2xl sm:text-3xl" />}
              number={stats.courses}
              label="Courses"
              loading={stats.courses === 0}
            />
            <StatCard
              icon={<FaUserGraduate className="text-2xl sm:text-3xl" />}
              number={stats.students}
              label="Students"
              loading={stats.students === 0}
            />
            <StatCard
              icon={<FaChalkboardTeacher className="text-2xl sm:text-3xl" />}
              number={stats.instructors}
              label="Instructors"
              loading={stats.instructors === 0}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">Why Choose Our Platform?</h2>
          <p className="text-gray-600 text-center text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-12">
            We provide the best tools and resources to enhance your learning experience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <FeatureCard
              icon={<FaChalkboardTeacher className="text-3xl sm:text-4xl mb-4 text-blue-600" />}
              title="Expert Instructors"
              description="Learn from industry professionals with years of experience in their fields."
            />
            <FeatureCard
              icon={<FaBook className="text-3xl sm:text-4xl mb-4 text-purple-600" />}
              title="Comprehensive Courses"
              description="Access a wide range of courses covering various subjects and skill levels."
            />
            <FeatureCard
              icon={<FaMobileAlt className="text-3xl sm:text-4xl mb-4 text-green-600" />}
              title="Mobile Friendly"
              description="Learn on the go with our fully responsive platform that works on any device."
            />
            <FeatureCard
              icon={<FaChartLine className="text-3xl sm:text-4xl mb-4 text-orange-600" />}
              title="Progress Tracking"
              description="Monitor your learning journey with detailed analytics and progress reports."
            />
            <FeatureCard
              icon={<FaCertificate className="text-3xl sm:text-4xl mb-4 text-red-600" />}
              title="Certification"
              description="Earn recognized certificates upon course completion to boost your career."
            />
            <FeatureCard
              icon={<FiArrowRight className="text-3xl sm:text-4xl mb-4 text-indigo-600" />}
              title="Flexible Learning"
              description="Learn at your own pace with 24/7 access to all course materials."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="bg-blue-50 py-12 sm:py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to Start Learning?</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
            Join thousands of students who are already advancing their careers with our courses.
          </p>
          <Link
           to={`${auth.role === "student"? "/courses":"/student-register" }`}
            className="bg-blue-600 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition duration-300 inline-block"
          >
           {auth.role === "student"? "Explore Courses" : "Sign Up For Free"} 
          </Link>
        </div>
      </section>
    </div>
  );
};

// Component for Stat Cards
const StatCard = ({ icon, number, label, loading }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center"
  >
    <div className="flex justify-center mb-3 sm:mb-4">
      {icon}
    </div>
    {loading ? (
      <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
    ) : (
      <h3 className="text-3xl sm:text-4xl font-bold mb-2">{number.toLocaleString()}+</h3>
    )}
    <p className="text-gray-600 text-sm sm:text-base">{label}</p>
  </motion.div>
);

// Component for Feature Cards
const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 h-full"
  >
    <div className="flex justify-center">
      {icon}
    </div>
    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-center">{title}</h3>
    <p className="text-gray-600 text-sm sm:text-base text-center">{description}</p>
  </motion.div>
);

// Testimonials Section Component
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "This platform completely transformed my learning experience. The courses are well-structured and the instructors are amazing.",
      name: "Sarah Johnson",
      role: "Web Developer"
    },
    {
      quote: "I've taken several courses here and each one has helped me advance in my career. Highly recommended!",
      name: "Michael Chen",
      role: "Data Scientist"
    },
    {
      quote: "As an instructor, I find the tools provided extremely helpful for creating engaging content for my students.",
      name: "Dr. Emily Wilson",
      role: "University Professor"
    }
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
            >
              <p className="text-gray-600 italic text-sm sm:text-base mb-3 sm:mb-4">"{testimonial.quote}"</p>
              <div className="border-t pt-3 sm:pt-4">
                <p className="font-semibold text-sm sm:text-base">{testimonial.name}</p>
                <p className="text-gray-500 text-xs sm:text-sm">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
