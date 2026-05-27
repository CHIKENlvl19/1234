import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const success = await login(username, password);
    if (success) {
      navigate('/'); // Если ок, пускаем в дашборд
    } else {
      setError('Неверный логин или пароль диспетчера');
    }
  };

  return (
    <div style={{ maxWidth: '320px', margin: '100px auto', fontFamily: 'sans-serif' }}>
      <h2>Авторизация в системе</h2>
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Логин (например: admin)" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Пароль (например: password123)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#2b6cb0', color: 'white', border: 'none', cursor: 'pointer' }}>
          Войти в систему
        </button>
      </form>
    </div>
  );
};

export default Login;