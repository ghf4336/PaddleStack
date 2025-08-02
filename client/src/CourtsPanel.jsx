import React from 'react';
import DraggablePlayer from './components/DraggablePlayer';
import DroppableArea from './components/DroppableArea';
import { generateDragId } from './utils/dragDrop';

function CourtsPanel({ courts, courtToRemove, handleRemoveCourt, handleConfirmRemoveCourt, handleCancelRemoveCourt, handleAddCourt, handleCompleteGame, activeId, overId, recentlyCompletedCourt, nextPlayersButtonState }) {
  return (
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
        {courts.map((court, idx) => {
          const highlight = recentlyCompletedCourt === idx;
          return (
            <div
              key={court.number}
              className="court-card"
              style={{
                background: highlight ? '#19c37d' : '#fff',
                borderRadius: 12,
                boxShadow: highlight ? '0 0 0 4px #19c37d88, 0 2px 8px #0001' : '0 2px 8px #0001',
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
              <span style={{ fontWeight: 700, fontSize: 18 }}>Court {court.number}</span>
              <span style={{ marginLeft: 12, background: '#19c37d', color: '#fff', fontWeight: 600, fontSize: 14, borderRadius: 8, padding: '2px 10px' }}>Active</span>
              <button
                className="remove-court-btn"
                title="Remove court"
                style={{ marginLeft: 'auto', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => handleRemoveCourt(idx)}
              >
                ×
              </button>
            </div>
            {/* In-panel confirmation popup for removing court */}
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
                background: nextPlayersButtonState[idx] ? '#19c37d' : '#222',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                borderRadius: 8,
                padding: '10px 0',
                marginTop: 8,
                cursor: nextPlayersButtonState[idx] ? 'not-allowed' : (court.players && court.players.length === 4 ? 'pointer' : 'not-allowed'),
                opacity: nextPlayersButtonState[idx] ? 1 : (court.players && court.players.length === 4 ? 1 : 0.5),
                border: 'none',
                transition: 'background 0.3s'
              }}
              onClick={() => handleCompleteGame(idx)}
              disabled={nextPlayersButtonState[idx] || !(court.players && court.players.length === 4)}
            >
              {nextPlayersButtonState[idx] ? 'Next players' : 'Complete Game'}
            </button>
          </div>
          );
        })}
      </div>
    </div>
  );
}

export default CourtsPanel;
