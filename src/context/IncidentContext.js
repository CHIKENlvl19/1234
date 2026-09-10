import React, { createContext, useState, useContext } from 'react';
import api from '../api';

const IncidentContext = createContext();

const getErrorMessage = (err, defaultMsg) => {
  if (!err.response) {
    return 'Ошибка сети: сервер недоступен.';
  }
  switch (err.response.status) {
    case 400: return 'Некорректный запрос (400).';
    case 401: return 'Сессия истекла. Войдите заново (401).';
    case 404: return 'Запись не найдена на сервере (404).';
    case 500: return 'Внутренняя ошибка сервера (500). Попробуйте позже.';
    default: return `${defaultMsg} (${err.response.status})`;
  }
};

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = '/incidents';

  const loadAll = async () => {
    setLoading(true); setError(null);
    try {
      const response = await api.get(API_URL);
      setIncidents(response.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Не удалось загрузить реестр'));
    } finally {
      setLoading(false);
    }
  };

  const loadOne = async (id) => {
    setError(null);
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, `Ошибка загрузки инцидента #${id}`));
    }
  };

  const addOne = async (data) => {
    setError(null);
    try {
      const response = await api.post(API_URL, data);
      setIncidents(prev => [...prev, response.data]);
    } catch (err) {
      setError(getErrorMessage(err, 'Ошибка сохранения'));
      throw err;
    }
  };

  const updateOne = async (id, data) => {
    setError(null);
    try {
      const response = await api.put(`${API_URL}/${id}`, data);
      setIncidents(prev => prev.map(item => item.id === id ? response.data : item));
    } catch (err) {
      setError(getErrorMessage(err, 'Ошибка обновления'));
      throw err;
    }
  };

  const deleteOne = async (id) => {
    setError(null);
    try {
      await api.delete(`${API_URL}/${id}`);
      setIncidents(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, 'Ошибка удаления'));
    }
  };

  return (
    <IncidentContext.Provider value={{ incidents, loading, error, loadAll, loadOne, addOne, updateOne, deleteOne }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = () => useContext(IncidentContext);
