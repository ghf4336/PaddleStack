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
      'Name   Payment Type  Phone Number  Status    Played\r\n' +
      '-----  ------------  ------------  --------  ------\r\n' +
      'Alice  online        555-1111      ORIGINAL  No    \r\n' +
      'Bob    cash          555-2222      ORIGINAL  No    '
    );
  });

  test('downloads new session players with NEW status', () => {
    const sessionPlayers = [
      { name: 'Charlie', payment: 'online', phone: '555-3333', paid: true },
      { name: 'Diana', payment: 'cash', phone: '', paid: false }
    ];

    const result = generatePlayerDownloadData(sessionPlayers, [], []);
    expect(result).toBe(
      'Name     Payment Type  Phone Number  Status  Played\r\n' +
      '-------  ------------  ------------  ------  ------\r\n' +
      'Charlie  online        555-3333      NEW     Yes   \r\n' +
      'Diana    cash                        NEW     Yes   '
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
      'Name     Payment Type  Phone Number  Status    Played\r\n' +
      '-------  ------------  ------------  --------  ------\r\n' +
      'Alice    cash          555-9999      UPDATED   Yes   \r\n' +
      'Charlie  online        555-3333      NEW       Yes   \r\n' +
      'Bob      cash          555-2222      ORIGINAL  No    '
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
      'Name           Payment Type  Phone Number  Status    Played\r\n' +
      '-------------  ------------  ------------  --------  ------\r\n' +
      'Bob (deleted)  cash          555-2222      DELETED   Yes   \r\n' +
      'Alice          online        555-1111      ORIGINAL  No    '
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
      'Name   Payment Type  Phone Number  Status   Played\r\n' +
      '-----  ------------  ------------  -------  ------\r\n' +
      'Alice  cash          555-9999      UPDATED  Yes   '
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
      'Name   Payment Type  Phone Number  Status    Played\r\n' +
      '-----  ------------  ------------  --------  ------\r\n' +
      'Alice  online        555-1111      ORIGINAL  Yes   '
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
      'Name               Payment Type  Phone Number  Status    Played\r\n' +
      '-----------------  ------------  ------------  --------  ------\r\n' +
      'Alice              cash          555-9999      UPDATED   Yes   \r\n' +
      'Charlie (deleted)  online        555-3333      DELETED   Yes   \r\n' +
      'Diana              online        555-4444      NEW       Yes   \r\n' +
      'Bob                cash          555-2222      ORIGINAL  No    '
    );
  });

  test('sorts players by played status: Yes then No', () => {
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
      'Name           Payment Type  Phone Number  Status   Played\r\n' +
      '-------------  ------------  ------------  -------  ------\r\n' +
      'Alice          cash          555-9999      UPDATED  Yes   \r\n' +
      'Bob (deleted)  cash          555-2222      DELETED  Yes   \r\n' +
      'Charlie        online        555-3333      NEW      Yes   \r\n' +
      'Diana          cash          555-4444      NEW      Yes   '
    );
  });

  test('handles players with missing payment info using paid status', () => {
    const sessionPlayers = [
      { name: 'Alice', phone: '555-1111', paid: true }, // No payment field, but paid: true
      { name: 'Bob', phone: '555-2222', paid: false } // No payment field, paid: false
    ];

    const result = generatePlayerDownloadData(sessionPlayers, [], []);
    expect(result).toBe(
      'Name   Payment Type  Phone Number  Status  Played\r\n' +
      '-----  ------------  ------------  ------  ------\r\n' +
      'Alice  paid          555-1111      NEW     Yes   \r\n' +
      'Bob    unknown       555-2222      NEW     Yes   '
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
      'Name                     Payment Type  Phone Number  Status    Played\r\n' +
      '-----------------------  ------------  ------------  --------  ------\r\n' +
      'DeletedPlayer (deleted)  cash          555-5555      DELETED   Yes   \r\n' +
      'NewPlayer                online        555-4444      NEW       Yes   \r\n' +
      'PlayedAndUpdated         cash          555-9999      UPDATED   Yes   \r\n' +
      'PlayedUnchanged          cash          555-3333      ORIGINAL  Yes   \r\n' +
      'UploadedOnly             online        555-1111      ORIGINAL  No    '
    );
  });
});