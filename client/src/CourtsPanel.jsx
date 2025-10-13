import React, { useState, useRef, useEffect } from 'react';
import DraggablePlayer from './components/DraggablePlayer';
import DroppableArea from './components/DroppableArea';
import { generateDragId, generateCourtDragId } from './utils/dragDrop';
import { formatPlayerDisplayName } from './utils/playerUtils';
import './CourtsPanel.css';

function CourtsPanel({ courts, courtToRemove, handleRemoveCourt, handleConfirmRemoveCourt, handleCancelRemoveCourt, handleAddCourt, handleCompleteGame, activeId, overId }) {
  // Track courts that have "Starting" status locally for 60 seconds after Complete is clicked
  // Use a stable court id (court.number) as the key so timers remain correct if the courts array is reordered
  // Use Set-based state for boolean membership to avoid timestamp render inconsistencies when many courts update
  const [justStartedSet, setJustStartedSet] = useState(new Set()); // Set<courtId>
  const justStartedTimers = useRef({});

  // Track recently completed courts locally so multiple courts can be highlighted simultaneously
  const [recentlyCompletedSet, setRecentlyCompletedSet] = useState(new Set()); // Set<courtId>
  const recentlyCompletedTimers = useRef({});

  // Track temporarily disabled Complete buttons (so they can't be clicked again for 10s)
  const [disabledButtonsSet, setDisabledButtonsSet] = useState(new Set()); // Set<courtId>
  const disabledButtonsTimers = useRef({});

  const markJustStarted = (courtId) => {
    // clear existing timer if any
    if (justStartedTimers.current[courtId]) {
      clearTimeout(justStartedTimers.current[courtId]);
    }
    // add to set
    setJustStartedSet(prev => {
      const copy = new Set(prev);
      copy.add(courtId);
      return copy;
    });
    // remove after 60s
    justStartedTimers.current[courtId] = setTimeout(() => {
      setJustStartedSet(prev => {
        const copy = new Set(prev);
        copy.delete(courtId);
        return copy;
      });
      delete justStartedTimers.current[courtId];
    }, 60000);
  };

  useEffect(() => {
    return () => {
      // cleanup timers on unmount
      Object.values(justStartedTimers.current).forEach(t => clearTimeout(t));
      Object.values(recentlyCompletedTimers.current).forEach(t => clearTimeout(t));
      Object.values(disabledButtonsTimers.current).forEach(t => clearTimeout(t));
    };
  }, []);

  const markRecentlyCompleted = (courtId) => {
    // clear existing timer if any
    if (recentlyCompletedTimers.current[courtId]) {
      clearTimeout(recentlyCompletedTimers.current[courtId]);
    }
    // add to set
    setRecentlyCompletedSet(prev => {
      const copy = new Set(prev);
      copy.add(courtId);
      return copy;
    });
    // remove after 10s
    recentlyCompletedTimers.current[courtId] = setTimeout(() => {
      setRecentlyCompletedSet(prev => {
        const copy = new Set(prev);
        copy.delete(courtId);
        return copy;
      });
      delete recentlyCompletedTimers.current[courtId];
    }, 10000);
  };

  const disableButtonTemporarily = (courtId, ms = 10000) => {
    if (disabledButtonsTimers.current[courtId]) {
      clearTimeout(disabledButtonsTimers.current[courtId]);
    }
    setDisabledButtonsSet(prev => {
      const copy = new Set(prev);
      copy.add(courtId);
      return copy;
    });
    disabledButtonsTimers.current[courtId] = setTimeout(() => {
      setDisabledButtonsSet(prev => {
        const copy = new Set(prev);
        copy.delete(courtId);
        return copy;
      });
      delete disabledButtonsTimers.current[courtId];
    }, ms);
  };

  return (
    <div className="courts-panel">
      <div className="courts-header">
        <div className="courts-header-content">
          <span className="courts-header-label">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="8" r="3" stroke="#fff" strokeWidth="2"/>
              <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 9 7 9s7-3.75 7-9c0-3.87-3.13-7-7-7z" stroke="#fff" strokeWidth="2" fill="none"/>
            </svg>
            <span className="courts-header-text">Courts ({courts.length})</span>
          </span>
          <button
            className="add-court-btn"
            onClick={handleAddCourt}
            disabled={courts.length >= 8}
          >
            + Add Court
          </button>
        </div>
      </div>
      <div className="courts-list">
        {courts.map((court, idx) => {
          // prefer a stable court id for per-court timers/state
          const courtId = court.number;
          // Use only the internal per-court recentlyCompletedSet (keyed by courtId) as the source of truth
          // This avoids mismatches with the externally-provided `recentlyCompletedCourt` prop when multiple
          // courts are completed at the same time.
          const highlight = recentlyCompletedSet.has(courtId);
           // Use the same computed highlight for the button so both card and button clear at the same time
           const completedRecently = highlight;
          const courtDragId = generateCourtDragId(idx);
          const isCourtBeingDragged = activeId === courtDragId;
          const isCourtDropTarget = overId === courtDragId;
          
          return (
            <DroppableArea
              key={court.number}
              id={courtDragId}
              isDropTarget={isCourtDropTarget && activeId && activeId.startsWith('court-reorder-')}
            >
              {isCourtBeingDragged ? (
                <div className="court-card ghost-court">
                  <span style={{ color: '#999', fontWeight: 600 }}>Moving Court {court.number}</span>
                </div>
              ) : (
                <div
                  className={`court-card ${highlight ? 'highlight' : ''} ${isCourtDropTarget ? 'drop-target' : ''}`}
                >
                  <div className="court-header">
                    <DraggablePlayer
                      id={courtDragId}
                      player={{ name: `Court ${court.number}` }}
                    >
                      <span className="court-drag-handle">⋮⋮</span>
                    </DraggablePlayer>
                    <span className="court-title">Court {court.number}</span>
                    {court.players && court.players.length === 4 ? (
                      justStartedSet.has(courtId) ? (
                        <span className="court-status-badge starting">Starting</span>
                      ) : (
                        <span className="court-status-badge active">Active</span>
                      )
                    ) : (
                      <span className="court-status-badge waiting">Waiting</span>
                    )}
                    <button
                      className="remove-court-btn"
                      title="Remove court"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCourt(idx);
                      }}
                    >
                      ×
                    </button>
                  </div>
                  {courtToRemove === idx && (
                    <div className="remove-court-popup">
                      <div className="remove-court-popup-title">Remove this court?</div>
                      <div className="remove-court-popup-text">
                        Are you sure you want to remove this court?<br />Any players on this court will be returned to the queue.
                      </div>
                      <div className="remove-court-popup-actions">
                        <button
                          className="confirm-remove-court-btn"
                          onClick={handleConfirmRemoveCourt}
                        >
                          Remove
                        </button>
                        <button
                          className="cancel-remove-court-btn"
                          onClick={handleCancelRemoveCourt}
                        >
                          Keep
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="court-players-grid">
                    {court.players && court.players.length === 4 ? (
                      [0, 1, 2, 3].map(i => {
                        const dragId = generateDragId('court', i, idx);
                        const p = court.players[i];
                        return (
                          <DroppableArea
                            key={i}
                            id={dragId}
                            isDropTarget={overId === dragId}
                          >
                            {activeId === dragId ? (
                              <div className="queue-player ghost-player court-player-slot">
                                <span style={{ textAlign: 'center', width: '100%' }}>{p ? formatPlayerDisplayName(p) : <span style={{ color: '#bbb' }}>Player {i + 1}</span>}</span>
                              </div>
                            ) : (
                              <DraggablePlayer
                                id={dragId}
                                player={p}
                              >
                                <div className="queue-player court-player-slot">
                                  <span style={{ textAlign: 'center', width: '100%' }}>{p ? formatPlayerDisplayName(p) : <span style={{ color: '#bbb' }}>Player {i + 1}</span>}</span>
                                </div>
                              </DraggablePlayer>
                            )}
                          </DroppableArea>
                        );
                      })
                    ) : (
                      <div className="court-waiting-text">
                        Waiting for players...
                      </div>
                    )}
                  </div>
                  <button
                    className={`complete-game-btn ${completedRecently ? 'completed' : 'default'}`}
                    title={disabledButtonsSet.has(courtId) ? 'Next players coming up' : 'Complete game'}
                    onClick={() => {
                      handleCompleteGame(idx);
                      markJustStarted(courtId);
                      markRecentlyCompleted(courtId);
                      disableButtonTemporarily(courtId);
                    }}
                    disabled={completedRecently || disabledButtonsSet.has(courtId) || !(court.players && court.players.length === 4)}
                  >
                    ✓
                  </button>
                  </div>
              )}
            </DroppableArea>
          );
        })}
      </div>
    </div>
  );
}

export default CourtsPanel;
