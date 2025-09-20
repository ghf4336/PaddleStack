import React from 'react';
import { getPlayerFullName } from './utils/playerUtils';

function PlayerActionModal({
  show, player, onDelete, onPause, onCancel
}) {
  if (!show || !player) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h4>Player Options</h4>
        <div style={{ marginBottom: 18, fontSize: 16, color: '#333', textAlign: 'center' }}>
          What would you like to do with <b>{getPlayerFullName(player)}</b>?
        </div>
        <div className="modal-actions" style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button onClick={onDelete} className="confirm-btn" style={{ background: '#e74c3c', color: '#fff', fontWeight: 700, fontSize: 16, borderRadius: 8, padding: '8px 24px', border: 'none', cursor: 'pointer' }}>Delete Player</button>
          <button onClick={onPause} className="pause-btn" style={{ background: '#bbb', color: '#222', fontWeight: 600, fontSize: 16, borderRadius: 8, padding: '8px 24px', border: 'none', cursor: 'pointer' }}>Pause Player</button>
          <button onClick={onCancel} className="cancel-btn" style={{ background: '#eee', color: '#222', fontWeight: 600, fontSize: 16, borderRadius: 8, padding: '8px 24px', border: 'none', cursor: 'pointer' }}>Cancel</button>
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: '#888', textAlign: 'center' }}>
          (Players can only be deleted or paused if not currently in a court)
        </div>
      </div>
    </div>
  );
}

export default PlayerActionModal;
