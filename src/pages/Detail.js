import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useIncident } from '../context/IncidentContext';
import ErrorMessage from '../components/ErrorMessage';
import Spinner from '../components/Spinner';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadOne, updateOne, error } = useIncident();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchInc = async () => {
      const data = await loadOne(id);
      if (data) reset(data);
      setFetching(false);
    };
    fetchInc();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data) => {
    try {
      await updateOne(id, data);
      navigate('/');
    } catch (err) {}
  };

  if (fetching) return <Spinner />;

  return (
    <div>
      <h2>Редактирование инцидента #{id}</h2>
      <ErrorMessage message={error} />
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' }}>
        
        <label>Рейс:
          <input {...register('flightNumber', { required: 'Обязательно' })} style={{ width: '100%', padding: '8px' }} />
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

        <button type="submit" style={{ padding: '10px', background: '#2b6cb0', color: 'white', border: 'none', cursor: 'pointer' }}>Обновить</button>
        <button type="button" onClick={() => navigate('/')} style={{ padding: '10px', cursor: 'pointer' }}>Назад</button>
      </form>
    </div>
  );
};

export default Detail;