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
      { name: TEST_PLAYER_NAMES.ALICE, payment: TEST_PAYMENTS.CASH, phone: TEST_PHONE_NUMBERS.ALICE, paid: true },
      { name: TEST_PLAYER_NAMES.CHARLIE, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.CHARLIE, paid: true },
      { name: TEST_PLAYER_NAMES.BOB, payment: TEST_PAYMENTS.CASH, phone: TEST_PHONE_NUMBERS.BOB, paid: true }
    ]);
  });

  test('parses old tab-delimited format correctly', () => {
    const content = `Name\tPayment Type\tPhone Number
${TEST_PLAYER_NAMES.ALICE}\t${TEST_PAYMENTS.CASH}\t${TEST_PHONE_NUMBERS.ALICE}
${TEST_PLAYER_NAMES.CHARLIE}\t${TEST_PAYMENTS.ONLINE}\t${TEST_PHONE_NUMBERS.CHARLIE}
${TEST_PLAYER_NAMES.BOB}\t${TEST_PAYMENTS.CASH}\t${TEST_PHONE_NUMBERS.BOB}`;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { name: TEST_PLAYER_NAMES.ALICE, payment: TEST_PAYMENTS.CASH, phone: TEST_PHONE_NUMBERS.ALICE, paid: true },
      { name: TEST_PLAYER_NAMES.CHARLIE, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.CHARLIE, paid: true },
      { name: TEST_PLAYER_NAMES.BOB, payment: TEST_PAYMENTS.CASH, phone: TEST_PHONE_NUMBERS.BOB, paid: true }
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
      { name: TEST_PLAYER_NAMES.ALICE, payment: TEST_PAYMENTS.CASH, phone: TEST_PHONE_NUMBERS.ALICE, paid: true },
      { name: TEST_PLAYER_NAMES.CHARLIE, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.CHARLIE, paid: true }
    ]);
  });

  test('handles empty phone numbers', () => {
    const content = `Name     Payment Type  Phone Number  Status  Played
-------  ------------  ------------  ------  ------
${TEST_PLAYER_NAMES.ALICE}    ${TEST_PAYMENTS.CASH}                        NEW     Yes   
${TEST_PLAYER_NAMES.BOB}      ${TEST_PAYMENTS.ONLINE}        ${TEST_PHONE_NUMBERS.BOB}      NEW     Yes   `;

    const result = parsePlayerFile(content);
    expect(result).toEqual([
      { name: TEST_PLAYER_NAMES.ALICE, payment: TEST_PAYMENTS.CASH, phone: '', paid: true },
      { name: TEST_PLAYER_NAMES.BOB, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.BOB, paid: true }
    ]);
  });
});