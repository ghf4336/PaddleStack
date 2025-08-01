import React from 'react';

function NextUpSection({ nextUpPlayers }) {
  return (
    <div className="nextup-section">
      <h3>Next Up ({nextUpPlayers.length}/4)</h3>
      <div className="nextup-desc">Next 4 players to enter any available court</div>
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
  );
}

export default NextUpSection;
