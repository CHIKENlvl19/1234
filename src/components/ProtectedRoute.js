import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Если для маршрута указаны роли, и текущей роли юзера в них нет
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    alert("У вас нет прав администратора для доступа к этой странице!");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;