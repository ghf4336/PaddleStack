// Drag and drop utilities for PaddleStack

/**
 * Swaps two players in the session players array based on their positions in different queues/courts
 * @param {Array} sessionPlayers - Array of all session players
 * @param {Object} sourceData - { type: 'nextup'|'general'|'court', index: number, courtIndex?: number }
 * @param {Object} targetData - { type: 'nextup'|'general'|'court', index: number, courtIndex?: number }
 * @param {Array} courts - Array of courts
 * @returns {Object} - { newSessionPlayers, newCourts }
 */
export function swapPlayers(sessionPlayers, sourceData, targetData, courts) {
  // Get the current queue positions
  const { nextUpPlayers, generalQueue, assignedIndices } = getQueuePositions(sessionPlayers, courts);
  
  // Find the actual players to swap
  const sourcePlayer = getPlayerFromPosition(sourceData, nextUpPlayers, generalQueue, courts);
  const targetPlayer = getPlayerFromPosition(targetData, nextUpPlayers, generalQueue, courts);
  
  if (!sourcePlayer || !targetPlayer) {
    return { newSessionPlayers: sessionPlayers, newCourts: courts };
  }

  // Create new arrays for the result
  let newSessionPlayers = [...sessionPlayers];
  let newCourts = [...courts];

  // Handle court-to-court swaps
  if (sourceData.type === 'court' && targetData.type === 'court') {
    return swapCourtPlayers(newCourts, sourceData, targetData, sourcePlayer, targetPlayer);
  }

  // Handle court-to-queue or queue-to-court swaps
  if (sourceData.type === 'court' || targetData.type === 'court') {
    return swapCourtAndQueuePlayer(newSessionPlayers, newCourts, sourceData, targetData, sourcePlayer, targetPlayer);
  }

  // Handle queue-to-queue swaps (nextup and general)
  return swapQueuePlayers(newSessionPlayers, sourcePlayer, targetPlayer);
}

/**
 * Gets current queue positions for all players
 */
function getQueuePositions(sessionPlayers, courts) {
  // Calculate indices of players currently assigned to courts
  const assignedIndices = new Set();
  courts.forEach(court => {
    (court.players || []).forEach(player => {
      const idx = sessionPlayers.findIndex(p => p && player && p.name === player.name);
      if (idx !== -1) assignedIndices.add(idx);
    });
  });

  // Get queue players (excluding those in courts)
  const queuePlayers = sessionPlayers.filter((_, i) => !assignedIndices.has(i));
  // Next up section now includes first 8 players (first group: 0-3, second group: 4-7)
  const nextUpPlayers = queuePlayers.slice(0, 8);
  const generalQueue = queuePlayers.slice(8);

  return { nextUpPlayers, generalQueue, assignedIndices };
}

/**
 * Gets a player object from a queue position
 */
function getPlayerFromPosition(positionData, nextUpPlayers, generalQueue, courts) {
  const { type, index, courtIndex } = positionData;

  // Support both first and second group drag IDs for next up section
  if (type === 'nextup') {
    // First group: nextup-0, nextup-1, nextup-2, nextup-3
    return nextUpPlayers[index] || null;
  }
  if (type === 'nextup-2') {
    // Second group: nextup-2-0, nextup-2-1, nextup-2-2, nextup-2-3
    return nextUpPlayers[4 + index] || null;
  }
  if (type === 'general') {
    return generalQueue[index] || null;
  }
  if (type === 'court') {
    if (courtIndex !== undefined && courts[courtIndex] && courts[courtIndex].players) {
      return courts[courtIndex].players[index] || null;
    }
    return null;
  }
  return null;
}

/**
 * Swaps two players both in courts
 */
function swapCourtPlayers(courts, sourceData, targetData, sourcePlayer, targetPlayer) {
  const newCourts = courts.map(court => ({ ...court, players: [...(court.players || [])] }));
  // Swap the players in their respective courts
  if (newCourts[sourceData.courtIndex] && newCourts[sourceData.courtIndex].players) {
    newCourts[sourceData.courtIndex].players[sourceData.index] = targetPlayer;
  }
  if (newCourts[targetData.courtIndex] && newCourts[targetData.courtIndex].players) {
    newCourts[targetData.courtIndex].players[targetData.index] = sourcePlayer;
  }

  // If both players are in the same court, update sessionPlayers order to match court order
  let newSessionPlayers = null;
  if (sourceData.courtIndex === targetData.courtIndex) {
    // Get the new order of players in the court
    const courtPlayers = newCourts[sourceData.courtIndex].players;
    // Find indices in sessionPlayers
    const indices = courtPlayers.map(p => sessionPlayers.findIndex(sp => sp.name === p.name));
    // If all indices are valid, reorder sessionPlayers
    if (indices.every(idx => idx !== -1)) {
      newSessionPlayers = [...sessionPlayers];
      // Replace the players in sessionPlayers at those indices
      indices.forEach((idx, i) => {
        newSessionPlayers[idx] = courtPlayers[i];
      });
    }
  }
  return { newSessionPlayers, newCourts };
}

