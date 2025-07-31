
import React, { useState } from 'react';
import './App.css';


function App() {
  const [playerName, setPlayerName] = useState('');
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [sessionPlayers, setSessionPlayers] = useState([]);
  const [courts, setCourts] = useState([]); // Array of court numbers

  const handleAddCourt = () => {
    setCourts(prev => prev.length < 8 ? [...prev, { number: prev.length + 1 }] : prev);
  };

  // Test data for quick loading
  const testPlayers = [
    { name: 'Alice', paid: true },
    { name: 'Bob', paid: false },
    { name: 'Charlie', paid: true },
    { name: 'Diana', paid: true },
    { name: 'Eve', paid: false },
    { name: 'Frank', paid: true }
  ];

  const handleLoadTestData = () => {
    setSessionPlayers(testPlayers);
  };

  // Next up: first 4 players, General queue: rest
  const nextUpPlayers = sessionPlayers.slice(0, 4);
  const generalQueue = sessionPlayers.slice(4);

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      setShowPaidModal(true);
    }
  };

  const handleConfirmAdd = () => {
    // Ensure unique name
    let baseName = playerName.trim();
    let newName = baseName;
    let count = 2;
    const existingNames = sessionPlayers.map(p => p.name);
    while (existingNames.includes(newName)) {
      newName = `${baseName} (${count})`;
      count++;
    }
    setSessionPlayers([
      ...sessionPlayers,
      { name: newName, paid: hasPaid }
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
        <button className="load-test-btn" style={{ margin: '8px 0', width: '100%' }} onClick={handleLoadTestData}>
          Load Test Data
        </button>
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
          {generalQueue.map((p, i) => (
            <div className="queue-player" key={i}>
              <span className="queue-dot" /> {p.name}
              <span className="queue-num">#{i + 1}</span>
            </div>
          ))}
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

      {/* Main content: Next Up display and Courts */}
      <div className="main-content" style={{ display: 'flex', gap: '24px' }}>
        <div className="nextup-section">
          <h3>Next Up ({nextUpPlayers.length}/4)</h3>
          <div className="nextup-desc">Next 4 players to enter any available court</div>
          <div className="nextup-grid">
            {[0, 1].map(row => (
              <div className="nextup-row" key={row}>
                {[0, 1].map(col => {
                  const idx = row * 2 + col;
                  const p = nextUpPlayers[idx];
                  return p ? (
                    <div className="nextup-card" key={col}>
                      <div className="nextup-num">#{idx + 1}</div>
                      <div className="nextup-name">{p.name}</div>
                    </div>
                  ) : <div className="nextup-card empty" key={col} role="presentation"></div>;
                })}
              </div>
            ))}
          </div>
        </div>
        {/* Courts Panel */}
        <div className="courts-panel" style={{ minWidth: 320, flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Courts ({courts.length})</h3>
            <button
              className="add-court-btn"
              style={{ padding: '6px 16px', fontWeight: 600, fontSize: 16, opacity: courts.length >= 8 ? 0.5 : 1, cursor: courts.length >= 8 ? 'not-allowed' : 'pointer' }}
              onClick={handleAddCourt}
              disabled={courts.length >= 8}
            >
              + Add Court
            </button>
          </div>
          <div className="courts-list" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 16
          }}>
            {courts.map((court, idx) => (
              <div key={court.number} className="court-card" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 20, minWidth: 220, minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Court {court.number}</div>
                {/* Blank panel for now */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
