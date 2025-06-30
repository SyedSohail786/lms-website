import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-purple-800 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold cursor-pointer" onClick={()=>navigate("/")}>EduExam</h1>
      <ul className="flex gap-6">
        {auth.status === 'guest' && (
          <>
            <Link to="/" className="hover:text-purple-300">Home</Link>
            <Link to="/courses" className="hover:text-purple-300">Courses</Link>
            <Link to="/student-login" className="hover:text-purple-300">Student Login</Link>
            <Link to="/admin-login" className="hover:text-purple-300">Admin Login</Link>
          </>
        )}

        {auth.role === 'admin' && (
          <>
            <Link to="/admin/dashboard" className="hover:text-purple-300">Dashboard</Link>
            <Link to="/admin/courses" className="hover:text-purple-300">Courses</Link>
            <Link to="/admin/subjects" className="hover:text-purple-300">Subjects</Link>
            <button onClick={handleLogout} className="hover:text-purple-300">Logout</button>
          </>
        )}

        {auth.role === 'student' && (
          <>
            <Link to="/student/subjects" className="hover:text-purple-300">Mock Tests</Link>
            <Link to="/student/results" className="hover:text-purple-300">Results</Link>
            <button onClick={handleLogout} className="hover:text-purple-300">Logout</button>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;