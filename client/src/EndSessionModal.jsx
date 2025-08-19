import React from 'react';

function EndSessionModal({ open, onClose, onConfirm, sessionPlayers, deletedPlayers = [] }) {
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
    const allPlayers = [...sessionPlayers, ...deletedPlayers];
    if (!allPlayers || allPlayers.length === 0) return;
    
    const lines = [
      'Name\tPayment Type\tPhone Number',
  ...sessionPlayers.map(p => `${p.name}\t${p.payment || (p.paid ? 'paid' : 'unknown')}\t${p.phone || ''}`),
  ...deletedPlayers.map(p => `${p.name} (deleted)\t${p.payment || (p.paid ? 'paid' : 'unknown')}\t${p.phone || ''}`)
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

export default EndSessionModal;
