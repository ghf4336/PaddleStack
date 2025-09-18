import React from 'react';

function EndSessionModal({ open, onClose, onConfirm, sessionPlayers, deletedPlayers = [], uploadedPlayers = [] }) {
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
    // Create a comprehensive player list that merges uploaded players with session updates
    const playerMap = new Map();
    
    // First, add all uploaded players as the base
    uploadedPlayers.forEach(player => {
      playerMap.set(player.name.toLowerCase(), {
        ...player,
        source: 'uploaded'
      });
    });
    
    // Then, update/add players from the current session (these take priority)
    sessionPlayers.forEach(player => {
      const key = player.name.toLowerCase();
      const existingPlayer = playerMap.get(key);
      
      if (existingPlayer) {
        // Check if the player data actually changed
        const hasChanges = 
          existingPlayer.phone !== (player.phone || '') ||
          existingPlayer.payment !== (player.payment || '') ||
          existingPlayer.paid !== player.paid;
        
        // Update existing player with session data
        playerMap.set(key, {
          ...existingPlayer,
          ...player,
          source: hasChanges ? 'updated' : 'uploaded'
        });
      } else {
        // Add new player from session
        playerMap.set(key, {
          ...player,
          source: 'new'
        });
      }
    });
    
    // Add deleted players (marked as deleted)
    deletedPlayers.forEach(player => {
      const key = player.name.toLowerCase();
      const existingPlayer = playerMap.get(key);
      
      if (existingPlayer) {
        // Mark existing player as deleted
        playerMap.set(key, {
          ...existingPlayer,
          ...player,
          source: 'deleted'
        });
      } else {
        // Add new deleted player
        playerMap.set(key, {
          ...player,
          source: 'deleted'
        });
      }
    });
    
    // Convert map to array and sort by source (uploaded, updated, new, deleted)
    const allPlayers = Array.from(playerMap.values()).sort((a, b) => {
      const sourceOrder = { 'uploaded': 1, 'updated': 2, 'new': 3, 'deleted': 4 };
      return sourceOrder[a.source] - sourceOrder[b.source];
    });
    
    if (allPlayers.length === 0) return;
    
    // Create the download content
    const lines = [
      'Name\tPayment Type\tPhone Number\tStatus',
      ...allPlayers.map(p => {
        const status = p.source === 'deleted' ? 'DELETED' : 
                      p.source === 'new' ? 'NEW' :
                      p.source === 'updated' ? 'UPDATED' : 'ORIGINAL';
        const name = p.source === 'deleted' ? `${p.name} (deleted)` : p.name;
        return `${name}\t${p.payment || (p.paid ? 'paid' : 'unknown')}\t${p.phone || ''}\t${status}`;
      })
    ];
    
    const text = lines.join('\r\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PaddleStack-Players-${new Date().toISOString().split('T')[0]}.txt`;
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

export default EndSessionModal;
