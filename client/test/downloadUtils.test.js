import { generatePlayerDownloadData } from '../src/utils/downloadUtils.js';

describe('generatePlayerDownloadData', () => {
  test('returns empty string when no players', () => {
    const result = generatePlayerDownloadData([], [], []);
    expect(result).toBe('');
  });

  test('downloads only uploaded players with ORIGINAL status', () => {
    const uploadedPlayers = [
      { name: 'Alice', payment: 'online', phone: '555-1111', paid: true },
      { name: 'Bob', payment: 'cash', phone: '555-2222', paid: false }
    ];

    const result = generatePlayerDownloadData([], [], uploadedPlayers);
    expect(result).toBe(
      'Name\tPayment Type\tPhone Number\tStatus\tPlayed\r\n' +
      'Alice\tonline\t555-1111\tORIGINAL\tNo\r\n' +
      'Bob\tcash\t555-2222\tORIGINAL\tNo'
    );
  });

  test('downloads new session players with NEW status', () => {
    const sessionPlayers = [
      { name: 'Charlie', payment: 'online', phone: '555-3333', paid: true },
      { name: 'Diana', payment: 'cash', phone: '', paid: false }
    ];

    const result = generatePlayerDownloadData(sessionPlayers, [], []);
    expect(result).toBe(
      'Name\tPayment Type\tPhone Number\tStatus\tPlayed\r\n' +
      'Charlie\tonline\t555-3333\tNEW\tYes\r\n' +
      'Diana\tcash\t\tNEW\tYes'
    );
  });

  test('merges uploaded and session players with correct status', () => {
    const uploadedPlayers = [
      { name: 'Alice', payment: 'online', phone: '555-1111', paid: true },
      { name: 'Bob', payment: 'cash', phone: '555-2222', paid: false }
    ];

    const sessionPlayers = [
      { name: 'Alice', payment: 'cash', phone: '555-9999', paid: true }, // Updated
      { name: 'Charlie', payment: 'online', phone: '555-3333', paid: true } // New
    ];

    const result = generatePlayerDownloadData(sessionPlayers, [], uploadedPlayers);
    expect(result).toBe(
      'Name\tPayment Type\tPhone Number\tStatus\tPlayed\r\n' +
      'Bob\tcash\t555-2222\tORIGINAL\tNo\r\n' +
      'Alice\tcash\t555-9999\tUPDATED\tYes\r\n' +
      'Charlie\tonline\t555-3333\tNEW\tYes'
    );
  });

  test('marks deleted players with DELETED status', () => {
    const uploadedPlayers = [
      { name: 'Alice', payment: 'online', phone: '555-1111', paid: true },
      { name: 'Bob', payment: 'cash', phone: '555-2222', paid: false }
    ];

    const deletedPlayers = [
      { name: 'Bob', payment: 'cash', phone: '555-2222', paid: false }
    ];

    const result = generatePlayerDownloadData([], deletedPlayers, uploadedPlayers);
    expect(result).toBe(
      'Name\tPayment Type\tPhone Number\tStatus\tPlayed\r\n' +
      'Alice\tonline\t555-1111\tORIGINAL\tNo\r\n' +
      'Bob (deleted)\tcash\t555-2222\tDELETED\tYes'
    );
  });

  test('handles case-insensitive name matching', () => {
    const uploadedPlayers = [
      { name: 'alice', payment: 'online', phone: '555-1111', paid: true }
    ];

    const sessionPlayers = [
      { name: 'Alice', payment: 'cash', phone: '555-9999', paid: true } // Same name, different case
    ];

    const result = generatePlayerDownloadData(sessionPlayers, [], uploadedPlayers);
    expect(result).toBe(
      'Name\tPayment Type\tPhone Number\tStatus\tPlayed\r\n' +
      'Alice\tcash\t555-9999\tUPDATED\tYes'
    );
  });

  test('only marks as UPDATED when data actually changes', () => {
    const uploadedPlayers = [
      { name: 'Alice', payment: 'online', phone: '555-1111', paid: true }
    ];

    const sessionPlayers = [
      { name: 'Alice', payment: 'online', phone: '555-1111', paid: true } // Same data
    ];

    const result = generatePlayerDownloadData(sessionPlayers, [], uploadedPlayers);
    expect(result).toBe(
      'Name\tPayment Type\tPhone Number\tStatus\tPlayed\r\n' +
      'Alice\tonline\t555-1111\tORIGINAL\tYes'
    );
  });

  test('handles complex scenario with all player types', () => {
    const uploadedPlayers = [
      { name: 'Alice', payment: 'online', phone: '555-1111', paid: true },
      { name: 'Bob', payment: 'cash', phone: '555-2222', paid: false },
      { name: 'Charlie', payment: 'online', phone: '555-3333', paid: true }
    ];

    const sessionPlayers = [
      { name: 'Alice', payment: 'cash', phone: '555-9999', paid: true }, // Updated
      { name: 'Diana', payment: 'online', phone: '555-4444', paid: false } // New
    ];

    const deletedPlayers = [
      { name: 'Charlie', payment: 'online', phone: '555-3333', paid: true } // Deleted
    ];

    const result = generatePlayerDownloadData(sessionPlayers, deletedPlayers, uploadedPlayers);
    expect(result).toBe(
      'Name\tPayment Type\tPhone Number\tStatus\tPlayed\r\n' +
      'Bob\tcash\t555-2222\tORIGINAL\tNo\r\n' +
      'Alice\tcash\t555-9999\tUPDATED\tYes\r\n' +
      'Diana\tonline\t555-4444\tNEW\tYes\r\n' +
      'Charlie (deleted)\tonline\t555-3333\tDELETED\tYes'
    );
  });

  test('sorts players by status order: ORIGINAL, UPDATED, NEW, DELETED', () => {
    const uploadedPlayers = [
      { name: 'Alice', payment: 'online', phone: '555-1111', paid: true },
      { name: 'Bob', payment: 'cash', phone: '555-2222', paid: false }
    ];

    const sessionPlayers = [
      { name: 'Alice', payment: 'cash', phone: '555-9999', paid: true }, // Updated
      { name: 'Charlie', payment: 'online', phone: '555-3333', paid: true }, // New
      { name: 'Diana', payment: 'cash', phone: '555-4444', paid: false } // New
    ];

    const deletedPlayers = [
      { name: 'Bob', payment: 'cash', phone: '555-2222', paid: false } // Deleted
    ];

    const result = generatePlayerDownloadData(sessionPlayers, deletedPlayers, uploadedPlayers);
    expect(result).toBe(
      'Name\tPayment Type\tPhone Number\tStatus\tPlayed\r\n' +
      'Alice\tcash\t555-9999\tUPDATED\tYes\r\n' +
      'Charlie\tonline\t555-3333\tNEW\tYes\r\n' +
      'Diana\tcash\t555-4444\tNEW\tYes\r\n' +
      'Bob (deleted)\tcash\t555-2222\tDELETED\tYes'
    );
  });

  test('handles players with missing payment info using paid status', () => {
    const sessionPlayers = [
      { name: 'Alice', phone: '555-1111', paid: true }, // No payment field, but paid: true
      { name: 'Bob', phone: '555-2222', paid: false } // No payment field, paid: false
    ];

    const result = generatePlayerDownloadData(sessionPlayers, [], []);
    expect(result).toBe(
      'Name\tPayment Type\tPhone Number\tStatus\tPlayed\r\n' +
      'Alice\tpaid\t555-1111\tNEW\tYes\r\n' +
      'Bob\tunknown\t555-2222\tNEW\tYes'
    );
  });

  test('correctly marks Played column based on session participation', () => {
    const uploadedPlayers = [
      { name: 'UploadedOnly', payment: 'online', phone: '555-1111', paid: true },
      { name: 'PlayedAndUpdated', payment: 'online', phone: '555-2222', paid: true },
      { name: 'PlayedUnchanged', payment: 'cash', phone: '555-3333', paid: false }
    ];

    const sessionPlayers = [
      { name: 'PlayedAndUpdated', payment: 'cash', phone: '555-9999', paid: true }, // Updated and played
      { name: 'PlayedUnchanged', payment: 'cash', phone: '555-3333', paid: false }, // Played but unchanged
      { name: 'NewPlayer', payment: 'online', phone: '555-4444', paid: true } // New player
    ];

    const deletedPlayers = [
      { name: 'DeletedPlayer', payment: 'cash', phone: '555-5555', paid: false } // Deleted (was in session)
    ];

    const result = generatePlayerDownloadData(sessionPlayers, deletedPlayers, uploadedPlayers);
    expect(result).toBe(
      'Name\tPayment Type\tPhone Number\tStatus\tPlayed\r\n' +
      'UploadedOnly\tonline\t555-1111\tORIGINAL\tNo\r\n' +
      'PlayedUnchanged\tcash\t555-3333\tORIGINAL\tYes\r\n' +
      'PlayedAndUpdated\tcash\t555-9999\tUPDATED\tYes\r\n' +
      'NewPlayer\tonline\t555-4444\tNEW\tYes\r\n' +
      'DeletedPlayer (deleted)\tcash\t555-5555\tDELETED\tYes'
    );
  });
});