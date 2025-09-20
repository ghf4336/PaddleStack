/**
 * Parse player file content (supports both tab-delimited and space-aligned formats)
 * Expected formats: 
 * - Old format: "Name\tPayment Type\tPhone Number" or "Name        Payment Type    Phone Number    Status     Played"
 * - New format: "First Name\tLast Name\tPayment Type\tPhone Number" or "First Name   Last Name   Payment Type    Phone Number    Status     Played"
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
  const isSpaceAligned = !isTabDelimited && firstLine.includes('Name') && firstLine.includes('Payment Type');
  
  // Detect if it's the new format with separate first/last name columns
  const hasFirstLastName = firstLine.toLowerCase().includes('first name') && firstLine.toLowerCase().includes('last name');

  // Skip header line if it exists
  let dataLines = lines;
  if (lines.length > 0) {
    const headerLine = lines[0].toLowerCase();
    if ((headerLine.includes('name') && headerLine.includes('payment')) || 
        (headerLine.includes('first name') && headerLine.includes('last name'))) {
      dataLines = lines.slice(1);
      // Also skip separator line in space-aligned format (line with dashes)
      if (dataLines.length > 0 && dataLines[0].trim().match(/^-+(\s+-+)*$/)) {
        dataLines = dataLines.slice(1);
      }
    }
  }

  const players = [];

  for (const line of dataLines) {
    let firstName, lastName, paymentType, phone;

    if (isTabDelimited) {
      // Handle tab-delimited format
      const parts = line.split('\t');
      if (hasFirstLastName && parts.length >= 3) {
        // New format: First Name, Last Name, Payment Type, Phone Number
        firstName = parts[0]?.trim();
        lastName = parts[1]?.trim();
        paymentType = parts[2]?.trim();
        phone = parts[3]?.trim() || '';
      } else if (parts.length >= 2) {
        // Old format: Name, Payment Type, Phone Number
        const fullName = parts[0]?.trim();
        if (fullName) {
          const nameParts = fullName.split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }
        paymentType = parts[1]?.trim();
        phone = parts[2]?.trim() || '';
      }
    } else {
      // Handle space-aligned format
      const parts = line.split(/\s{2,}/).filter(part => part.trim());
      if (hasFirstLastName && parts.length >= 3) {
        // New format: First Name, Last Name, Payment Type, Phone Number, Status, Played
        firstName = parts[0]?.trim();
        lastName = parts[1]?.trim();
        paymentType = parts[2]?.trim();
        // For space-aligned format, only use phone if it's actually a phone number
        if (parts.length >= 4) {
          const fourthPart = parts[3]?.trim();
          // Check if fourth part looks like a phone number (contains digits or is empty)
          if (fourthPart && (fourthPart.match(/\d/) || fourthPart === '')) {
            phone = fourthPart;
          } else {
            phone = ''; // Fourth part is probably Status column
          }
        } else {
          phone = '';
        }
      } else if (parts.length >= 2) {
        // Old format: Name, Payment Type, Phone Number, Status, Played
        const fullName = parts[0]?.trim();
        if (fullName) {
          const nameParts = fullName.split(' ');
          firstName = nameParts[0] || '';
          lastName = nameParts.slice(1).join(' ') || '';
        }
        paymentType = parts[1]?.trim();
        // For space-aligned format, only use phone if it's actually a phone number
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
      }
    }

    if (firstName && paymentType) {
      // Skip deleted players (ignore lines with "(deleted)")
      const fullName = `${firstName}${lastName ? ` ${lastName}` : ''}`;
      if (fullName.includes('(deleted)')) {
        continue;
      }

      // Determine if player has paid based on payment type
      const paid = paymentType === 'online' || paymentType === 'cash';

      players.push({
        firstName,
        lastName,
        name: fullName, // Keep for backward compatibility
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