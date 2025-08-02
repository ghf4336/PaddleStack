

import React, { useState, useRef } from 'react';
// End Session Modal with PIN
function EndSessionModal({ open, onClose, onConfirm, sessionPlayers }) {
  const [pin, setPin] = React.useState("");
  const [error, setError] = React.useState("");
  const [showDownload, setShowDownload] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setPin("");
      setError("");
      setShowDownload(false);
    }
  }, [open]);
  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (pin === "1111") {
      setError("");
      setShowDownload(true);
    } else {
      setError("Incorrect PIN. Please try again.");
    }
  }

  function handleDownload() {
    if (!sessionPlayers || sessionPlayers.length === 0) return;
    const lines = [
      'Name\tPayment Type\tPhone Number',
      ...sessionPlayers.map(p => `${p.name}\t${p.payment || (p.paid ? 'paid' : 'unpaid')}\t${p.phone || ''}`)
    ];
    const text = lines.join('\r\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PaddleStack-Players.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  return (
    <div className="modal-overlay">
      <div className="modal end-session-modal">
        <h2>End Session?</h2>
        <p>This will stop all games and clear all players, courts, and queue data. This action cannot be undone.</p>
        {!showDownload ? (
          <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <label htmlFor="end-session-pin" style={{ display: 'block', marginBottom: 8 }}>Enter PIN to confirm:</label>
            <input
              id="end-session-pin"
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
              autoFocus
              style={{ fontSize: '1.1em', padding: '6px 12px', borderRadius: 6, border: '1px solid #ccc', marginBottom: 8 }}
              placeholder="Enter PIN"
            />
            {error && <div style={{ color: '#e74c3c', marginBottom: 8 }}>{error}</div>}
            <div className="modal-actions">
              <button className="danger" type="submit">Yes, End Session</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        ) : (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p>Download the player list before ending the session?</p>
            <button onClick={handleDownload} style={{ marginRight: 12 }}>Download Player List</button>
            <button className="danger" onClick={() => { setShowDownload(false); onConfirm(); }}>End Session Now</button>
            <button style={{ marginLeft: 12 }} onClick={onClose}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
import './App.css';
import Sidebar from './Sidebar';
import Toast from './Toast';
import PlayerActionModal from './PlayerActionModal';
import PaidModal from './PaidModal';
import NextUpSection from './NextUpSection';
import CourtsPanel from './CourtsPanel';

function App() {
  // Toast state
  const [toast, setToast] = useState(null);
  const toastTimeout = useRef();
  // Remove court handler with in-panel confirmation (must be inside App)
  const [courtToRemove, setCourtToRemove] = useState(null); // index of court to remove or null
  const handleRemoveCourt = (courtIdx) => {
    setCourtToRemove(courtIdx);
  };
  // End Session modal state
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);

  function handleEndSession() {
    setSessionPlayers([]);
    setPausedPlayers([]);
    setCourts([]);
    setShowPaidModal(false);
    setShowPlayerActionModal(false);
    setPlayerToAction(null);
    setToast(null);
    setShowEndSessionModal(false);
  }

  const handleConfirmRemoveCourt = () => {
    setCourts(prevCourts => {
      const court = prevCourts[courtToRemove];
      if (court && court.players && court.players.length > 0) {
        setSessionPlayers(prevPlayers => {
          // Remove these players from their current positions in the queue
          const namesToRemove = court.players.map(p => p.name);
          const filtered = prevPlayers.filter(p => !namesToRemove.includes(p.name));
          // Add them to the end, preserving their order
          return [...filtered, ...court.players];
        });
      }
      // Remove the court and renumber
      const filtered = prevCourts.filter((_, idx) => idx !== courtToRemove);
      return filtered.map((c, i) => ({ ...c, number: i + 1 }));
    });
    setCourtToRemove(null);
  };

  const handleCancelRemoveCourt = () => {
    setCourtToRemove(null);
  };
  const [showPaidModal, setShowPaidModal] = useState(false);
  // Session players: static order, never reorders
  const [sessionPlayers, setSessionPlayers] = useState([]);
  const [pausedPlayers, setPausedPlayers] = useState([]); // Array of { name, paid, addedAt }
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

  // Complete game handler
  const handleCompleteGame = (courtIdx) => {
    setCourts(prevCourts => {
      const court = prevCourts[courtIdx];
      if (!court.players || court.players.length !== 4) return prevCourts;
      // Move finished players to end of sessionPlayers
      setSessionPlayers(prevPlayers => {
        const finishedNames = court.players.map(p => p.name);
        // Remove finished players from their current positions
        const filtered = prevPlayers.filter(p => !finishedNames.includes(p.name));
        // Add finished players to the end, preserving their order
        const finishedPlayers = prevPlayers.filter(p => finishedNames.includes(p.name));
        return [...filtered, ...finishedPlayers];
      });
      // Clear the court's players immediately
      return prevCourts.map((c, idx) => idx === courtIdx ? { ...c, players: [] } : c);
    });
  };

  // Assign players to free courts when possible, always in sessionPlayers order
  React.useEffect(() => {
    setCourts(prevCourts => {
      // Find all assigned player names (to courts)
      const assignedNames = new Set();
      prevCourts.forEach(court => {
        (court.players || []).forEach(player => {
          if (player && player.name) assignedNames.add(player.name);
        });
      });

      // Get unassigned players in order
      const queue = sessionPlayers.filter(p => !assignedNames.has(p.name));
      let queueIdx = 0;

      // Assign players to courts in order
      const newCourts = prevCourts.map(court => {
        if (court.players && court.players.length === 4) {
          return court;
        }
        const group = [];
        for (let i = 0; i < 4; i++) {
          if (queueIdx < queue.length) {
            group.push(queue[queueIdx]);
            queueIdx++;
          }
        }
        if (group.length === 4) {
          return { ...court, players: group };
        } else {
          return { ...court, players: [] };
        }
      });
      return newCourts;
    });
  }, [sessionPlayers, courts.length]);

  // Test data for quick loading
  const testPlayers = [
    { name: 'Alice', paid: true, payment: 'online', phone: '555-1111' },
    { name: 'Bob', paid: false, payment: 'unpaid', phone: '555-2222' },
    { name: 'Charlie', paid: true, payment: 'cash', phone: '555-3333' },
    { name: 'Diana', paid: true, payment: 'online', phone: '555-4444' },
    { name: 'Eve', paid: false, payment: 'unpaid', phone: '555-5555' },
    { name: 'adrian', paid: true, payment: 'cash', phone: '555-6666' },
    { name: 'shelby', paid: true, payment: 'online', phone: '555-7777' },
    { name: 'Peter', paid: true, payment: 'cash', phone: '555-8888' },
    { name: 'Jarred', paid: true, payment: 'online', phone: '555-9999' },
    { name: 'Frank', paid: true, payment: 'cash', phone: '555-0000' }
  ];

  const handleLoadTestData = () => {
    // Add addedAt timestamps to test players
    const now = Date.now();
    setSessionPlayers(testPlayers.map((p, i) => ({ ...p, addedAt: now + i })));
  };

  // Calculate indices of players currently assigned to courts
  const assignedIndices = new Set();
  courts.forEach(court => {
    (court.players || []).forEach(player => {
      const idx = sessionPlayers.findIndex(p => p && player && p.name === player.name);
      if (idx !== -1) assignedIndices.add(idx);
    });
  });
  // Next up: first 4 unassigned and not paused players
  const unpausedSessionPlayers = sessionPlayers.filter(p => !pausedPlayers.some(pp => pp.name === p.name));
  const nextUpPlayers = unpausedSessionPlayers.filter((_, i) => !assignedIndices.has(i)).slice(0, 4);
  const generalQueue = unpausedSessionPlayers.filter((_, i) => !assignedIndices.has(i)).slice(4);

  // Open modal to add player
  const handleAddPlayer = () => {
    setShowPaidModal(true);
  };

  // Confirm from PaidModal
  const handleConfirmAdd = ({ name, phone, payment }) => {
    // Ensure unique name
    let baseName = name.trim();
    let newName = baseName;
    let count = 2;
    const existingNames = sessionPlayers.map(p => p.name);
    while (existingNames.includes(newName)) {
      newName = `${baseName} (${count})`;
      count++;
    }
    const paid = payment === 'online' || payment === 'cash';
    setSessionPlayers([
      ...sessionPlayers,
      { name: newName, phone: phone || '', paid, payment, addedAt: Date.now() }
    ]);
    setShowPaidModal(false);
  };

  const handleCancelAdd = () => {
    setShowPaidModal(false);
  };

  // Remove/pause player modal state
  const [playerToAction, setPlayerToAction] = useState(null); // { name, paid, addedAt }
  const [showPlayerActionModal, setShowPlayerActionModal] = useState(false);

  const handleRemovePlayer = (player) => {
    setPlayerToAction(player);
    setShowPlayerActionModal(true);
  };

  const handleConfirmDeletePlayer = () => {
    setSessionPlayers(sessionPlayers.filter(sp => sp.name !== playerToAction.name));
    setPausedPlayers(pausedPlayers.filter(pp => pp.name !== playerToAction.name));
    setShowPlayerActionModal(false);
    setPlayerToAction(null);
  };

  const handleConfirmPausePlayer = () => {
    setPausedPlayers([...pausedPlayers, playerToAction]);
    setShowPlayerActionModal(false);
    setPlayerToAction(null);
  };

  const handleCancelPlayerAction = () => {
    setShowPlayerActionModal(false);
    setPlayerToAction(null);
  };

  const handleEnablePausedPlayer = (player) => {
    setPausedPlayers(pausedPlayers.filter(pp => pp.name !== player.name));
    setSessionPlayers(prevPlayers => {
      // Remove the player from their current position
      const filtered = prevPlayers.filter(p => p.name !== player.name);
      // Add them to the end
      return [...filtered, { ...player, addedAt: Date.now() }];
    });
  };

  // Render PaidModal inside Sidebar using a portal-like prop
  const paidModalInSidebar = (
    <PaidModal
      show={showPaidModal}
      onPaidChange={() => {}}
      onConfirm={handleConfirmAdd}
      onCancel={handleCancelAdd}
    />
  );
  if (typeof window !== 'undefined') {
    window.__PaidModalInSidebar = paidModalInSidebar;
  }
  return (
    <div className="app-container">
      <Sidebar
        sessionPlayers={sessionPlayers}
        courts={courts}
        pausedPlayers={pausedPlayers}
        handleAddPlayer={handleAddPlayer}
        handleLoadTestData={handleLoadTestData}
        handleEnablePausedPlayer={handleEnablePausedPlayer}
        handleRemovePlayer={handleRemovePlayer}
        toast={toast}
        toastTimeout={toastTimeout}
        generalQueue={generalQueue}
        // End Session button slot
        endSessionButton={
          <div style={{ position: 'absolute', bottom: 16, left: 0, width: '100%', textAlign: 'center' }}>
            <button
              className="end-session-btn"
              style={{ opacity: 0.5, fontSize: '0.9em', background: 'none', color: '#e74c3c', border: 'none', cursor: 'pointer', padding: 0, margin: 0 }}
              onClick={() => setShowEndSessionModal(true)}
              title="End session (clears all data)"
            >
              End Session
            </button>
          </div>
        }
      />
      <EndSessionModal
        open={showEndSessionModal}
        onClose={() => setShowEndSessionModal(false)}
        onConfirm={handleEndSession}
        sessionPlayers={sessionPlayers}
      />
      <Toast message={toast} />

      <PlayerActionModal
        show={showPlayerActionModal}
        player={playerToAction}
        onDelete={handleConfirmDeletePlayer}
        onPause={handleConfirmPausePlayer}
        onCancel={handleCancelPlayerAction}
      />

      {/* Main content: Next Up display and Courts */}
      <div className="main-content" style={{ display: 'flex', gap: '24px' }}>
        <NextUpSection nextUpPlayers={nextUpPlayers} />
        <CourtsPanel
          courts={courts}
          courtToRemove={courtToRemove}
          handleRemoveCourt={handleRemoveCourt}
          handleConfirmRemoveCourt={handleConfirmRemoveCourt}
          handleCancelRemoveCourt={handleCancelRemoveCourt}
          handleAddCourt={handleAddCourt}
          handleCompleteGame={handleCompleteGame}
        />
      </div>
    </div>
  );
}

export default App;
