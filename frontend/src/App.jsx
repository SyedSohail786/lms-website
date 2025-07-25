import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Navbar from './components/Navbar';
import Home from '../pages/Home';
import AdminAuth from './components/Auth/AdminAuth';
import StudentAuth from './components/Auth/StudentAuth';
import AdminDashboard from '../pages/Admin/Dashboard';
import AdminCourses from '../pages/Admin/Courses';
import AdminSubjects from '../pages/Admin/Subjects';
import StudentSubjects from '../pages/Student/Subjects';
import MockTest from './components/Tests/MockTest';
import TestResults from './components/Tests/TestResults';
import ProtectedRoute from './components/ProtectedRoute';
import Courses from '../pages/Courses';
import CourseDetails from '../pages/CourseDetails';
import Students from '../pages/Admin/Students';
import Enrolled from './components/Enrolled';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Navbar is fixed at the top with z-index */}
          <Navbar />
          
          {/* Main content with responsive padding to account for navbar height */}
          <div className="pt-16 sm:pt-20 container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              
              {/* Admin Auth */}
              <Route path="/admin-login" element={<AdminAuth isRegister={false} />} />
              <Route path="/admin-register" element={<AdminAuth isRegister={true} />} />
              
              {/* Student Auth */}
              <Route path="/student-login" element={<StudentAuth isRegister={false} />} />
              <Route path="/student-register" element={<StudentAuth isRegister={true} />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/courses" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminCourses />
                </ProtectedRoute>
              } />
              <Route path="/admin/subjects" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSubjects />
                </ProtectedRoute>
              } />
              <Route path="/admin/students" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Students />
                </ProtectedRoute>
              } />
              <Route path="/admin/enrolled" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Enrolled />
                </ProtectedRoute>
              } />
              
              {/* Student Routes */}
              <Route path="/student/subjects" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentSubjects />
                </ProtectedRoute>
              } />
              <Route path="/student/mock-test/:subjectId" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MockTest />
                </ProtectedRoute>
              } />
              <Route path="/student/results" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <TestResults />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer/>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;