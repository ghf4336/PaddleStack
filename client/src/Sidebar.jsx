import React from 'react';

function Sidebar({
  sessionPlayers,
  courts,
  pausedPlayers,
  playerName,
  setPlayerName,
  handleAddPlayer,
  handleLoadTestData,
  handleEnablePausedPlayer,
  handleRemovePlayer,
  toast,
  toastTimeout,
  generalQueue
}) {
  return (
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
        {[...sessionPlayers]
          .sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0))
          .map((p, i) => {
            const inCourt = courts.some(court => (court.players || []).some(cp => cp && cp.name === p.name));
            const isPaused = pausedPlayers.some(pp => pp.name === p.name);
            return (
              <div className={`session-player${isPaused ? ' paused' : ''}`} key={p.name} style={isPaused ? { opacity: 0.5, background: '#f6f6fa' } : {}}>
                <span>{p.name} {p.paid && <span className="paid-badge">Paid</span>} {isPaused && <span className="paused-badge" style={{ background: '#bbb', color: '#222', borderRadius: 6, padding: '2px 8px', fontSize: 13, marginLeft: 6 }}>Paused</span>}</span>
                {isPaused ? (
                  <button
                    className="enable-btn"
                    title="Enable player"
                    style={{ marginLeft: 8, background: '#19c37d', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, padding: '4px 12px', cursor: 'pointer' }}
                    onClick={() => handleEnablePausedPlayer(p)}
                  >Enable</button>
                ) : (
                  <button
                    className="remove-btn"
                    title="Remove or pause player"
                    disabled={inCourt}
                    onClick={() => {
                      if (inCourt) {
                        if (toast && toastTimeout && toastTimeout.current) {
                          clearTimeout(toastTimeout.current);
                        }
                        return;
                      }
                      handleRemovePlayer(p);
                    }}
                  >×</button>
                )}
              </div>
            );
          })}
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
  );
}

export default Sidebar;
