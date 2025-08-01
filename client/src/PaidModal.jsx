import React from 'react';

function PaidModal({ show, hasPaid, onPaidChange, onConfirm, onCancel }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'absolute',
      top: 60,
      left: 0,
      width: '100%',
      zIndex: 10,
      background: 'rgba(255,255,255,0.95)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
      borderRadius: 12,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: 120
    }}>
      <h4 style={{ marginBottom: 16 }}>Has the player paid?</h4>
      <label style={{ fontSize: 16, marginBottom: 20 }}>
        <input
          type="checkbox"
          checked={hasPaid}
          onChange={e => onPaidChange(e.target.checked)}
        />{' '}
        Paid
      </label>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={onConfirm} className="confirm-btn">Confirm</button>
        <button onClick={onCancel} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
}

export default PaidModal;
