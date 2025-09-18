// Utility function for generating player download data
// Extracted from EndSessionModal for easier testing
export function generatePlayerDownloadData(sessionPlayers, deletedPlayers = [], uploadedPlayers = []) {
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

  if (allPlayers.length === 0) return '';

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

  return lines.join('\r\n');
}