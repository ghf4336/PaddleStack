import React, { useState, useRef, useEffect } from 'react';
import DraggablePlayer from './components/DraggablePlayer';
import DroppableArea from './components/DroppableArea';
import { generateDragId, generateCourtDragId } from './utils/dragDrop';

function CourtsPanel({ courts, courtToRemove, handleRemoveCourt, handleConfirmRemoveCourt, handleCancelRemoveCourt, handleAddCourt, handleCompleteGame, activeId, overId }) {
  // Track courts that have "Starting" status locally for 60 seconds after Complete Game is clicked
  // Use a stable court id (court.number) as the key so timers remain correct if the courts array is reordered
  // Use Set-based state for boolean membership to avoid timestamp render inconsistencies when many courts update
  const [justStartedSet, setJustStartedSet] = useState(new Set()); // Set<courtId>
  const justStartedTimers = useRef({});

  // Track recently completed courts locally so multiple courts can be highlighted simultaneously
  const [recentlyCompletedSet, setRecentlyCompletedSet] = useState(new Set()); // Set<courtId>
  const recentlyCompletedTimers = useRef({});

  // Track temporarily disabled Complete Game buttons (so they can't be clicked again for 10s)
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
    <div className="courts-panel" style={{ minWidth: 320, flex: 1 }}>
      <div
        className="courts-header bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          padding: '12px 16px',
          background: 'linear-gradient(to right, #22c55e, #16a34a)', // fallback for Tailwind classes
          color: '#fff',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          margin: '-20px -16px 12px -16px', // Extend to container edges
        }}
      >
        {/* Removed duplicate Courts text, now only icon and label below */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="8" r="3" stroke="#fff" strokeWidth="2"/>
              <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 9 7 9s7-3.75 7-9c0-3.87-3.13-7-7-7z" stroke="#fff" strokeWidth="2" fill="none"/>
            </svg>
            <span style={{ fontWeight: 600, fontSize: 18, color: '#fff' }}>Courts ({courts.length})</span>
          </span>
          <button
            className="add-court-btn"
            style={{ marginLeft: 'auto', padding: '6px 16px', fontWeight: 600, fontSize: 16, opacity: courts.length >= 8 ? 0.5 : 1, cursor: courts.length >= 8 ? 'not-allowed' : 'pointer', background: '#fff', color: '#111827', border: 'none', borderRadius: 6 }}
            onClick={handleAddCourt}
            disabled={courts.length >= 8}
          >
            + Add Court
          </button>
        </div>
      </div>
      <div className="courts-list" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 16
      }}>
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
                <div className="court-card ghost-court" style={{
                  background: '#f0f0f0',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px #0001',
                  padding: 20,
                  minWidth: 220,
                  minHeight: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.5,
                  border: '2px dashed #ccc'
                }}>
                  <span style={{ color: '#999', fontWeight: 600 }}>Moving Court {court.number}</span>
                </div>
              ) : (
                <div
                  className="court-card"
                  style={{
                    background: highlight ? '#19c37d' : '#fff',
                    borderRadius: 12,
                    boxShadow: isCourtDropTarget ? '0 0 0 4px #007acc88, 0 2px 8px #0001' : (highlight ? '0 0 0 4px #19c37d88, 0 2px 8px #0001' : '0 2px 8px #0001'),
                    padding: 20,
                    minWidth: 220,
                    minHeight: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    position: 'relative',
                    transition: 'background 0.3s, box-shadow 0.3s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 8 }}>
                    <DraggablePlayer
                      id={courtDragId}
                      player={{ name: `Court ${court.number}` }}
                    >
                      <span style={{ marginRight: 8, color: '#999', fontSize: 16, cursor: 'grab' }}>⋮⋮</span>
                    </DraggablePlayer>
                    <span style={{ fontWeight: 700, fontSize: 18 }}>Court {court.number}</span>
                    {court.players && court.players.length === 4 ? (
                      justStartedSet.has(courtId) ? (
                        <span style={{
                          marginLeft: 12,
                          background: '#fde68a', // Next-up orange
                          color: '#f59e42',
                          fontWeight: 600,
                          fontSize: 14,
                          borderRadius: 8,
                          padding: '2px 10px'
                        }}>Starting</span>
                      ) : (
                        <span style={{
                          marginLeft: 12,
                          background: '#19c37d',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: 14,
                          borderRadius: 8,
                          padding: '2px 10px'
                        }}>Active</span>
                      )
                    ) : (
                      <span style={{
                        marginLeft: 12,
                        background: '#3b82f6', // General queue blue
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: 14,
                        borderRadius: 8,
                        padding: '2px 10px'
                      }}>Waiting</span>
                    )}
                    <button
                        className="remove-court-btn"
                        title="Remove court"
                        style={{
                          marginLeft: 'auto',
                          background: 'none', // No background
                          color: '#e74c3c', // X is red
                          border: 'none',
                          borderRadius: 8,
                          fontWeight: 700,
                          fontSize: 22,
                          width: 36,
                          height: 36,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'none',
                          outline: 'none',
                          padding: 0
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCourt(idx);
                        }}
                      >
                        ×
                      </button>
                    </div>
                    {courtToRemove === idx && (
                      <div className="remove-court-popup" style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(255,255,255,0.97)',
                        borderRadius: 12,
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 12px #0002',
                        padding: 24
                      }}>
                        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, color: '#e74c3c', textAlign: 'center' }}>Remove this court?</div>
                        <div style={{ fontSize: 15, color: '#333', marginBottom: 20, textAlign: 'center' }}>
                          Are you sure you want to remove this court?<br />Any players on this court will be returned to the queue.
                        </div>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <button
                            className="confirm-remove-court-btn"
                            style={{ background: '#e74c3c', color: '#fff', fontWeight: 700, fontSize: 16, borderRadius: 8, padding: '8px 24px', border: 'none', cursor: 'pointer' }}
                            onClick={handleConfirmRemoveCourt}
                          >
                            Remove
                          </button>
                          <button
                            className="cancel-remove-court-btn"
                            style={{ background: '#bbb', color: '#222', fontWeight: 600, fontSize: 16, borderRadius: 8, padding: '8px 24px', border: 'none', cursor: 'pointer' }}
                            onClick={handleCancelRemoveCourt}
                          >
                            Keep
                          </button>
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%', marginBottom: 12 }}>
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
                                <div className="queue-player ghost-player" style={{ minHeight: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                  <span style={{ textAlign: 'center', width: '100%' }}>{p ? p.name : <span style={{ color: '#bbb' }}>Player {i + 1}</span>}</span>
                                </div>
                              ) : (
                                <DraggablePlayer
                                  id={dragId}
                                  player={p}
                                >
                                  <div className="queue-player" style={{ minHeight: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ textAlign: 'center', width: '100%' }}>{p ? p.name : <span style={{ color: '#bbb' }}>Player {i + 1}</span>}</span>
                                  </div>
                                </DraggablePlayer>
                              )}
                            </DroppableArea>
                          );
                        })
                      ) : (
                        <div style={{ gridColumn: 'span 2', color: '#bbb', textAlign: 'center', padding: '16px 0', fontWeight: 500 }}>
                          Waiting for players...
                        </div>
                      )}
                    </div>
                    <button
                      className="complete-game-btn"
                      style={{
                        width: '100%',
                        // Visual state driven only by completedRecently so it stays in sync with the card
                        background: completedRecently ? '#19c37d' : '#222',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: 16,
                        borderRadius: 8,
                        padding: '10px 0',
                        marginTop: 8,
                        cursor: disabledButtonsSet.has(courtId) ? 'not-allowed' : (court.players && court.players.length === 4 ? 'pointer' : 'not-allowed'),
                        opacity: completedRecently || disabledButtonsSet.has(courtId) ? 1 : (court.players && court.players.length === 4 ? 1 : 0.5),
                        border: 'none',
                        transition: 'background 0.3s'
                      }}
                      onClick={() => {
                        handleCompleteGame(idx);
                        markJustStarted(courtId);
                        markRecentlyCompleted(courtId);
                        disableButtonTemporarily(courtId);
                      }}
                      // Disabled if externally driven, temporarily disabled set, OR during the recently-completed visual period
                      disabled={completedRecently || disabledButtonsSet.has(courtId) || !(court.players && court.players.length === 4)}
                    >
                      {disabledButtonsSet.has(courtId) ? 'Next players' : 'Complete Game'}
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
