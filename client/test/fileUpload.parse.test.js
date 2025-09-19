import { parsePlayerFile } from '../src/utils/fileUpload.js';

describe('parsePlayerFile', () => {
  test('parses space-aligned format correctly', () => {
    const content = `Name     Payment Type  Phone Number  Status    Played
-------  ------------  ------------  --------  ------
Alice    cash          555-9999      UPDATED   Yes   
Charlie  online        555-3333      NEW       Yes   
Bob      cash          555-2222      ORIGINAL  No    `;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { name: 'Alice', payment: 'cash', phone: '555-9999', paid: true },
      { name: 'Charlie', payment: 'online', phone: '555-3333', paid: true },
      { name: 'Bob', payment: 'cash', phone: '555-2222', paid: true }
    ]);
  });

  test('parses old tab-delimited format correctly', () => {
    const content = `Name\tPayment Type\tPhone Number
Alice\tcash\t555-9999
Charlie\tonline\t555-3333
Bob\tcash\t555-2222`;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { name: 'Alice', payment: 'cash', phone: '555-9999', paid: true },
      { name: 'Charlie', payment: 'online', phone: '555-3333', paid: true },
      { name: 'Bob', payment: 'cash', phone: '555-2222', paid: true }
    ]);
  });

  test('skips deleted players in space-aligned format', () => {
    const content = `Name           Payment Type  Phone Number  Status    Played
-------------  ------------  ------------  --------  ------
Alice          cash          555-9999      UPDATED   Yes   
Bob (deleted)  cash          555-2222      DELETED   Yes   
Charlie        online        555-3333      NEW       Yes   `;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { name: 'Alice', payment: 'cash', phone: '555-9999', paid: true },
      { name: 'Charlie', payment: 'online', phone: '555-3333', paid: true }
    ]);
  });

  test('handles empty phone numbers', () => {
    const content = `Name     Payment Type  Phone Number  Status  Played
-------  ------------  ------------  ------  ------
Alice    cash                        NEW     Yes   
Bob      online        555-2222      NEW     Yes   `;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { name: 'Alice', payment: 'cash', phone: '', paid: true },
      { name: 'Bob', payment: 'online', phone: '555-2222', paid: true }
    ]);
  });
});