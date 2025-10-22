/**
 * Session storage utility for automatic persistence using localStorage
 */

const STORAGE_KEY = 'paddlestack_session';
const LAST_SAVE_KEY = 'paddlestack_last_save';

/**
 * Save session state to localStorage
 * @param {Object} state - The session state to save
 * @param {Array} state.sessionPlayers - Active session players
 * @param {Array} state.pausedPlayers - Paused players
 * @param {Array} state.deletedPlayers - Soft-deleted players
 * @param {Array} state.uploadedPlayers - Players from uploaded file
 * @param {Array} state.courts - Court state
 */
export function saveSessionState(state) {
  try {
    const dataToSave = {
      sessionPlayers: state.sessionPlayers || [],
      pausedPlayers: state.pausedPlayers || [],
      deletedPlayers: state.deletedPlayers || [],
      uploadedPlayers: state.uploadedPlayers || [],
      courts: state.courts || [],
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    localStorage.setItem(LAST_SAVE_KEY, Date.now().toString());
    return true;
  } catch (error) {
    console.error('Failed to save session state:', error);
    return false;
  }
}

/**
 * Load session state from localStorage
 * @returns {Object|null} The restored session state or null if no saved state exists
 */
export function loadSessionState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    
    // Validate that we have at least some session data
    const hasData = 
      (data.sessionPlayers && data.sessionPlayers.length > 0) ||
      (data.pausedPlayers && data.pausedPlayers.length > 0) ||
      (data.deletedPlayers && data.deletedPlayers.length > 0) ||
      (data.courts && data.courts.length > 0);
    
    if (!hasData) return null;
    
    return {
      sessionPlayers: data.sessionPlayers || [],
      pausedPlayers: data.pausedPlayers || [],
      deletedPlayers: data.deletedPlayers || [],
      uploadedPlayers: data.uploadedPlayers || [],
      courts: data.courts || [],
      timestamp: data.timestamp
    };
  } catch (error) {
    console.error('Failed to load session state:', error);
    return null;
  }
}

/**
 * Clear saved session state from localStorage
 */
export function clearSessionState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_SAVE_KEY);
  } catch (error) {
    console.error('Failed to clear session state:', error);
  }
}

/**
 * Get the timestamp of the last save
 * @returns {number|null} Timestamp in milliseconds or null if no save exists
 */
export function getLastSaveTimestamp() {
  try {
    const timestamp = localStorage.getItem(LAST_SAVE_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    console.error('Failed to get last save timestamp:', error);
    return null;
  }
}

/**
 * Format time difference for display (e.g., "2 minutes ago")
 * @param {number} timestamp - Timestamp in milliseconds
 * @returns {string} Formatted time difference
 */
export function formatTimeSince(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) {
    return 'just now';
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}
