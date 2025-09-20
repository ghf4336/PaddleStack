import React, { useState, useEffect, useRef } from 'react';

const PAID_OPTIONS = [
  { value: 'online', label: 'Paid online', paid: true },
  { value: 'cash', label: 'Paid cash', paid: true },
];

function AddPlayerModal({ show, onPaidChange, onConfirm, onCancel, uploadedPlayers = [], existingNames = [] }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [payment, setPayment] = useState('');
  const [touched, setTouched] = useState(false);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const justSelectedRef = useRef(false);
  const dropdownInteractingRef = useRef(false);

  useEffect(() => {
    if (show) {
      setFirstName('');
      setLastName('');
      setPhone('');
      setPayment('');
      setTouched(false);
      setFilteredPlayers([]);
      setShowDropdown(false);
      setDuplicateError(false);
      justSelectedRef.current = false;
    }
  }, [show]);

  // Filter uploaded players based on name input
  useEffect(() => {
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName && uploadedPlayers.length > 0) {
      const filtered = uploadedPlayers.filter(player => {
        // Use the name field which should be properly constructed by the parser
        const playerFullName = player.name || '';
        return playerFullName.toLowerCase().includes(fullName.toLowerCase());
      });
      setFilteredPlayers(filtered);
      // Don't show dropdown immediately after selection to prevent flash
      if (!justSelectedRef.current) {
        setShowDropdown(filtered.length > 0);
      }
    } else {
      setFilteredPlayers([]);
      setShowDropdown(false);
    }
    // Clear the justSelected flag after processing
    justSelectedRef.current = false;
  }, [firstName, lastName, uploadedPlayers]);

  // Check for duplicate names
  useEffect(() => {
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName && existingNames.length > 0) {
      setDuplicateError(existingNames.some(name => name.toLowerCase() === fullName.toLowerCase()));
    } else {
      setDuplicateError(false);
    }
  }, [firstName, lastName, existingNames]);

  // Notify parent of paid status
  useEffect(() => {
    if (onPaidChange) {
      const paid = payment === 'online' || payment === 'cash';
      onPaidChange(paid);
    }
  }, [payment, onPaidChange]);

  const handleConfirm = () => {
    setTouched(true);
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    if (trimmedFirstName && payment && !duplicateError) {
      onConfirm({ 
        firstName: trimmedFirstName, 
        lastName: trimmedLastName,
        phone: phone.trim(), 
        payment 
      });
    }
  };

  const handlePlayerSelect = (player) => {
    justSelectedRef.current = true;
    // Support both old format (single name) and new format (firstName + lastName)
    if (player.firstName && player.lastName) {
      setFirstName(player.firstName);
      setLastName(player.lastName);
    } else if (player.name) {
      // Try to split the old single name format
      const nameParts = player.name.trim().split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
    }
    setPhone(player.phone || '');
    setPayment(player.payment || '');
    setShowDropdown(false);
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleNameBlur = (e) => {
    // Delay hiding dropdown to allow for click selection
    setTimeout(() => setShowDropdown(false), 150);
  };

  const handleNameFocus = () => {
    if (filteredPlayers.length > 0) {
      setShowDropdown(true);
    }
  };

  if (!show) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
        borderRadius: 12,
        padding: 32,
        width: '90%',
        maxWidth: 480,
        minWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        minHeight: 120,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ marginRight: 8, display: 'inline-flex', alignItems: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4v16m8-8H4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: 20 }}>Add New Player</h3>
        <button onClick={onCancel} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }} aria-label="Close">×</button>
      </div>
      <div style={{ marginBottom: 12, position: 'relative' }}>
        <label style={{ fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 4 }}>
          <span style={{ marginRight: 4, display: 'inline-flex', alignItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span> Player Name *
        </label>
        <div style={{ display: 'flex', gap: '30px' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={handleFirstNameChange}
              onBlur={handleNameBlur}
              onFocus={handleNameFocus}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: touched && !firstName.trim() || duplicateError ? '1.5px solid #e74c3c' : '1.5px solid #d1d5db',
                borderRadius: 8,
                fontSize: 16,
                outline: 'none',
                marginBottom: 2
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={handleLastNameChange}
              onBlur={handleNameBlur}
              onFocus={handleNameFocus}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: touched && !firstName.trim() || duplicateError ? '1.5px solid #e74c3c' : '1.5px solid #d1d5db',
                borderRadius: 8,
                fontSize: 16,
                outline: 'none',
                marginBottom: 2
              }}
            />
          </div>
        </div>
        {touched && !firstName.trim() && (
          <span style={{ color: '#e74c3c', fontSize: 13 }}>First name is required</span>
        )}
        {duplicateError && (
          <span style={{ color: '#e74c3c', fontSize: 13 }}>A player with this name is already added</span>
        )}

        {/* Player dropdown */}
        {showDropdown && filteredPlayers.length > 0 && (
          <div
            className="player-dropdown"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              maxHeight: 200,
              overflowY: 'auto'
            }}
            onMouseDown={e => e.preventDefault()}
          >
            {filteredPlayers.map((player, index) => {
              // Use the name field which should be properly constructed by the parser
              const displayName = player.name || '';
              return (
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
                  <div style={{ fontWeight: 500 }}>{displayName}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {player.phone && `${player.phone}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 500, fontSize: 15, display: 'block', marginBottom: 4 }}>
          <span style={{ marginRight: 4, display: 'inline-flex', alignItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span> Phone Number 
        </label>
        <input
          type="tel"
          placeholder="Enter phone number"
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
          <span style={{ marginRight: 4, display: 'inline-flex', alignItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="1" y1="10" x2="23" y2="10" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span> Payment Method *
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
            background: '#22c55e',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            opacity: firstName.trim() && payment && !duplicateError ? 1 : 0.7,
            boxShadow: touched && !(firstName.trim() && payment && !duplicateError) ? '0 0 0 2px #e74c3c55' : 'none',
            transition: 'box-shadow 0.2s'
          }}
        >Confirm</button>
      </div>
      </div>
    </div>
  );
}

export default AddPlayerModal;
