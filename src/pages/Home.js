import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIncident } from '../context/IncidentContext';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from '../components/Spinner';

const Home = () => {
  const { incidents, loading, error, loadAll, deleteOne } = useIncident();
  const { user, logout } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAll();
  }, []);

  if (loading) return <Spinner />;

  const filteredIncidents = incidents.filter(inc => {
    const term = searchTerm.toLowerCase();
    return (inc.flightNumber || '').toLowerCase().includes(term) ||
      (inc.incidentType || '').toLowerCase().includes(term) ||
      (inc.location || '').toLowerCase().includes(term) ||
      (inc.inspector || '').toLowerCase().includes(term);
  });

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Вы уверены, что хотите удалить этот инцидент? Данное действие необратимо.");
    if (isConfirmed) {
      await deleteOne(id);
    }
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'Низкий':
        return { color: '#38a169', fontWeight: 'bold' };
      case 'Средний':
        return { color: '#dd6b20', fontWeight: 'bold' };
      case 'Высокий':
        return { color: '#c53030', fontWeight: 'bold' };
      case 'Критический':
        return { color: '#e53e3e', fontWeight: 'bold', background: '#fff5f5' };
      default:
        return {};
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Зарегистрирован':
        return { color: '#3182ce', fontWeight: 'bold' };
      case 'В процессе расследования':
        return { color: '#dd6b20', fontWeight: 'bold' };
      case 'Устранен':
        return { color: '#38a169', fontWeight: 'bold' };
      case 'Закрыт':
        return { color: '#718096', fontWeight: 'bold' };
      default:
        return {};
    }
  };

  const thStyle = { padding: '10px', border: '1px solid #cbd5e0', background: '#edf2f7', textAlign: 'left', fontSize: '13px' };
  const tdStyle = { padding: '8px 10px', border: '1px solid #cbd5e0', fontSize: '13px' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <h2>Дешборд инцидентов авиабезопасности</h2>
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

        <input 
          type="text" 
          placeholder="🔍 Поиск..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '250px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
        />
      </div>

      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
        <thead>
          <tr>
            <th style={thStyle}>Рейс</th>
            <th style={thStyle}>Тип угрозы</th>
            <th style={thStyle}>Критичность</th>
            <th style={thStyle}>Локация</th>
            <th style={thStyle}>Статус</th>
            <th style={thStyle}>Инспектор</th>
            {user.role === 'admin' && <th style={thStyle}>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {filteredIncidents.length > 0 ? filteredIncidents.map(inc => (
            <tr key={inc.id}>
              <td style={tdStyle}><strong>{inc.flightNumber}</strong></td>
              <td style={tdStyle}><Link to={`/detail/${inc.id}`}>{inc.incidentType}</Link></td>
              <td style={{ ...tdStyle, ...getSeverityStyle(inc.severity) }}>{inc.severity}</td>
              <td style={tdStyle}>{inc.location || '—'}</td>
              <td style={{ ...tdStyle, ...getStatusStyle(inc.status) }}>{inc.status || '—'}</td>
              <td style={tdStyle}>{inc.inspector || '—'}</td>
              {user.role === 'admin' && (
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(inc.id)} style={{ color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Удалить</button>
                </td>
              )}
            </tr>
          )) : (
            <tr>
              <td colSpan="7" style={{ ...tdStyle, textAlign: 'center', color: '#718096' }}>
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