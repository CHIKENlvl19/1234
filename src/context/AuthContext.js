import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role'); // Достаем роль
    
    if (token && username && role) {
      setUser({ username, token, role });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(`http://217.71.129.139:4053/login`, {
        username: username,
        password: password
      });
      
      if (res.data.length > 0) {
        const userData = res.data[0]; // Берем найденного пользователя
        const fakeToken = "auth_token_" + Date.now();
        
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('role', userData.role); // Сохраняем роль в память
        
        setUser({ username: userData.username, role: userData.role, token: fakeToken });
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
