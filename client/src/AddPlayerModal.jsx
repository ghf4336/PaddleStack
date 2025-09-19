import React, { useState, useEffect, useRef } from 'react';

const PAID_OPTIONS = [
  { value: 'online', label: 'Paid online', paid: true },
  { value: 'cash', label: 'Paid cash', paid: true },
];

function AddPlayerModal({ show, onPaidChange, onConfirm, onCancel, uploadedPlayers = [], existingNames = [] }) {
  const [playerName, setPlayerName] = useState('');
  const [phone, setPhone] = useState('');
  const [payment, setPayment] = useState('');
  const [touched, setTouched] = useState(false);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    if (show) {
      // Clear any pending timeout
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
        dropdownTimeoutRef.current = null;
      }
      
      setPlayerName('');
      setPhone('');
      setPayment('');
      setTouched(false);
      setFilteredPlayers([]);
      setShowDropdown(false);
      setDuplicateError(false);
      setIsSelecting(false);
    }
  }, [show]);

  // Filter uploaded players based on name input
  useEffect(() => {
    // Clear any existing timeout
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }

    if (playerName.trim() && uploadedPlayers.length > 0) {
      const filtered = uploadedPlayers.filter(player =>
        player.name.toLowerCase().includes(playerName.toLowerCase())
      );
      setFilteredPlayers(filtered);
      // Add small delay to prevent flash with browser autocomplete
      // Don't show dropdown if we're in the middle of selecting a player
      if (filtered.length > 0 && !isSelecting) {
        dropdownTimeoutRef.current = setTimeout(() => {
          setShowDropdown(true);
          dropdownTimeoutRef.current = null;
        }, 50);
      } else {
        setShowDropdown(false);
      }
    } else {
      setFilteredPlayers([]);
      setShowDropdown(false);
    }
  }, [playerName, uploadedPlayers, isSelecting]);

  // Check for duplicate names
  useEffect(() => {
    if (playerName.trim() && existingNames.length > 0) {
      setDuplicateError(existingNames.some(name => name.toLowerCase() === playerName.trim().toLowerCase()));
    } else {
      setDuplicateError(false);
    }
  }, [playerName, existingNames]);

  // Notify parent of paid status
  useEffect(() => {
    if (onPaidChange) {
      const paid = payment === 'online' || payment === 'cash';
      onPaidChange(paid);
    }
  }, [payment, onPaidChange]);

  const handleConfirm = () => {
    setTouched(true);
    const trimmedName = playerName.trim();
    if (trimmedName && payment && !duplicateError) {
      onConfirm({ name: trimmedName, phone: phone.trim(), payment });
    }
  };

  const handlePlayerSelect = (player) => {
    // Clear any pending dropdown timeout
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    
    setIsSelecting(true);
    setPlayerName(player.name);
    setPhone(player.phone || '');
    setPayment(player.payment || '');
    setShowDropdown(false);
    // Reset the selecting flag after a short delay
    setTimeout(() => setIsSelecting(false), 100);
  };

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleNameBlur = () => {
    // Delay hiding dropdown to allow for click selection
    setTimeout(() => setShowDropdown(false), 150);
  };

  if (!show) return null;
  return (
    <div style={{
      position: 'absolute',
      top: 60,
      left: 0,
      width: '100%',
      zIndex: 10,
      background: '#fff',
      boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
      borderRadius: 12,
      padding: 24,
      minWidth: 340,
      maxWidth: 400,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      minHeight: 120
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 22, marginRight: 8 }}>✚</span>
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: 20 }}>Add New Player</h3>
        <button onClick={onCancel} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }} aria-label="Close">×</button>
      </div>
      <div style={{ marginBottom: 12, position: 'relative' }}>
        <label style={{ fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 4 }}>
          <span style={{ marginRight: 4 }}>👤</span> Player Name *
        </label>
        {/* Hidden input to trick browser autocomplete */}
        <input type="text" style={{ display: 'none' }} />
        <input
          type="text"
          placeholder="Enter player name"
          value={playerName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          autoComplete="new-password"
          data-form-type="other"
          spellCheck="false"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: touched && !playerName.trim() || duplicateError ? '1.5px solid #e74c3c' : '1.5px solid #d1d5db',
            borderRadius: 8,
            fontSize: 16,
            outline: 'none',
            marginBottom: 2
          }}
        />
        {touched && !playerName.trim() && (
          <span style={{ color: '#e74c3c', fontSize: 13 }}>Name is required</span>
        )}
        {duplicateError && (
          <span style={{ color: '#e74c3c', fontSize: 13 }}>A player with this name already exists</span>
        )}

        {/* Player dropdown */}
        {showDropdown && filteredPlayers.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            maxHeight: 200,
            overflowY: 'auto'
          }}>
            {filteredPlayers.map((player, index) => (
              <div
                key={index}
                onClick={() => handlePlayerSelect(player)}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  borderBottom: index < filteredPlayers.length - 1 ? '1px solid #f0f0f0' : 'none',
                  backgroundColor: 'transparent',
                  fontSize: 14
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <div style={{ fontWeight: 500 }}>{player.name}</div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {player.payment && `${player.payment}`}
                  {player.phone && ` • ${player.phone}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 4 }}>
          <span style={{ marginRight: 4 }}>📞</span> Phone Number 
        </label>
        <input
          type="tel"
          placeholder="0221111111"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1.5px solid #d1d5db',
            borderRadius: 8,
            fontSize: 16,
            outline: 'none',
            marginBottom: 2
          }}
        />
        <span style={{ color: '#888', fontSize: 12 }}>For notifications and emergency contact</span>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label htmlFor="payment-method-select" style={{ fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 4 }}>
          <span style={{ marginRight: 4 }}>💰</span> Payment Method *
        </label>
        <select
          id="payment-method-select"
          value={payment}
          onChange={e => setPayment(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: touched && !payment ? '1.5px solid #e74c3c' : '1.5px solid #d1d5db',
            borderRadius: 8,
            fontSize: 16,
            outline: 'none',
            background: payment ? '#fff' : '#f3f4f6',
            color: payment ? '#222' : '#888',
            marginBottom: 2
          }}
        >
          <option value="" disabled>Select payment method</option>
          {PAID_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {touched && !payment && (
          <span style={{ color: '#e74c3c', fontSize: 13 }}>Payment method is required</span>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
        <button
          onClick={onCancel}
          className="cancel-btn"
          style={{
            background: '#fff',
            color: '#222',
            border: '1.5px solid #d1d5db',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 500,
            fontSize: 16,
            cursor: 'pointer'
          }}
        >Cancel</button>
        <button
          onClick={handleConfirm}
          className="confirm-btn"
          style={{
            background: '#11121a',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            opacity: playerName.trim() && payment && !duplicateError ? 1 : 0.7,
            boxShadow: touched && !(playerName.trim() && payment && !duplicateError) ? '0 0 0 2px #e74c3c55' : 'none',
            transition: 'box-shadow 0.2s'
          }}
        >Confirm</button>
      </div>
    </div>
  );
}

export default AddPlayerModal;
