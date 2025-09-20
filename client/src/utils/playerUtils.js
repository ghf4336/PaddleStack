/**
 * Utility functions for player name handling and display
 */

/**
 * Format and clean a player's name: capitalize first letter, lowercase rest, remove spaces.
 * E.g., "aDRIAN " => "Adrian"; "  j o h n  " => "John"
 * @param {string} name - Raw name input
 * @returns {string} Formatted name
 */
export function formatAndCleanPlayerName(name) {
  if (!name || typeof name !== 'string') return '';
  
  // Remove all spaces and trim
  const cleaned = name.replace(/\s+/g, '').trim();
  if (!cleaned) return '';
  
  // Capitalize first letter, lowercase the rest
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

/**
 * Format a player's name for display as "firstName L" (first name + last initial)
 * @param {Object} player - Player object with firstName, lastName, or legacy name field
 * @returns {string} Formatted display name
 */
export function formatPlayerDisplayName(player) {
  if (!player) return '';
  
  // New format: firstName and lastName fields
  if (player.firstName) {
    const lastInitial = player.lastName && player.lastName.length > 0 ? ` ${player.lastName.charAt(0).toUpperCase()}` : '';
    return `${player.firstName}${lastInitial}`;
  }
  
  // Legacy format: single name field
  if (player.name) {
    const nameParts = player.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ');
    const lastInitial = lastName.length > 0 ? ` ${lastName.charAt(0).toUpperCase()}` : '';
    return `${firstName}${lastInitial}`;
  }
  
  return '';
}

/**
 * Get the full name of a player for comparison and storage
 * @param {Object} player - Player object with firstName, lastName, or legacy name field
 * @returns {string} Full name
 */
export function getPlayerFullName(player) {
  if (!player) return '';
  
  // New format: firstName and lastName fields
  if (player.firstName) {
    return `${player.firstName}${player.lastName ? ` ${player.lastName}` : ''}`.trim();
  }
  
  // Legacy format: single name field
  if (player.name) {
    return player.name.trim();
  }
  
  return '';
}

/**
 * Create a new player object with firstName and lastName from legacy name
 * @param {Object} player - Player object with name field
 * @returns {Object} Player object with firstName and lastName fields
 */
export function migratePlayerToNewFormat(player) {
  if (!player) return player;
  
  // Already in new format
  if (player.firstName !== undefined) {
    return player;
  }
  
  // Migrate from legacy format
  if (player.name) {
    const nameParts = player.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ');
    
    return {
      ...player,
      firstName,
      lastName,
      // Keep the original name for backward compatibility during transition
      name: player.name
    };
  }
  
  return player;
}