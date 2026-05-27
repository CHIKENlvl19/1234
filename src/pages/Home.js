import React, { useEffect, useState } from 'react'; // Добавили useState
import { Link } from 'react-router-dom';
import { useIncident } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from '../components/Spinner'; // Импортируем наш спиннер

const Home = () => {
  const { incidents, loading, error, loadAll, deleteOne } = useIncident();
  const { user, logout } = useAuth();
  
  // Локальный стейт для строки поиска
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Spinner />; // Используем красивый спиннер вместо текста

  // Магия фильтрации: оставляем только те инциденты, которые содержат введенный текст (ищем по рейсу или типу)
  const filteredIncidents = incidents.filter(inc => 
    inc.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inc.incidentType.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // Функция для определения цвета в зависимости от уровня угрозы
  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'Низкий':
        return { color: '#38a169', fontWeight: 'bold' };
      case 'Средний':
        return { color: '#dd6b20', fontWeight: 'bold' };
      case 'Критический':
        return { color: '#e53e3e', fontWeight: 'bold' };
      default:
        return { color: 'inherit', fontWeight: 'normal' };
    }
  };

  // Базовые стили для ячеек таблицы
  const thStyle = { padding: '10px', border: '1px solid #cbd5e0', background: '#edf2f7', textAlign: 'left' };
  const tdStyle = { padding: '10px', border: '1px solid #cbd5e0' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <h2>Дешборд диспетчера инцидентов</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ color: '#4a5568' }}>👤{user.username}</span>
          <button onClick={logout} style={{ padding: '6px 12px', background: '#e2e8f0', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Выйти</button>
        </div>
      </div>
      
      <ErrorMessage message={error} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/add" style={{ padding: '10px', background: '#2b6cb0', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
            ➕ Новый инцидент
          </Link>
          {user.role === 'admin' && (
            <Link to="/admin" style={{ padding: '10px', background: '#805ad5', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
              🛡️ Управление диспетчерами
            </Link>
          )}
        </div>

        {/* Поле поиска */}
        <input 
          type="text" 
          placeholder="🔍 Поиск по рейсу или типу..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
        />
      </div>

      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Рейс</th>
            <th style={thStyle}>Происшествие</th>
            <th style={thStyle}>Угроза</th>
            {user.role === 'admin' && <th style={thStyle}>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {filteredIncidents.length > 0 ? filteredIncidents.map(inc => (
            <tr key={inc.id} style={{ '&:hover': { background: '#f7fafc' } }}>
              <td style={tdStyle}>{inc.id}</td>
              <td style={tdStyle}><strong>{inc.flightNumber}</strong></td>
              <td style={tdStyle}><Link to={`/detail/${inc.id}`}>{inc.incidentType}</Link></td>
              
              {/* Здесь мы объединяем базовый стиль ячейки и цвет текста */}
              <td style={{ ...tdStyle, ...getSeverityStyle(inc.severity) }}>
                {inc.severity}
              </td>
              
              {user.role === 'admin' && (
                <td style={tdStyle}>
                  <button onClick={() => deleteOne(inc.id)} style={{ color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Удалить</button>
                </td>
              )}
            </tr>
          )) : (
            <tr>
              <td colSpan="5" style={{ ...tdStyle, textAlign: 'center', color: '#718096' }}>
                По вашему запросу инцидентов не найдено.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Home;