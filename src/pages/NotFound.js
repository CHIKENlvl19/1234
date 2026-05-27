import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '80px', color: '#e53e3e', margin: '0' }}>404</h1>
      <h2 style={{ fontSize: '30px', margin: '10px 0' }}>Борт отклонился от курса!</h2>
      <p style={{ color: '#4a5568', fontSize: '18px', marginBottom: '30px' }}>
        Запрашиваемый сектор воздушного пространства не найден в навигационной системе.
      </p>
      <Link to="/" style={{ padding: '12px 24px', background: '#2b6cb0', color: '#fff', textDecoration: 'none', borderRadius: '5px', fontSize: '16px' }}>
        📡 Вернуться на радар (Главная)
      </Link>
    </div>
  );
};

export default NotFound;