import React from 'react';
import './Welcome.css';

function Welcome({ onStartManually }) {
  const handleAddPlayersClick = () => {
    // Do nothing for now as requested
  };

  const handleAddPlayersManuallyClick = () => {
    onStartManually();
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Pickle Park</h1>
        <p className="welcome-subtitle">Organize your players and courts effortlessly</p>
        
        <div className="welcome-buttons">
          <button 
            className="welcome-btn primary"
            onClick={handleAddPlayersClick}
          >
            Add Players
          </button>
          <button 
            className="welcome-btn secondary"
            onClick={handleAddPlayersManuallyClick}
          >
            Add Players Manually
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;