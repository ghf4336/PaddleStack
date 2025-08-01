
import React, { useState, useEffect } from 'react';

const PAID_OPTIONS = [
  { value: 'online', label: 'Paid online', paid: true },
  { value: 'cash', label: 'Paid cash', paid: true },
  { value: 'later', label: 'Pay later', paid: false },
];

function PaidModal({ show, hasPaid, onPaidChange, onConfirm, onCancel }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // Reset selection when modal opens
    if (show) setSelected(null);
  }, [show]);

  const handleRadioChange = (val) => {
    setSelected(val);
    const paid = val === 'online' || val === 'cash';
    onPaidChange(paid);
  };

  const handleConfirm = () => {
    if (selected) onConfirm();
  };

  if (!show) return null;
  return (
    <div style={{
      position: 'absolute',
      top: 60,
      left: 0,
      width: '100%',
      zIndex: 10,
      background: '#fff', // Opaque background
      boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
      borderRadius: 12,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: 120
    }}>
      <h4 style={{ marginBottom: 16 }}>Has the player paid?</h4>
      <div style={{ display: 'flex', gap: 24, marginBottom: 8 }}>
        {PAID_OPTIONS.slice(0,2).map(opt => (
          <label key={opt.value} style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="radio"
              name="paid-option"
              value={opt.value}
              checked={selected === opt.value}
              onChange={() => handleRadioChange(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            type="radio"
            name="paid-option"
            value="later"
            checked={selected === 'later'}
            onChange={() => handleRadioChange('later')}
          />
          Pay later
        </label>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={handleConfirm} className="confirm-btn" disabled={!selected}>Confirm</button>
        <button onClick={onCancel} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
}

export default PaidModal;
