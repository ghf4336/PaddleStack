/**
 * Parse player file content (supports both tab-delimited and space-aligned formats)
 * Expected formats: 
 * - Tab-delimited: "Name\tPayment Type\tPhone Number"
 * - Space-aligned: "Name        Payment Type    Phone Number    Status     Played"
 * Ignores deleted players (lines containing "(deleted)")
 * @param {string} fileContent - Raw file content
 * @returns {Array} Array of player objects
 */
export function parsePlayerFile(fileContent) {
  if (!fileContent || typeof fileContent !== 'string') {
    return [];
  }

  const lines = fileContent.split(/\r?\n/).filter(line => line.trim());
  
  if (lines.length === 0) {
    return [];
  }

  // Detect format by checking the first line
  const firstLine = lines[0];
  const isTabDelimited = firstLine.includes('\t');
  const isSpaceAligned = firstLine.includes('Name') && firstLine.includes('Payment Type') && !firstLine.includes('\t');

  // Skip header line if it exists
  let dataLines = lines;
  if (lines.length > 0) {
    const headerLine = lines[0].toLowerCase();
    if (headerLine.includes('name') && headerLine.includes('payment')) {
      dataLines = lines.slice(1);
      // Also skip separator line in space-aligned format (line with dashes)
      if (dataLines.length > 0 && dataLines[0].trim().match(/^-+(\s+-+)*$/)) {
        dataLines = dataLines.slice(1);
      }
    }
  }

  const players = [];

  for (const line of dataLines) {
    let name, paymentType, phone;

    if (isTabDelimited) {
      // Handle old tab-delimited format
      const parts = line.split('\t');
      if (parts.length >= 2) {
        name = parts[0]?.trim();
        paymentType = parts[1]?.trim();
        phone = parts[2]?.trim() || '';
      }
    } else {
      // Handle new space-aligned format
      // Parse by splitting on multiple spaces and filtering out empty strings
      const parts = line.split(/\s{2,}/).filter(part => part.trim());
      if (parts.length >= 2) {
        name = parts[0]?.trim();
        paymentType = parts[1]?.trim();
        // For space-aligned format, only use phone if it's actually a phone number
        // Skip Status and Played columns by only taking the 3rd part if it looks like a phone
        if (parts.length >= 3) {
          const thirdPart = parts[2]?.trim();
          // Check if third part looks like a phone number (contains digits or is empty)
          if (thirdPart && (thirdPart.match(/\d/) || thirdPart === '')) {
            phone = thirdPart;
          } else {
            phone = ''; // Third part is probably Status column
          }
        } else {
          phone = '';
        }
        // Note: Status and Played columns are ignored for import
      }
    }

    if (name && paymentType) {
      // Skip deleted players (ignore lines with "(deleted)")
      if (name.includes('(deleted)')) {
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