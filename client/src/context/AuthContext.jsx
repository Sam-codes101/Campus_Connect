import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await API.get('/auth/me');
          if (res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token: receivedToken, ...userData } = res.data.data;
      
      setToken(receivedToken);
      setUser(userData);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, data: userData };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (formData) => {
    try {
      const res = await API.post('/auth/register', formData);
      const { token: receivedToken, ...userData } = res.data.data;

      setToken(receivedToken);
      setUser(userData);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, data: userData };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
