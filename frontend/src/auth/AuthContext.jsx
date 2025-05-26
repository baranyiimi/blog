import { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get('/user')
        .then(({ data }) => setUser(data))
        .catch(() => setUser(null));
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/user');
      setUser(data);
    } catch (err) {
      setUser(null);
    }
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post('/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};