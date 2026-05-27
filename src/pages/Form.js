import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useIncident } from '../context/IncidentContext';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from '../components/Spinner'; // Твой спиннер

const Form = () => {
  const { addOne, error } = useIncident();
  const navigate = useNavigate();
  
  // Достаем встроенный флаг isSubmitting
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await addOne(data);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  // Если форма в данный момент отправляется на сервер — перекрываем экран спиннером
  if (isSubmitting) return <Spinner />;

  return (
    <div>
      <h2>Регистрация инцидента</h2>
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
        
        <label>Рейс (например, SU-123):
          <input {...register('flightNumber', { 
            required: 'Обязательно', 
            pattern: { value: /^[A-Z]{2,3}-\d{3,4}$/, message: 'Неверный формат' } 
          })} style={{ width: '100%', padding: '8px' }} />
          {errors.flightNumber && <div style={{ color: 'red', fontSize: '12px' }}>{errors.flightNumber.message}</div>}
        </label>

        <label>Тип происшествия:
          <input {...register('incidentType', { required: 'Обязательно' })} style={{ width: '100%', padding: '8px' }} />
          {errors.incidentType && <div style={{ color: 'red', fontSize: '12px' }}>{errors.incidentType.message}</div>}
        </label>

        <label>Уровень угрозы:
          <select {...register('severity')} style={{ width: '100%', padding: '8px' }}>
            <option value="Низкий">Низкий</option>
            <option value="Средний">Средний</option>
            <option value="Критический">Критический</option>
          </select>
        </label>

        {/* Кнопка тоже может реагировать на статус отправки */}
        <button 
          type="submit" 
          disabled={isSubmitting} // Блокируем кнопку от двойного клика
          style={{ padding: '10px', background: isSubmitting ? '#a0aec0' : 'green', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button type="button" onClick={() => navigate('/')} style={{ padding: '10px', cursor: 'pointer' }}>Отмена</button>
      </form>
    </div>
  );
};

export default Form;