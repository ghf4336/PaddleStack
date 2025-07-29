
import { useState } from 'react';
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [sessionPlayers, setSessionPlayers] = useState([]);
  const [generalQueue, setGeneralQueue] = useState([]);

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      setShowPaidModal(true);
    }
  };

  const handleConfirmAdd = () => {
    setSessionPlayers([
      ...sessionPlayers,
      { name: playerName, paid: hasPaid }
    ]);
    setPlayerName('');
    setHasPaid(false);
    setShowPaidModal(false);
  };

  const handleCancelAdd = () => {
    setShowPaidModal(false);
    setHasPaid(false);
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h3>Session Players ({sessionPlayers.length})</h3>
        <div className="add-player-row">
          <input
            type="text"
            placeholder="Enter player name"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            className="player-input"
          />
          <button className="add-btn" onClick={handleAddPlayer}>Add</button>
        </div>
        <div className="session-list">
          {sessionPlayers.map((p, i) => (
            <div className="session-player" key={i}>
              <span>{p.name} {p.paid && <span className="paid-badge">Paid</span>}</span>
              <button className="remove-btn" title="Remove player" onClick={() => {
                setSessionPlayers(sessionPlayers.filter((_, idx) => idx !== i));
              }}>×</button>
            </div>
          ))}
        </div>
        <div className="general-queue">
          <h4>General Queue ({generalQueue.length})</h4>
          {/* Placeholder for general queue */}
        </div>
      </div>

      {/* Modal for paid confirmation */}
      {showPaidModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h4>Has the player paid?</h4>
            <label>
              <input
                type="checkbox"
                checked={hasPaid}
                onChange={e => setHasPaid(e.target.checked)}
              />{' '}
              Paid
            </label>
            <div className="modal-actions">
              <button onClick={handleConfirmAdd} className="confirm-btn">Confirm</button>
              <button onClick={handleCancelAdd} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Main content placeholder for right panel */}
      <div className="main-content">
        {/* To be implemented: Next Up, Courts, etc. */}
      </div>
    </div>
  );
}

export default App;
