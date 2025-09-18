import React, { useState, useRef } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { swapPlayers, parseDragId, reorderCourts } from './utils/dragDrop';
import EndSessionModal from './EndSessionModal';
import Welcome from './Welcome';
import './App.css';
import PlayerListSection from './PlayerListSection';
import GeneralQueueSection from './GeneralQueueSection';
import Toast from './Toast';
import PlayerActionModal from './PlayerActionModal';
import AddPlayerModal from "./AddPlayerModal";
import NextUpSection from './NextUpSection';
import CourtsPanel from './CourtsPanel';
import { testPlayers } from './testPlayers';

function App() {
  // Welcome page state
  const [showWelcome, setShowWelcome] = useState(true);
  
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
    setDeletedPlayers([]);
    setUploadedPlayers([]);
    setCourts([]);
    setShowAddPlayerModal(false);
    setShowPlayerActionModal(false);
    setPlayerToAction(null);
    setToast(null);
    setShowEndSessionModal(false);
    setShowWelcome(true); // Return to welcome page
  }

  const handleStartManually = () => {
    setShowWelcome(false);
  };

  const handlePlayersUploaded = (players) => {
    setUploadedPlayers(players);
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
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  // Session players: static order, never reorders
  const [sessionPlayers, setSessionPlayers] = useState([]);
  const [pausedPlayers, setPausedPlayers] = useState([]); // Array of { name, paid, addedAt }
  const [deletedPlayers, setDeletedPlayers] = useState([]); // Array of soft-deleted players
  const [uploadedPlayers, setUploadedPlayers] = useState([]); // Array of players from uploaded file
  const [courts, setCourts] = useState([]); // Array of { number, players: [] }
  const [activeId, setActiveId] = useState(null); // For drag overlay
  const [overId, setOverId] = useState(null); // For drop target highlight

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
    // Batch update: move finished players to end, clear court, and reassign courts in one go
    const court = courts[courtIdx];
    if (!court || !court.players || court.players.length !== 4) return;
    const finishedNames = court.players.map(p => p.name);

    setSessionPlayers(prevPlayers => {
      // Remove finished players from their current positions
      const filtered = prevPlayers.filter(p => !finishedNames.includes(p.name));
      // Add finished players to the end, preserving their order
      const finishedPlayers = prevPlayers.filter(p => finishedNames.includes(p.name));
      return [...filtered, ...finishedPlayers];
    });

    // Clear the completed court - the useEffect will handle reassignment
    setCourts(prevCourts => {
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

      // Get unassigned players in order, excluding paused players
      const queue = sessionPlayers.filter(p => !assignedNames.has(p.name) && !pausedPlayers.some(pp => pp.name === p.name));
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
  }, [sessionPlayers, courts.length, pausedPlayers]);

  // Test data for quick loading

  const handleLoadTestData = () => {
    // Add addedAt timestamps to test players
    const now = Date.now();
    setSessionPlayers(testPlayers.map((p, i) => ({ ...p, addedAt: now + i })));
  };

  // Calculate which players are currently assigned to courts and get queue players
  const assignedPlayerNames = new Set();
  courts.forEach(court => {
    (court.players || []).forEach(player => {
      if (player && player.name) assignedPlayerNames.add(player.name);
    });
  });
  
  // Next up: first 8 unassigned and not paused players (4 in next up, 4 in "2 games")
  const unpausedSessionPlayers = sessionPlayers.filter(p => !pausedPlayers.some(pp => pp.name === p.name));
  const unassignedUnpausedPlayers = unpausedSessionPlayers.filter(p => !assignedPlayerNames.has(p.name));
  const nextUpPlayers = unassignedUnpausedPlayers.slice(0, 8);
  const generalQueue = unassignedUnpausedPlayers.slice(8);
  const nextUpCount = nextUpPlayers.length;

  // Open modal to add player
  const handleAddPlayer = () => {
    setShowAddPlayerModal(true);
  };

  // Confirm from AddPlayerModal
  const handleConfirmAdd = ({ name, phone, payment }) => {
    const paid = payment === 'online' || payment === 'cash';
    setSessionPlayers([
      ...sessionPlayers,
      { name: name.trim(), phone: phone || '', paid, payment, addedAt: Date.now() }
    ]);
    setShowAddPlayerModal(false);
  };

  const handleCancelAdd = () => {
    setShowAddPlayerModal(false);
  };

  // Remove/pause player modal state
  const [playerToAction, setPlayerToAction] = useState(null); // { name, paid, addedAt }
  const [showPlayerActionModal, setShowPlayerActionModal] = useState(false);

  const handleRemovePlayer = (player) => {
    setPlayerToAction(player);
    setShowPlayerActionModal(true);
  };

  const handleConfirmDeletePlayer = () => {
    // Soft delete: move player to deletedPlayers and remove from active arrays
    setDeletedPlayers(prev => [...prev, playerToAction]);
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

  // Render AddPlayerModal inside Sidebar using a portal-like prop
  const AddPlayerModalInSidebar = (
    <AddPlayerModal
      show={showAddPlayerModal}
      onPaidChange={() => {}}
      onConfirm={handleConfirmAdd}
      onCancel={handleCancelAdd}
      uploadedPlayers={uploadedPlayers}
      existingNames={sessionPlayers.map(p => p.name)}
    />
  );
  if (typeof window !== 'undefined') {
    window.__AddPlayerModalInSidebar = AddPlayerModalInSidebar;
  }

  // Handle drag and drop
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setOverId(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null); // Clear active drag item
    setOverId(null); // Clear drop target

    if (!over || active.id === over.id) {
      return; // No valid drop target or dropped on itself
    }

    const sourceData = parseDragId(active.id);
    const targetData = parseDragId(over.id);

    // Handle court reordering
    if (sourceData.type === 'court-reorder' && targetData.type === 'court-reorder') {
      const newCourts = reorderCourts(courts, sourceData.courtIndex, targetData.courtIndex);
      setCourts(newCourts);
      return;
    }

    // Handle regular player swaps
    const result = swapPlayers(sessionPlayers, sourceData, targetData, courts, pausedPlayers);

    // Always update both states if either is changed
    if (result.newSessionPlayers) {
      setSessionPlayers(result.newSessionPlayers);
    }
    if (result.newCourts) {
      setCourts(result.newCourts);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
  };
  const handleDragOver = React.useCallback((event) => {
    setOverId(event.over?.id || null);
  }, []);

  // DragOverlay: show the tile being dragged under the mouse
  const generalQueueStartNum = nextUpCount + 1;
  let dragOverlayContent = null;
  if (activeId) {
    const dragData = parseDragId(activeId);
    let player = null;
    let label = null;
    if (dragData.type === 'general') {
      player = generalQueue[dragData.index];
      if (player) {
        label = (
          <div className="queue-player ghost-player">
            <span>{player.name}</span>
            <span className="queue-num">#{generalQueueStartNum + dragData.index}</span>
          </div>
        );
      }
    } else if (dragData.type === 'nextup') {
      player = nextUpPlayers[dragData.index];
      if (player) {
        label = (
          <div className="nextup-card ghost-player">
            <div className="nextup-num">#{1 + dragData.index}</div>
            <div className="nextup-name">{player.name}</div>
          </div>
        );
      }
    } else if (dragData.type === 'nextup-2') {
      player = nextUpPlayers[4 + dragData.index];
      if (player) {
        label = (
          <div className="nextup-card ghost-player">
            <div className="nextup-num">#{5 + dragData.index}</div>
            <div className="nextup-name">{player.name}</div>
          </div>
        );
      }
    } else if (dragData.type === 'court') {
      const court = courts[dragData.courtIndex];
      player = court && court.players ? court.players[dragData.index] : null;
      label = (
        <div className="queue-player ghost-player" style={{ minHeight: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ textAlign: 'center', width: '100%' }}>{player ? player.name : <span style={{ color: '#bbb' }}>Player {dragData.index + 1}</span>}</span>
        </div>
      );
    }
    dragOverlayContent = label;
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor)
  );

  // Show welcome page if showWelcome is true
  if (showWelcome) {
    return <Welcome onStartManually={handleStartManually} onPlayersUploaded={handlePlayersUploaded} />;
  }

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
    >
      <DragOverlay>{dragOverlayContent}</DragOverlay>
      <div className="app-container">
        <div className="sidebar" style={{ position: 'relative', padding: 0, background: 'none', boxShadow: 'none', border: 'none' }}>
          <PlayerListSection
            sessionPlayers={sessionPlayers}
            courts={courts}
            pausedPlayers={pausedPlayers}
            handleAddPlayer={handleAddPlayer}
            handleLoadTestData={handleLoadTestData}
            handleEnablePausedPlayer={handleEnablePausedPlayer}
            handleRemovePlayer={handleRemovePlayer}
          />
          <GeneralQueueSection
            generalQueue={generalQueue}
            generalQueueStartNum={nextUpCount + 1}
            activeId={activeId}
            overId={overId}
            endSessionButton={
              <div className="queue-player end-session-tile">
                <button
                  className="end-session-btn"
                  onClick={() => setShowEndSessionModal(true)}
                  title="End session (clears all data)"
                >
                  End Session
                </button>
              </div>
            }
          />
        </div>
        <EndSessionModal
          open={showEndSessionModal}
          onClose={() => setShowEndSessionModal(false)}
          onConfirm={handleEndSession}
          sessionPlayers={sessionPlayers}
          deletedPlayers={deletedPlayers}
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
        <div className="main-content" style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <NextUpSection nextUpPlayers={nextUpPlayers} startNum={1} activeId={activeId} overId={overId} />
          </div>
          <CourtsPanel
            courts={courts}
            courtToRemove={courtToRemove}
            handleRemoveCourt={handleRemoveCourt}
            handleConfirmRemoveCourt={handleConfirmRemoveCourt}
            handleCancelRemoveCourt={handleCancelRemoveCourt}
            handleAddCourt={handleAddCourt}
            handleCompleteGame={handleCompleteGame}
            activeId={activeId}
            overId={overId}
          />
        </div>
      </div>
    </DndContext>
  );
}

export default App;
