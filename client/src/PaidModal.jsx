

import React, { useState, useEffect } from 'react';

const PAID_OPTIONS = [
  { value: 'online', label: 'Paid online', paid: true },
  { value: 'cash', label: 'Paid cash', paid: true },
  { value: 'later', label: 'Pay later', paid: false },
];

function AddPlayerModal({ show, onPaidChange, onConfirm, onCancel }) {
  const [playerName, setPlayerName] = useState('');
  const [phone, setPhone] = useState('');
  const [payment, setPayment] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (show) {
      setPlayerName('');
      setPhone('');
      setPayment('');
      setTouched(false);
    }
  }, [show]);

  // Notify parent of paid status
  useEffect(() => {
    if (onPaidChange) {
      const paid = payment === 'online' || payment === 'cash';
      onPaidChange(paid);
    }
  }, [payment, onPaidChange]);

  const handleConfirm = () => {
    setTouched(true);
    if (playerName.trim() && payment) {
      onConfirm({ name: playerName.trim(), phone: phone.trim(), payment });
    }
  };

  if (!show) return null;
  return (
    <div style={{
      position: 'absolute',
      top: 60,
      left: 0,
      width: '100%',
      zIndex: 10,
      background: '#fff',
      boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
      borderRadius: 12,
      padding: 24,
      minWidth: 340,
      maxWidth: 400,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      minHeight: 120
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 22, marginRight: 8 }}>👤➕</span>
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: 20 }}>Add New Player</h3>
        <button onClick={onCancel} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }} aria-label="Close">×</button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 4 }}>
          Player Name *
        </label>
        <input
          type="text"
          placeholder="Enter player name"
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: touched && !playerName.trim() ? '1.5px solid #e74c3c' : '1.5px solid #d1d5db',
            borderRadius: 8,
            fontSize: 16,
            outline: 'none',
            marginBottom: 2
          }}
        />
        {touched && !playerName.trim() && (
          <span style={{ color: '#e74c3c', fontSize: 13 }}>Name is required</span>
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 4 }}>
          <span style={{ marginRight: 4 }}>📞</span> Phone Number 
        </label>
        <input
          type="tel"
          placeholder="(555) 123-4567"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1.5px solid #d1d5db',
            borderRadius: 8,
            fontSize: 16,
            outline: 'none',
            marginBottom: 2
          }}
        />
        <span style={{ color: '#888', fontSize: 12 }}>For notifications and emergency contact</span>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label htmlFor="payment-method-select" style={{ fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 4 }}>
          <span style={{ marginRight: 4 }}>💰</span> Payment Method *
        </label>
        <select
          id="payment-method-select"
          value={payment}
          onChange={e => setPayment(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: touched && !payment ? '1.5px solid #e74c3c' : '1.5px solid #d1d5db',
            borderRadius: 8,
            fontSize: 16,
            outline: 'none',
            background: payment ? '#fff' : '#f3f4f6',
            color: payment ? '#222' : '#888',
            marginBottom: 2
          }}
        >
          <option value="" disabled>Select payment method</option>
          {PAID_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {touched && !payment && (
          <span style={{ color: '#e74c3c', fontSize: 13 }}>Payment method is required</span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
        <button
          onClick={onCancel}
          className="cancel-btn"
          style={{
            background: '#fff',
            color: '#222',
            border: '1.5px solid #d1d5db',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 500,
            fontSize: 16,
            cursor: 'pointer'
          }}
        >Cancel</button>
        <button
          onClick={handleConfirm}
          className="confirm-btn"
          style={{
            background: '#11121a',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: 16,
            cursor: playerName.trim() && payment ? 'pointer' : 'not-allowed',
            opacity: playerName.trim() && payment ? 1 : 0.7
          }}
          disabled={!(playerName.trim() && payment)}
        >Confirm</button>
      </div>
    </div>
  );
}

export default AddPlayerModal;
