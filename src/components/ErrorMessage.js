import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div style={{ padding: '10px', background: '#fde8e8', color: 'red', marginBottom: '15px', borderRadius: '4px' }}>
      <strong>Ошибка:</strong> {message}
    </div>
  );
};

export default ErrorMessage;