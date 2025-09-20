// Utility function for generating player download data
// Extracted from EndSessionModal for easier testing
import { getPlayerFullName } from './playerUtils';
export function generatePlayerDownloadData(sessionPlayers, deletedPlayers = [], uploadedPlayers = []) {
  // Create a comprehensive player list that merges uploaded players with session updates
  const playerMap = new Map();

  // First, add all uploaded players as the base
  uploadedPlayers.forEach(player => {
    const playerName = getPlayerFullName(player);
    playerMap.set(playerName.toLowerCase(), {
      ...player,
      source: 'uploaded'
    });
  });

  // Then, update/add players from the current session (these take priority)
  sessionPlayers.forEach(player => {
    const playerName = getPlayerFullName(player);
    const key = playerName.toLowerCase();
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
    const playerName = getPlayerFullName(player);
    const key = playerName.toLowerCase();
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

  // Create sets for quick lookup of session participants
  const sessionPlayerNames = new Set(sessionPlayers.map(p => getPlayerFullName(p).toLowerCase()));
  const deletedPlayerNames = new Set(deletedPlayers.map(p => getPlayerFullName(p).toLowerCase()));

  // Convert map to array and sort by Played status in descending order, then by name
  const allPlayers = Array.from(playerMap.values()).sort((a, b) => {
    // Determine if players participated in this session
    const aName = getPlayerFullName(a).toLowerCase();
    const bName = getPlayerFullName(b).toLowerCase();
    const playedA = sessionPlayerNames.has(aName) || deletedPlayerNames.has(aName) ? 'Yes' : 'No';
    const playedB = sessionPlayerNames.has(bName) || deletedPlayerNames.has(bName) ? 'Yes' : 'No';
    
    // Primary sort: by Played status (Yes before No)
    const playedComparison = playedB.localeCompare(playedA);
    if (playedComparison !== 0) {
      return playedComparison;
    }
    
    // Secondary sort: by name for consistent ordering within same Played group
    return getPlayerFullName(a).localeCompare(getPlayerFullName(b));
  });

  if (allPlayers.length === 0) return '';

  // Calculate column widths
  const headers = ['First Name', 'Last Name', 'Payment Type', 'Phone Number', 'Status', 'Played'];
  const rows = allPlayers.map(p => {
    const status = p.source === 'deleted' ? 'DELETED' :
                  p.source === 'new' ? 'NEW' :
                  p.source === 'updated' ? 'UPDATED' : 'ORIGINAL';
    const fullName = getPlayerFullName(p);
    const displayName = p.source === 'deleted' ? `${fullName} (deleted)` : fullName;
    const firstName = p.firstName || (p.name ? p.name.split(' ')[0] : '');
    const lastName = p.lastName || (p.name ? p.name.split(' ').slice(1).join(' ') : '');
    const payment = p.payment || (p.paid ? 'paid' : 'unknown');
    const phone = p.phone || '';
    const playerName = getPlayerFullName(p);
    const played = sessionPlayerNames.has(playerName.toLowerCase()) || deletedPlayerNames.has(playerName.toLowerCase()) ? 'Yes' : 'No';
    return [firstName, lastName, payment, phone, status, played];
  });

  // Determine max width for each column
  const colWidths = headers.map((header, i) => {
    return Math.max(
      header.length,
      ...rows.map(row => row[i].length)
    );
  });

  // Helper to pad a string
  function pad(str, len) {
    return str + ' '.repeat(len - str.length);
  }

  // Build the table
  const lines = [];
  lines.push(headers.map((h, i) => pad(h, colWidths[i])).join('  '));
  lines.push(colWidths.map(w => '-'.repeat(w)).join('  '));
  for (const row of rows) {
    lines.push(row.map((cell, i) => pad(cell, colWidths[i])).join('  '));
  }

  return lines.join('\r\n');
}