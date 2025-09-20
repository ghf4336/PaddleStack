import { parsePlayerFile } from '../src/utils/fileUpload.js';
import { TEST_PLAYER_NAMES, TEST_PAYMENTS, TEST_PHONE_NUMBERS } from '../src/testPlayers';

describe('parsePlayerFile', () => {
  test('parses space-aligned format correctly', () => {
    const content = `Name     Payment Type  Phone Number  Status    Played
-------  ------------  ------------  --------  ------
${TEST_PLAYER_NAMES.ALICE}    ${TEST_PAYMENTS.CASH}          ${TEST_PHONE_NUMBERS.ALICE}      UPDATED   Yes   
${TEST_PLAYER_NAMES.CHARLIE}  ${TEST_PAYMENTS.ONLINE}        ${TEST_PHONE_NUMBERS.CHARLIE}      NEW       Yes   
${TEST_PLAYER_NAMES.BOB}      ${TEST_PAYMENTS.CASH}          ${TEST_PHONE_NUMBERS.BOB}      ORIGINAL  No    `;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { firstName: 'Alice', lastName: '', name: TEST_PLAYER_NAMES.ALICE, payment: TEST_PAYMENTS.CASH, phone: TEST_PHONE_NUMBERS.ALICE, paid: true },
      { firstName: 'Charlie', lastName: '', name: TEST_PLAYER_NAMES.CHARLIE, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.CHARLIE, paid: true },
      { firstName: 'Bob', lastName: '', name: TEST_PLAYER_NAMES.BOB, payment: TEST_PAYMENTS.CASH, phone: TEST_PHONE_NUMBERS.BOB, paid: true }
    ]);
  });

  test('parses old tab-delimited format correctly', () => {
    const content = `Name\tPayment Type\tPhone Number
${TEST_PLAYER_NAMES.ALICE}\t${TEST_PAYMENTS.CASH}\t${TEST_PHONE_NUMBERS.ALICE}
${TEST_PLAYER_NAMES.CHARLIE}\t${TEST_PAYMENTS.ONLINE}\t${TEST_PHONE_NUMBERS.CHARLIE}
${TEST_PLAYER_NAMES.BOB}\t${TEST_PAYMENTS.CASH}\t${TEST_PHONE_NUMBERS.BOB}`;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { firstName: 'Alice', lastName: '', name: TEST_PLAYER_NAMES.ALICE, payment: TEST_PAYMENTS.CASH, phone: TEST_PHONE_NUMBERS.ALICE, paid: true },
      { firstName: 'Charlie', lastName: '', name: TEST_PLAYER_NAMES.CHARLIE, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.CHARLIE, paid: true },
      { firstName: 'Bob', lastName: '', name: TEST_PLAYER_NAMES.BOB, payment: TEST_PAYMENTS.CASH, phone: TEST_PHONE_NUMBERS.BOB, paid: true }
    ]);
  });

  test('skips deleted players in space-aligned format', () => {
    const content = `Name           Payment Type  Phone Number  Status    Played
-------------  ------------  ------------  --------  ------
${TEST_PLAYER_NAMES.ALICE}          ${TEST_PAYMENTS.CASH}          ${TEST_PHONE_NUMBERS.ALICE}      UPDATED   Yes   
${TEST_PLAYER_NAMES.BOB} (deleted)  ${TEST_PAYMENTS.CASH}          ${TEST_PHONE_NUMBERS.BOB}      DELETED   Yes   
${TEST_PLAYER_NAMES.CHARLIE}        ${TEST_PAYMENTS.ONLINE}        ${TEST_PHONE_NUMBERS.CHARLIE}      NEW       Yes   `;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { firstName: 'Alice', lastName: '', name: TEST_PLAYER_NAMES.ALICE, payment: TEST_PAYMENTS.CASH, phone: TEST_PHONE_NUMBERS.ALICE, paid: true },
      { firstName: 'Charlie', lastName: '', name: TEST_PLAYER_NAMES.CHARLIE, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.CHARLIE, paid: true }
    ]);
  });

  test('handles empty phone numbers', () => {
    const content = `Name     Payment Type  Phone Number  Status  Played
-------  ------------  ------------  ------  ------
${TEST_PLAYER_NAMES.ALICE}    ${TEST_PAYMENTS.CASH}                        NEW     Yes   
${TEST_PLAYER_NAMES.BOB}      ${TEST_PAYMENTS.ONLINE}        ${TEST_PHONE_NUMBERS.BOB}      NEW     Yes   `;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { firstName: 'Alice', lastName: '', name: TEST_PLAYER_NAMES.ALICE, payment: TEST_PAYMENTS.CASH, phone: '', paid: true },
      { firstName: 'Bob', lastName: '', name: TEST_PLAYER_NAMES.BOB, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.BOB, paid: true }
    ]);
  });

  test('handles swapped columns (Payment, Name)', () => {
    const content = `Payment Type\tName\tPhone Number
${TEST_PAYMENTS.CASH}\t${TEST_PLAYER_NAMES.ALICE}\t${TEST_PHONE_NUMBERS.ALICE}
${TEST_PAYMENTS.ONLINE}\t${TEST_PLAYER_NAMES.BOB}\t${TEST_PHONE_NUMBERS.BOB}`;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { firstName: TEST_PLAYER_NAMES.ALICE, lastName: '', name: TEST_PLAYER_NAMES.ALICE, payment: TEST_PAYMENTS.CASH, phone: TEST_PHONE_NUMBERS.ALICE, paid: true },
      { firstName: TEST_PLAYER_NAMES.BOB, lastName: '', name: TEST_PLAYER_NAMES.BOB, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.BOB, paid: true }
    ]);
  });

  test('handles three column format with empty last names', () => {
    const content = `Alice\t\tcash
Bob\t\tonline
Charlie\tSmith\tcash`;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { firstName: 'Alice', lastName: '', name: 'Alice', payment: 'cash', phone: '', paid: true },
      { firstName: 'Bob', lastName: '', name: 'Bob', payment: 'online', phone: '', paid: true },
      { firstName: 'Charlie', lastName: 'Smith', name: 'Charlie Smith', payment: 'cash', phone: '', paid: true }
    ]);
  });

  test('handles standard format: FirstName, LastName, PaymentType, Phone', () => {
    const content = `Alice\t\tcash\t555-1111
Bob\t\tonline\t555-2222
Charlie\tSmith\tcash\t555-3333`;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { firstName: 'Alice', lastName: '', name: 'Alice', payment: 'cash', phone: '555-1111', paid: true },
      { firstName: 'Bob', lastName: '', name: 'Bob', payment: 'online', phone: '555-2222', paid: true },
      { firstName: 'Charlie', lastName: 'Smith', name: 'Charlie Smith', payment: 'cash', phone: '555-3333', paid: true }
    ]);
  });

  test('handles space-aligned format with empty last names', () => {
    const content = `First Name  Last Name                 Payment Type  Phone Number  Status    Played
----------  ------------------------  ------------  ------------  --------  ------
Alice                                 online        555-1111      ORIGINAL  Yes   
Bob                                   cash          555-2222      ORIGINAL  No    
Charlie     Smith                     online        555-3333      NEW       Yes   `;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { firstName: 'Alice', lastName: '', name: 'Alice', payment: 'online', phone: '555-1111', paid: true },
      { firstName: 'Bob', lastName: '', name: 'Bob', payment: 'cash', phone: '555-2222', paid: true },
      { firstName: 'Charlie', lastName: 'Smith', name: 'Charlie Smith', payment: 'online', phone: '555-3333', paid: true }
    ]);
  });

  test('handles space-aligned format with complex names', () => {
    const content = `First Name  Last Name                 Payment Type  Phone Number  Status    Played
----------  ------------------------  ------------  ------------  --------  ------
h           el o w w 1 ! @ # { } :">  online                      ORIGINAL  No    
Jadon       MILLER                    online        0211340136    ORIGINAL  No    
Jerome      (2)                       cash                        ORIGINAL  No    `;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { firstName: 'h', lastName: 'el o w w 1 ! @ # { } :">', name: 'h el o w w 1 ! @ # { } :">', payment: 'online', phone: '', paid: true },
      { firstName: 'Jadon', lastName: 'MILLER', name: 'Jadon MILLER', payment: 'online', phone: '0211340136', paid: true },
      { firstName: 'Jerome', lastName: '(2)', name: 'Jerome (2)', payment: 'cash', phone: '', paid: true }
    ]);
  });

  test('ensures phone numbers are properly initialized', () => {
    const content = `First Name  Last Name                 Payment Type  Phone Number  Status    Played
----------  ------------------------  ------------  ------------  --------  ------
Alice                                 online        555-1111      ORIGINAL  Yes   
Bob                                   cash          555-2222      ORIGINAL  No    
Charlie     Smith                     online        555-3333      NEW       Yes   `;

    const result = parsePlayerFile(content);
    
    // Ensure all players have phone property (not undefined)
    result.forEach(player => {
      expect(player).toHaveProperty('phone');
      expect(typeof player.phone).toBe('string');
    });
    
    // Check specific phone numbers
    expect(result[0].phone).toBe('555-1111');
    expect(result[1].phone).toBe('555-2222');
    expect(result[2].phone).toBe('555-3333');
  });
});