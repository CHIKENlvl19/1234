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
        
        <label>Рейс / воздушное судно:
          <input {...register('flightNumber', { required: 'Обязательно' })} style={{ width: '100%', padding: '8px' }} />
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

        <button type="submit" style={{ padding: '10px', background: '#2b6cb0', color: 'white', border: 'none', cursor: 'pointer' }}>Обновить</button>
        <button type="button" onClick={() => navigate('/')} style={{ padding: '10px', cursor: 'pointer' }}>Назад</button>
      </form>
    </div>
  );
};

export default Detail;