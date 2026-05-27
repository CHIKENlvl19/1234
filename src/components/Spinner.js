import React from 'react';

const Spinner = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
      {/* Сам кружок загрузки */}
      <div style={{
        width: '50px',
        height: '50px',
        border: '6px solid #e2e8f0', // Серый фон кольца
        borderTop: '6px solid #2b6cb0', // Синяя вращающаяся часть
        borderRadius: '50%',
        animation: 'spin 1s linear infinite' // Привязка к анимации
      }}></div>
      <p style={{ marginTop: '15px', color: '#4a5568' }}>Синхронизация с сервером...</p>

      {/* Встроенные стили для анимации (чтобы не создавать отдельный CSS файл) */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Spinner;