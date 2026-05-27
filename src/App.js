import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Form from './pages/Form';
import Detail from './pages/Detail';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <Routes>
          {/* Открытый маршрут */}
          <Route path="/login" element={<Login />} />

          {/* Защищенные маршруты (доступны только после логина) */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/add" element={
            <ProtectedRoute>
              <Form />
            </ProtectedRoute>
          } />
          
          <Route path="/detail/:id" element={
            <ProtectedRoute>
              <Detail />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />



          {/* Ловим все несуществующие ссылки */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;