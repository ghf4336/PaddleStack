/**
 * Parse player file content (supports both tab-delimited and space-aligned formats)
 * Expected formats: 
 * - Old format: "Name\tPayment Type\tPhone Number" or "Name        Payment Type    Phone Number    Status     Played"
 * - New format: "First Name\tLast Name\tPayment Type\tPhone Number" or "First Name   Last Name   Payment Type    Phone Number    Status     Played"
 * Ignores deleted players (lines containing "(deleted)" in name or "DELETED" in status column)
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
  
  // Also check if it's a 3-column format: FirstName, LastName, PaymentType (even without explicit headers)
  const potentialThreeColumn = isTabDelimited && !hasFirstLastName;

  // Skip header line if it exists
  let dataLines = lines;
  let isSwappedFormat = false;
  if (lines.length > 0) {
    const headerLine = lines[0].toLowerCase();
    if ((headerLine.includes('name') && headerLine.includes('payment')) || 
        (headerLine.includes('first name') && headerLine.includes('last name'))) {
      dataLines = lines.slice(1);
      // Check if it's a swapped format (Payment Type comes before Name)
      if (headerLine.indexOf('payment') < headerLine.indexOf('name')) {
        isSwappedFormat = true;
      }
      // Also skip separator line in space-aligned format (line with dashes)
      if (dataLines.length > 0 && dataLines[0].trim().match(/^-+(\s+-+)*$/)) {
        dataLines = dataLines.slice(1);
      }
    }
  }

  const players = [];

  for (const line of dataLines) {
    // Skip deleted players early (ignore lines with "(deleted)" or "DELETED" status)
    if (line.includes('(deleted)') || line.includes('DELETED')) {
      continue;
    }

    let firstName = '', lastName = '', paymentType = '', phone = '';

    if (isTabDelimited) {
      // Handle tab-delimited format
      const parts = line.split('\t');
      
      // Check if this looks like the standard format: FirstName, LastName, PaymentType, Phone, Status, Played
      if (parts.length >= 3) {
        const col1 = parts[0]?.trim();
        const col2 = parts[1]?.trim();
        const col3 = parts[2]?.trim();
        const col4 = parts[3]?.trim() || '';
        
        // Check if col3 is a payment method (this confirms the standard format)
        if (col3 === 'online' || col3 === 'cash') {
          // Standard format: FirstName, LastName (may be empty), PaymentType, Phone, Status, Played
          firstName = col1;
          lastName = col2; // May be empty string
          paymentType = col3;
          phone = col4;
        } else if (hasFirstLastName && parts.length >= 3) {
          // Explicit header format: First Name, Last Name, Payment Type, Phone Number
          firstName = col1;
          lastName = col2;
          paymentType = col3;
          phone = col4;
        } else {
          // Fallback to old logic for backward compatibility
          if (isSwappedFormat || col1 === 'online' || col1 === 'cash') {
            // Swapped format: Payment, Name, Phone
            paymentType = col1;
            if (col2) {
              const nameParts = col2.split(' ');
              firstName = nameParts[0] || '';
              lastName = nameParts.slice(1).join(' ') || '';
            }
            phone = col3;
          } else {
            // Normal order: Name, Payment, Phone
            if (col1) {
              const nameParts = col1.split(' ');
              firstName = nameParts[0] || '';
              lastName = nameParts.slice(1).join(' ') || '';
            }
            paymentType = col2;
            phone = col3;
          }
        }
      }
    } else {
      // Handle space-aligned format - use fixed column positions based on header
      const rawParts = line.split(/\s+/);
      
      if (rawParts.length >= 3) {
        // For space-aligned format, we need to handle fixed-width columns
        // The format is: First Name | Last Name | Payment Type | Phone Number | Status | Played
        // We can determine this by the position of payment types and phone patterns
        
        // Find the payment type column (should be 'online' or 'cash')
        let paymentIndex = -1;
        for (let i = 0; i < rawParts.length; i++) {
          if (rawParts[i] === 'online' || rawParts[i] === 'cash') {
            paymentIndex = i;
            break;
          }
        }
        
        if (paymentIndex >= 0) {
          // Payment type found, now determine column positions
          paymentType = rawParts[paymentIndex];
          
          // Phone number should be the next column after payment
          let phoneIndex = paymentIndex + 1;
          phone = '';
          if (phoneIndex < rawParts.length) {
            const potentialPhone = rawParts[phoneIndex];
            // Check if it looks like a phone number (contains digits and/or dashes, but not pure letters)
            if (potentialPhone.match(/[\d-]/) && !potentialPhone.match(/^[A-Za-z]+$/)) {
              phone = potentialPhone;
            }
          }
          
          // Everything before payment type is name (first + last)
          const nameParts = rawParts.slice(0, paymentIndex);
          
          if (nameParts.length === 1) {
            // Only first name
            firstName = nameParts[0];
            lastName = '';
          } else if (nameParts.length === 2) {
            // First and last name
            firstName = nameParts[0];
            lastName = nameParts[1];
          } else if (nameParts.length > 2) {
            // Multiple parts - assume first is first name, rest is last name
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(' ');
          } else {
            // Fallback
            firstName = nameParts.join(' ');
            lastName = '';
          }
        } else {
          // No payment type found, fallback to old logic
          firstName = rawParts[0] || '';
          lastName = '';
          paymentType = rawParts[1] || '';
          if (rawParts.length > 2 && rawParts[2].match(/[\d-]/) && !rawParts[2].match(/^[A-Za-z]+$/)) {
            phone = rawParts[2];
          }
        }
      }
    }

    if (firstName && paymentType) {
      // Determine if player has paid based on payment type
      const paid = paymentType === 'online' || paymentType === 'cash';
      
      // Construct full name for backward compatibility
      const fullName = `${firstName}${lastName ? ` ${lastName}` : ''}`;

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