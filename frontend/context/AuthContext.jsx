import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import Cookies from 'js-cookie';

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ 
    status: 'checking',  // 'checking', 'authenticated', 'guest'
    role: null,         // 'admin', 'student', null
    email: null
  });

  const checkAuth = async () => {
    try {
      const res = await api.get('/api/admin/me');
      setAuth({ 
        status: 'authenticated', 
        role: 'admin', 
        email: res.data.email 
      });
    } catch (adminErr) {
      try {
        const res = await api.get('/api/students/me');
        setAuth({ 
          status: 'authenticated', 
          role: 'student', 
          email: res.data.email 
        });
      } catch (studentErr) {
        setAuth({ 
          status: 'guest', 
          role: null, 
          email: null 
        });
      }
    }
  };

  const login = async (credentials, isAdmin = false) => {
  try {
    const endpoint = isAdmin ? '/api/admin/login' : '/api/students/login';
    const response = await api.post(endpoint, credentials);
    
    // Check for successful response
    if (response.status === 200 && response.data.success) {
      await checkAuth();
      return true;
    }
    return false;
  } catch (err) {
    console.error('Login failed:', err);
    return false;
  }
};

  const logout = async () => {
    try {
      const endpoint = auth.role === 'admin' ? '/api/admin/logout' : '/api/students/logout';
      await api.get(endpoint);
      Cookies.remove('token');
      setAuth({ 
        status: 'guest', 
        role: null, 
        email: null 
      });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};