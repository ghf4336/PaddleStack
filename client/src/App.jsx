

import React, { useState, useRef } from 'react';
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
  const [playerName, setPlayerName] = useState('');
  const [showPaidModal, setShowPaidModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
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
    { name: 'Alice', paid: true },
    { name: 'Bob', paid: false },
    { name: 'Charlie', paid: true },
    { name: 'Diana', paid: true },
    { name: 'Eve', paid: false },
    { name: 'adrian', paid: true },
    { name: 'shelby', paid: true },
    { name: 'Peter', paid: true },
    { name: 'Jarred', paid: true },
    { name: 'Frank', paid: true }
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
      { name: newName, paid: hasPaid, addedAt: Date.now() }
    ]);
    setPlayerName('');
    setHasPaid(false);
    setShowPaidModal(false);
  };

  const handleCancelAdd = () => {
    setShowPaidModal(false);
    setHasPaid(false);
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

  return (
    <div className="app-container">
      <Sidebar
        sessionPlayers={sessionPlayers}
        courts={courts}
        pausedPlayers={pausedPlayers}
        playerName={playerName}
        setPlayerName={setPlayerName}
        handleAddPlayer={handleAddPlayer}
        handleLoadTestData={handleLoadTestData}
        handleEnablePausedPlayer={handleEnablePausedPlayer}
        handleRemovePlayer={handleRemovePlayer}
        toast={toast}
        toastTimeout={toastTimeout}
        generalQueue={generalQueue}
      />
      <Toast message={toast} />

      <PlayerActionModal
        show={showPlayerActionModal}
        player={playerToAction}
        onDelete={handleConfirmDeletePlayer}
        onPause={handleConfirmPausePlayer}
        onCancel={handleCancelPlayerAction}
      />

      <PaidModal
        show={showPaidModal}
        hasPaid={hasPaid}
        onPaidChange={setHasPaid}
        onConfirm={handleConfirmAdd}
        onCancel={handleCancelAdd}
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
