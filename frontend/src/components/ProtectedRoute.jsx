import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useAuth();

  if (auth.status === 'checking') {
    return <div>Loading...</div>;
  }

  if (auth.status !== 'authenticated' || !allowedRoles.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;