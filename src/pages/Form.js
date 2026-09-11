import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useIncident } from '../context/IncidentContext';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from '../components/Spinner';

const Form = () => {
  const { addOne, error } = useIncident();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await addOne(data);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (isSubmitting) return <Spinner />;

  return (
    <div>
      <h2>Регистрация инцидента</h2>
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
        
        <label>Рейс / воздушное судно:
          <input {...register('flightNumber', { 
            required: 'Обязательно', 
            pattern: { value: /^[A-Z]{2,3}-\d{3,4}$/, message: 'Формат: SU-123 или AFL-1234' } 
          })} style={{ width: '100%', padding: '8px' }} />
          {errors.flightNumber && <div style={{ color: 'red', fontSize: '12px' }}>{errors.flightNumber.message}</div>}
        </label>

        <label>Тип угрозы:
          <input {...register('incidentType', { required: 'Обязательно' })} style={{ width: '100%', padding: '8px' }} placeholder="Например: Несанкционированное проникновение" />
          {errors.incidentType && <div style={{ color: 'red', fontSize: '12px' }}>{errors.incidentType.message}</div>}
        </label>

        <label>Уровень критичности:
          <select {...register('severity')} style={{ width: '100%', padding: '8px' }}>
            <option value="Низкий">Низкий</option>
            <option value="Средний">Средний</option>
            <option value="Высокий">Высокий</option>
            <option value="Критический">Критический</option>
          </select>
        </label>

        <label>Локация:
          <input {...register('location', { required: 'Обязательно' })} style={{ width: '100%', padding: '8px' }} placeholder="Например: Терминал, Перрон, КПП" />
          {errors.location && <div style={{ color: 'red', fontSize: '12px' }}>{errors.location.message}</div>}
        </label>

        <label>Статус рассмотрения:
          <select {...register('status')} style={{ width: '100%', padding: '8px' }}>
            <option value="Зарегистрирован">Зарегистрирован</option>
            <option value="В процессе расследования">В процессе расследования</option>
            <option value="Устранен">Устранен</option>
            <option value="Закрыт">Закрыт</option>
          </select>
        </label>

        <label>Ответственный инспектор / служба:
          <input {...register('inspector', { required: 'Обязательно' })} style={{ width: '100%', padding: '8px' }} placeholder="ФИО или название службы" />
          {errors.inspector && <div style={{ color: 'red', fontSize: '12px' }}>{errors.inspector.message}</div>}
        </label>

        <button 
          type="submit" 
          disabled={isSubmitting}
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