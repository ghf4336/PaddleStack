
import React, { useState } from 'react';
import './App.css';


function App() {
  const [playerName, setPlayerName] = useState('');
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [sessionPlayers, setSessionPlayers] = useState([]);
  const [courts, setCourts] = useState([]); // Array of { number, players: [] }

  // Add court (empty, not auto-assigned)
  const handleAddCourt = () => {
    if (courts.length >= 8) return;
    setCourts(prev => [
      ...prev,
      {
        number: prev.length + 1,
        players: []
      }
    ]);
  };

  // Assign players to free courts when possible and remove them from next up
  React.useEffect(() => {
    setCourts(prevCourts => {
      let assignedIndices = new Set();
      let updated = prevCourts.map((court, idx) => {
        // Always assign a unique group of 4 unassigned players to each court
        let group = [];
        for (let i = 0; i < sessionPlayers.length && group.length < 4; i++) {
          if (!assignedIndices.has(i)) {
            group.push(sessionPlayers[i]);
            assignedIndices.add(i);
          }
        }
        return { ...court, players: group };
      });
      return updated;
    });
  }, [sessionPlayers, courts.length]);

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

  // Calculate indices of players currently assigned to courts
  const assignedIndices = new Set();
  courts.forEach(court => {
    (court.players || []).forEach(player => {
      const idx = sessionPlayers.findIndex(p => p && player && p.name === player.name);
      if (idx !== -1) assignedIndices.add(idx);
    });
  });
  // Next up: first 4 * number of courts unassigned players
  const nextUpPlayers = sessionPlayers.filter((_, i) => !assignedIndices.has(i)).slice(0, courts.length * 4);
  const generalQueue = sessionPlayers.filter((_, i) => !assignedIndices.has(i)).slice(courts.length * 4);

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
          <h3>Next Up ({nextUpPlayers.length}/{courts.length * 4})</h3>
          <div className="nextup-desc">Next {courts.length * 4} players to enter any available court</div>
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
            <div key={court.number} className="court-card" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 20, minWidth: 220, minHeight: 180, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 18 }}>Court {court.number}</span>
                <span style={{ marginLeft: 12, background: '#19c37d', color: '#fff', fontWeight: 600, fontSize: 14, borderRadius: 8, padding: '2px 10px' }}>Active</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%', marginBottom: 12 }}>
                {court.players && court.players.length === 4 ? (
                  [0, 1, 2, 3].map(i => {
                    const p = court.players[i];
                    return (
                      <div key={i} style={{ background: '#f6f6fa', borderRadius: 6, padding: '8px 10px', minHeight: 36, display: 'flex', alignItems: 'center', fontWeight: 500, fontSize: 15 }}>
                        <span style={{ color: '#19c37d', fontSize: 18, marginRight: 6 }}>●</span>
                        <span>{p ? p.name : <span style={{ color: '#bbb' }}>Player {i + 1}</span>}</span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ gridColumn: 'span 2', color: '#bbb', textAlign: 'center', padding: '16px 0', fontWeight: 500 }}>
                    Waiting for players...
                  </div>
                )}
              </div>
              {/* Game Complete and Remove Court buttons will be added in next steps */}
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;
