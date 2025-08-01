import React from 'react';

function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#222',
      color: '#fff',
      padding: '14px 32px',
      borderRadius: 12,
      fontSize: 18,
      fontWeight: 600,
      zIndex: 1000,
      boxShadow: '0 2px 12px #0003',
      pointerEvents: 'none',
    }}>{message}</div>
  );
}

export default Toast;
