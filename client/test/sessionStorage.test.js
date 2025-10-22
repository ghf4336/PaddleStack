/**
 * Tests for sessionStorage utility
 */

import {
  saveSessionState,
  loadSessionState,
  clearSessionState,
  getLastSaveTimestamp,
  formatTimeSince
} from '../src/utils/sessionStorage';

describe('sessionStorage utility', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('saveSessionState', () => {
    it('should save session state to localStorage', () => {
      const state = {
        sessionPlayers: [{ name: 'Alice', paid: true, addedAt: Date.now() }],
        pausedPlayers: [],
        deletedPlayers: [],
        uploadedPlayers: [],
        courts: []
      };

      const result = saveSessionState(state);
      expect(result).toBe(true);

      const saved = localStorage.getItem('paddlestack_session');
      expect(saved).not.toBeNull();

      const parsed = JSON.parse(saved);
      expect(parsed.sessionPlayers).toEqual(state.sessionPlayers);
      expect(parsed.timestamp).toBeDefined();
    });

    it('should handle missing state properties gracefully', () => {
      const state = {
        sessionPlayers: [{ name: 'Bob', paid: false }]
      };

      const result = saveSessionState(state);
      expect(result).toBe(true);

      const saved = JSON.parse(localStorage.getItem('paddlestack_session'));
      expect(saved.sessionPlayers).toEqual(state.sessionPlayers);
      expect(saved.pausedPlayers).toEqual([]);
      expect(saved.deletedPlayers).toEqual([]);
    });
  });

  describe('loadSessionState', () => {
    it('should load saved session state', () => {
      const state = {
        sessionPlayers: [{ name: 'Charlie', paid: true }],
        pausedPlayers: [{ name: 'Dave', paid: false }],
        deletedPlayers: [],
        uploadedPlayers: [],
        courts: [{ number: 1, players: [] }],
        timestamp: Date.now()
      };

      localStorage.setItem('paddlestack_session', JSON.stringify(state));

      const loaded = loadSessionState();
      expect(loaded).not.toBeNull();
      expect(loaded.sessionPlayers).toEqual(state.sessionPlayers);
      expect(loaded.pausedPlayers).toEqual(state.pausedPlayers);
      expect(loaded.courts).toEqual(state.courts);
    });

    it('should return null if no saved state exists', () => {
      const loaded = loadSessionState();
      expect(loaded).toBeNull();
    });

    it('should return null if saved state has no data', () => {
      const emptyState = {
        sessionPlayers: [],
        pausedPlayers: [],
        deletedPlayers: [],
        uploadedPlayers: [],
        courts: [],
        timestamp: Date.now()
      };

      localStorage.setItem('paddlestack_session', JSON.stringify(emptyState));

      const loaded = loadSessionState();
      expect(loaded).toBeNull();
    });

    it('should return null if localStorage data is corrupt', () => {
      localStorage.setItem('paddlestack_session', 'invalid json {');

      const loaded = loadSessionState();
      expect(loaded).toBeNull();
    });
  });

  describe('clearSessionState', () => {
    it('should clear saved session state', () => {
      const state = {
        sessionPlayers: [{ name: 'Eve', paid: true }],
        pausedPlayers: [],
        deletedPlayers: [],
        uploadedPlayers: [],
        courts: []
      };

      saveSessionState(state);
      expect(localStorage.getItem('paddlestack_session')).not.toBeNull();

      clearSessionState();
      expect(localStorage.getItem('paddlestack_session')).toBeNull();
      expect(localStorage.getItem('paddlestack_last_save')).toBeNull();
    });
  });

  describe('getLastSaveTimestamp', () => {
    it('should return the last save timestamp', () => {
      const now = Date.now();
      localStorage.setItem('paddlestack_last_save', now.toString());

      const timestamp = getLastSaveTimestamp();
      expect(timestamp).toBe(now);
    });

    it('should return null if no timestamp exists', () => {
      const timestamp = getLastSaveTimestamp();
      expect(timestamp).toBeNull();
    });
  });

  describe('formatTimeSince', () => {
    it('should format seconds as "just now"', () => {
      const timestamp = Date.now() - 30 * 1000; // 30 seconds ago
      expect(formatTimeSince(timestamp)).toBe('just now');
    });

    it('should format minutes correctly', () => {
      const timestamp = Date.now() - 2 * 60 * 1000; // 2 minutes ago
      expect(formatTimeSince(timestamp)).toBe('2 minutes ago');
    });

    it('should format single minute correctly', () => {
      const timestamp = Date.now() - 1 * 60 * 1000; // 1 minute ago
      expect(formatTimeSince(timestamp)).toBe('1 minute ago');
    });

    it('should format hours correctly', () => {
      const timestamp = Date.now() - 3 * 60 * 60 * 1000; // 3 hours ago
      expect(formatTimeSince(timestamp)).toBe('3 hours ago');
    });

    it('should format single hour correctly', () => {
      const timestamp = Date.now() - 1 * 60 * 60 * 1000; // 1 hour ago
      expect(formatTimeSince(timestamp)).toBe('1 hour ago');
    });

    it('should format days correctly', () => {
      const timestamp = Date.now() - 2 * 24 * 60 * 60 * 1000; // 2 days ago
      expect(formatTimeSince(timestamp)).toBe('2 days ago');
    });

    it('should format single day correctly', () => {
      const timestamp = Date.now() - 1 * 24 * 60 * 60 * 1000; // 1 day ago
      expect(formatTimeSince(timestamp)).toBe('1 day ago');
    });
  });

  describe('integration test', () => {
    it('should save and restore complete session state', () => {
      const originalState = {
        sessionPlayers: [
          { firstName: 'Alice', lastName: 'Smith', name: 'Alice Smith', paid: true, addedAt: Date.now() },
          { firstName: 'Bob', lastName: 'Jones', name: 'Bob Jones', paid: false, addedAt: Date.now() + 1 }
        ],
        pausedPlayers: [
          { firstName: 'Charlie', lastName: 'Brown', name: 'Charlie Brown', paid: true, addedAt: Date.now() + 2 }
        ],
        deletedPlayers: [],
        uploadedPlayers: [
          { firstName: 'Dave', lastName: 'Wilson', phone: '555-1234' }
        ],
        courts: [
          { number: 1, players: [{ firstName: 'Eve', lastName: 'Davis', paid: true }] }
        ]
      };

      // Save
      saveSessionState(originalState);

      // Load
      const restoredState = loadSessionState();

      // Verify
      expect(restoredState).not.toBeNull();
      expect(restoredState.sessionPlayers).toEqual(originalState.sessionPlayers);
      expect(restoredState.pausedPlayers).toEqual(originalState.pausedPlayers);
      expect(restoredState.deletedPlayers).toEqual(originalState.deletedPlayers);
      expect(restoredState.uploadedPlayers).toEqual(originalState.uploadedPlayers);
      expect(restoredState.courts).toEqual(originalState.courts);
      expect(restoredState.timestamp).toBeDefined();

      // Clear
      clearSessionState();
      const afterClear = loadSessionState();
      expect(afterClear).toBeNull();
    });
  });
});
