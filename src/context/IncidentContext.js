import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const IncidentContext = createContext();

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://217.71.129.139:4053/incidents';

  const loadAll = async () => {
    setLoading(true); setError(null);
    try {
      const response = await axios.get(API_URL);
      setIncidents(response.data);
    } catch (err) {
      setError('Не удалось загрузить реестр с сервера.');
    } finally {
      setLoading(false);
    }
  };

  const loadOne = async (id) => {
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      setError(`Ошибка загрузки инцидента #${id}.`);
    }
  };

  const addOne = async (data) => {
    setError(null);
    try {
      const response = await axios.post(API_URL, data);
      setIncidents(prev => [...prev, response.data]);
    } catch (err) {
      setError('Ошибка сохранения.');
      throw err;
    }
  };

  const updateOne = async (id, data) => {
    setError(null);
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      setIncidents(prev => prev.map(item => item.id === id ? response.data : item));
    } catch (err) {
      setError('Ошибка обновления.');
      throw err;
    }
  };

  const deleteOne = async (id) => {
    setError(null);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setIncidents(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError('Ошибка удаления.');
    }
  };

  return (
    <IncidentContext.Provider value={{ incidents, loading, error, loadAll, loadOne, addOne, updateOne, deleteOne }}>
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = () => useContext(IncidentContext);
