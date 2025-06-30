import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaBook, FaUserGraduate, FaChartLine, FaMobileAlt, FaCertificate } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

const LandingPage = () => {
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
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Transform Your Learning Experience
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our LMS platform provides everything you need to teach, learn, and grow in today's digital world.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/student-register" 
              className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition duration-300 flex items-center justify-center"
            >
              Get Started <FiArrowRight className="ml-2" />
            </Link>
            <Link 
              to="/student-login" 
              className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition duration-300"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              icon={<FaBook className="text-3xl" />}
              number={stats.courses}
              label="Courses"
              loading={stats.courses === 0}
            />
            <StatCard 
              icon={<FaUserGraduate className="text-3xl" />}
              number={stats.students}
              label="Students"
              loading={stats.students === 0}
            />
            <StatCard 
              icon={<FaChalkboardTeacher className="text-3xl" />}
              number={stats.instructors}
              label="Instructors"
              loading={stats.instructors === 0}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose Our Platform?</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            We provide the best tools and resources to enhance your learning experience.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FaChalkboardTeacher className="text-4xl mb-4 text-blue-600" />}
              title="Expert Instructors"
              description="Learn from industry professionals with years of experience in their fields."
            />
            <FeatureCard 
              icon={<FaBook className="text-4xl mb-4 text-purple-600" />}
              title="Comprehensive Courses"
              description="Access a wide range of courses covering various subjects and skill levels."
            />
            <FeatureCard 
              icon={<FaMobileAlt className="text-4xl mb-4 text-green-600" />}
              title="Mobile Friendly"
              description="Learn on the go with our fully responsive platform that works on any device."
            />
            <FeatureCard 
              icon={<FaChartLine className="text-4xl mb-4 text-orange-600" />}
              title="Progress Tracking"
              description="Monitor your learning journey with detailed analytics and progress reports."
            />
            <FeatureCard 
              icon={<FaCertificate className="text-4xl mb-4 text-red-600" />}
              title="Certification"
              description="Earn recognized certificates upon course completion to boost your career."
            />
            <FeatureCard 
              icon={<FiArrowRight className="text-4xl mb-4 text-indigo-600" />}
              title="Flexible Learning"
              description="Learn at your own pace with 24/7 access to all course materials."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of students who are already advancing their careers with our courses.
          </p>
          <Link 
            to="/student-register" 
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 inline-block"
          >
            Sign Up For Free
          </Link>
        </div>
      </section>
    </div>
  );
};

// Component for Stat Cards
const StatCard = ({ icon, number, label, loading }) => (
  <div className="bg-white p-8 rounded-xl shadow-md text-center">
    <div className="flex justify-center mb-4">
      {icon}
    </div>
    {loading ? (
      <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
    ) : (
      <h3 className="text-4xl font-bold mb-2">{number.toLocaleString()}+</h3>
    )}
    <p className="text-gray-600">{label}</p>
  </div>
);

// Component for Feature Cards
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 h-full">
    <div className="flex justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-center">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
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
    <section className="py-16 bg-gray-50 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <div className="border-t pt-4">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPage;