import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ status: 'checking', role: null });

  const checkAuth = async () => {
  try {
    const res = await api.get('/api/admin/me');
    setAuth({ status: 'authenticated', role: 'admin', email: res.data.email });
  } catch (adminErr) {
    try {
      const res = await api.get('/api/students/me');
      setAuth({ status: 'authenticated', role: 'student', email: res.data.email });
    } catch (studentErr) {
      setAuth({ status: 'guest', role: null });
    }
  }
};

  const login = async (credentials, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? '/api/admin/login' : '/api/students/login';
      await api.post(endpoint, credentials);
      await checkAuth();
      return true;
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
      setAuth({ status: 'guest', role: null });
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

export const useAuth = () => useContext(AuthContext);