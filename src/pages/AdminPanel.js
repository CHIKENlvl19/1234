import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('dispatcher');

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/users', {
      username: newUsername,
      password: newPassword,
      role: newRole
    });
    setNewUsername('');
    setNewPassword('');
    fetchUsers(); // Обновляем список
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Точно удалить сотрудника?')) {
      await axios.delete(`http://localhost:5000/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <h2>🛡️ Панель Администратора</h2>
        <Link to="/" style={{ padding: '8px 12px', background: '#e2e8f0', textDecoration: 'none', color: '#000', borderRadius: '4px' }}>Назад к инцидентам</Link>
      </div>

      <div style={{ background: '#f7fafc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Добавить сотрудника</h3>
        <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input type="text" placeholder="Логин" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
          <input type="text" placeholder="Пароль" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <select value={newRole} onChange={e => setNewRole(e.target.value)}>
            <option value="dispatcher">Диспетчер</option>
            <option value="admin">Администратор</option>
          </select>
          <button type="submit" style={{ background: '#38a169', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer' }}>Добавить</button>
        </form>
      </div>

      <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
        <thead style={{ background: '#eee' }}>
          <tr>
            <th>ID</th>
            <th>Логин</th>
            <th>Роль</th>
            <th>Управление</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td style={{ fontWeight: u.role === 'admin' ? 'bold' : 'normal' }}>{u.role}</td>
              <td>
                <button onClick={() => handleDeleteUser(u.id)} disabled={u.username === 'admin'} style={{ color: 'red', cursor: 'pointer' }}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;