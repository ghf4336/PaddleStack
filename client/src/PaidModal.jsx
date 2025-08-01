import React from 'react';

function PaidModal({ show, hasPaid, onPaidChange, onConfirm, onCancel }) {
  if (!show) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h4>Has the player paid?</h4>
        <label>
          <input
            type="checkbox"
            checked={hasPaid}
            onChange={e => onPaidChange(e.target.checked)}
          />{' '}
          Paid
        </label>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-btn">Confirm</button>
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default PaidModal;