/**
 * Swaps a player between court and queue
 */
function swapCourtAndQueuePlayer(sessionPlayers, courts, sourceData, targetData, sourcePlayer, targetPlayer) {
  let newSessionPlayers = [...sessionPlayers];
  let newCourts = courts.map(court => ({ ...court, players: [...(court.players || [])] }));

  // Determine which is court and which is queue
  const courtData = sourceData.type === 'court' ? sourceData : targetData;
  const queueData = sourceData.type === 'court' ? targetData : sourceData;
  const courtPlayer = sourceData.type === 'court' ? sourcePlayer : targetPlayer;
  const queuePlayer = sourceData.type === 'court' ? targetPlayer : sourcePlayer;

  // Replace court player with queue player
  if (newCourts[courtData.courtIndex] && newCourts[courtData.courtIndex].players) {
    newCourts[courtData.courtIndex].players[courtData.index] = queuePlayer;
  }

  // Replace queue player with court player in sessionPlayers
  const courtPlayerIndex = newSessionPlayers.findIndex(p => p.name === courtPlayer.name);
  const queuePlayerIndex = newSessionPlayers.findIndex(p => p.name === queuePlayer.name);

  if (courtPlayerIndex !== -1 && queuePlayerIndex !== -1) {
    // Swap their positions in sessionPlayers
    [newSessionPlayers[courtPlayerIndex], newSessionPlayers[queuePlayerIndex]] = 
    [newSessionPlayers[queuePlayerIndex], newSessionPlayers[courtPlayerIndex]];
  }

  return { newSessionPlayers, newCourts };
}

/**
 * Swaps two players in queue positions
 */
function swapQueuePlayers(sessionPlayers, sourcePlayer, targetPlayer) {
  const newSessionPlayers = [...sessionPlayers];
  
  // Find their indices in sessionPlayers
  const sourceIndex = newSessionPlayers.findIndex(p => p.name === sourcePlayer.name);
  const targetIndex = newSessionPlayers.findIndex(p => p.name === targetPlayer.name);

  if (sourceIndex !== -1 && targetIndex !== -1) {
    // Swap their positions
    [newSessionPlayers[sourceIndex], newSessionPlayers[targetIndex]] = 
    [newSessionPlayers[targetIndex], newSessionPlayers[sourceIndex]];
  }

  return { newSessionPlayers, newCourts: null }; // courts unchanged for queue swaps
}

/**
 * Generates a unique ID for drag and drop items
 */
export function generateDragId(type, index, courtIndex = null) {
  if (type === 'court' && courtIndex !== null) {
    return `${type}-${courtIndex}-${index}`;
  }
  return `${type}-${index}`;
}

/**
 * Generates a drag ID for court reordering
 */
export function generateCourtDragId(courtIndex) {
  return `court-reorder-${courtIndex}`;
}

/**
 * Parses a drag ID back into its components
 */
export function parseDragId(dragId) {
  const parts = dragId.split('-');

  // Court reordering
  if (parts[0] === 'court' && parts[1] === 'reorder' && parts.length === 3) {
    return {
      type: 'court-reorder',
      courtIndex: parseInt(parts[2], 10),
      index: null
    };
  }

  // Court player
  if (parts[0] === 'court' && parts.length === 3) {
    return {
      type: 'court',
      courtIndex: parseInt(parts[1], 10),
      index: parseInt(parts[2], 10)
    };
  }

  // Next up second group: nextup-2-x
  if (parts[0] === 'nextup' && parts[1] === '2' && parts.length === 3) {
    return {
      type: 'nextup-2',
      index: parseInt(parts[2], 10),
      courtIndex: null
    };
  }

  // Next up first group: nextup-x
  if (parts[0] === 'nextup' && parts.length === 2) {
    return {
      type: 'nextup',
      index: parseInt(parts[1], 10),
      courtIndex: null
    };
  }

  // General queue: general-x
  if (parts[0] === 'general' && parts.length === 2) {
    return {
      type: 'general',
      index: parseInt(parts[1], 10),
      courtIndex: null
    };
  }

  // Fallback
  return {
    type: parts[0],
    index: parseInt(parts[1], 10),
    courtIndex: null
  };
}

/**
 * Reorders courts by moving source court to target position
 * @param {Array} courts - Array of courts
 * @param {number} sourceIndex - Index of court being moved
 * @param {number} targetIndex - Index where court should be moved to
 * @returns {Array} - New courts array with updated positions and renumbered
 */
export function reorderCourts(courts, sourceIndex, targetIndex) {
  if (sourceIndex === targetIndex) {
    return courts;
  }

  const newCourts = [...courts];
  const [movedCourt] = newCourts.splice(sourceIndex, 1);
  newCourts.splice(targetIndex, 0, movedCourt);

  // Renumber all courts based on their new positions
  return newCourts.map((court, index) => ({
    ...court,
    number: index + 1
  }));
}
