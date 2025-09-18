/**
 * Parse tab-delimited player file content
 * Expected format: "Name\tPayment Type\tPhone Number"
 * Ignores deleted players (lines containing "(deleted)")
 * @param {string} fileContent - Raw file content
 * @returns {Array} Array of player objects
 */
export function parsePlayerFile(fileContent) {
  if (!fileContent || typeof fileContent !== 'string') {
    return [];
  }

  const lines = fileContent.split(/\r?\n/).filter(line => line.trim());
  
  // Skip header line if it exists
  const dataLines = lines.filter((line, index) => {
    if (index === 0 && line.toLowerCase().includes('name') && line.toLowerCase().includes('payment')) {
      return false; // Skip header
    }
    return true;
  });

  const players = [];

  for (const line of dataLines) {
    const parts = line.split('\t');
    if (parts.length >= 2) {
      const name = parts[0]?.trim();
      const paymentType = parts[1]?.trim();
      const phone = parts[2]?.trim() || '';

      // Skip deleted players (ignore lines with "(deleted)")
      if (!name || name.includes('(deleted)')) {
        continue;
      }

      // Determine if player has paid based on payment type
      const paid = paymentType === 'online' || paymentType === 'cash';

      players.push({
        name,
        payment: paymentType,
        phone,
        paid
      });
    }
  }

  return players;
}

/**
 * Handle file upload and parse content
 * @param {File} file - The uploaded file
 * @returns {Promise<Array>} Promise that resolves to array of player objects
 */
export function uploadAndParsePlayerFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.name.toLowerCase().endsWith('.txt')) {
      reject(new Error('Please upload a .txt file'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        const players = parsePlayerFile(content);
        resolve(players);
      } catch (error) {
        reject(new Error('Error parsing file: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsText(file);
  });
}