import React, { useRef } from 'react';
import './Welcome.css';
import { uploadAndParsePlayerFile } from './utils/fileUpload';

function Welcome({ onStartManually, onPlayersUploaded }) {
  const fileInputRef = useRef(null);

  const handleAddPlayersClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const uploadedPlayers = await uploadAndParsePlayerFile(file);
      if (uploadedPlayers.length > 0) {
        onPlayersUploaded(uploadedPlayers);
        onStartManually(); // Start the session after successful upload
      } else {
        alert('No valid players found in the file. Please check the file format.');
      }
    } catch (error) {
      alert(error.message);
    }

    // Reset file input
    event.target.value = '';
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
            Upload Players
          </button>
          <button 
            className="welcome-btn secondary"
            onClick={handleAddPlayersManuallyClick}
          >
            Add Players Manually
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}

export default Welcome;