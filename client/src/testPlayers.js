// Test constants for PaddleStack unit tests
export const TEST_PLAYER_NAMES = {
  ALICE: 'Alice',
  BOB: 'Bob',
  CHARLIE: 'Charlie',
  DIANA: 'Diana',
  EVE: 'Eve',
  FRANK: 'Frank',
  GINA: 'Gina',
  HENRY: 'Henry',
  PHONE_USER: 'PhoneUser',
  NO_PHONE_USER: 'NoPhoneUser',
  STATE_PHONE_USER: 'StatePhoneUser',
  SECOND_USER: 'SecondUser',
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  ALICE_JOHNSON: 'Alice Johnson',
  BOB_SMITH: 'Bob Smith',
  ALICIA_BROWN: 'Alicia Brown',
  TEST_PLAYER: 'TestPlayer',
  DELETE_ME: 'DeleteMe',
  P1: 'P1',
  P2: 'P2',
  COURTP1: 'CourtP1',
  COURTP2: 'CourtP2',
  COURTP3: 'CourtP3',
  COURTP4: 'CourtP4',
  CLEAR_ME: 'ClearMe'
};

export const TEST_PHONE_NUMBERS = {
  ALICE: '555-1111',
  BOB: '555-2222',
  CHARLIE: '555-3333',
  DIANA: '555-4444',
  EVE: '555-5555',
  PHONE_USER: '123-456-7890',
  STATE_PHONE_USER: '999-888-7777'
};

export const TEST_PAYMENTS = {
  ONLINE: 'online',
  CASH: 'cash'
};

// Test player data for PaddleStack
export const testPlayers = [
  { firstName: 'Alice', lastName: 'Johnson', name: 'Alice Johnson', paid: true, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.ALICE },
  { firstName: 'Bob', lastName: 'Smith', name: 'Bob Smith', paid: false, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.BOB },
  { firstName: 'Charlie', lastName: 'Brown', name: 'Charlie Brown', paid: true, payment: TEST_PAYMENTS.CASH, phone: TEST_PHONE_NUMBERS.CHARLIE },
  { firstName: 'Diana', lastName: 'Prince', name: 'Diana Prince', paid: true, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.DIANA },
  { firstName: 'Eve', lastName: 'Adams', name: 'Eve Adams', paid: false, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.EVE },
  { firstName: 'Adrian', lastName: 'Martinez', name: 'Adrian Martinez', paid: true, payment: TEST_PAYMENTS.CASH, phone: '555-6666' },
  { firstName: 'Shelby', lastName: 'Wilson', name: 'Shelby Wilson', paid: true, payment: TEST_PAYMENTS.ONLINE, phone: '555-7777' },
  { firstName: 'Peter', lastName: 'Parker', name: 'Peter Parker', paid: true, payment: TEST_PAYMENTS.CASH, phone: '555-8888' },
  { firstName: 'Jarred', lastName: 'Davis', name: 'Jarred Davis', paid: true, payment: TEST_PAYMENTS.ONLINE, phone: '555-9999' },
  { firstName: 'Frank', lastName: 'Miller', name: 'Frank Miller', paid: true, payment: TEST_PAYMENTS.CASH, phone: '555-0000' },
  { firstName: 'Anita', lastName: 'Taylor', name: 'Anita Taylor', paid: true, payment: TEST_PAYMENTS.ONLINE, phone: '555-1111' },
  { firstName: 'John', lastName: 'Doe', name: 'John Doe', paid: false, payment: TEST_PAYMENTS.ONLINE, phone: '555-2222' },
  { firstName: 'Anna', lastName: 'Lee', name: 'Anna Lee', paid: true, payment: TEST_PAYMENTS.CASH, phone: '555-3333' },
  { firstName: 'Blake', lastName: 'Griffin', name: 'Blake Griffin', paid: true, payment: TEST_PAYMENTS.ONLINE, phone: '555-4444' },
  { firstName: 'Harry', lastName: 'Potter', name: 'Harry Potter', paid: false, payment: TEST_PAYMENTS.ONLINE, phone: '555-5555' },
  { firstName: 'Kobe', lastName: 'Bryant', name: 'Kobe Bryant', paid: true, payment: TEST_PAYMENTS.CASH, phone: '555-6666' },
  { firstName: 'Bruno', lastName: 'Mars', name: 'Bruno Mars', paid: true, payment: TEST_PAYMENTS.ONLINE, phone: '555-7777' },
  { firstName: 'Sam', lastName: 'Jones', name: 'Sam Jones', paid: true, payment: TEST_PAYMENTS.CASH, phone: '555-8888' },
  { firstName: 'Eric', lastName: 'Clark', name: 'Eric Clark', paid: true, payment: TEST_PAYMENTS.ONLINE, phone: '555-9999' },
  { firstName: 'Tim', lastName: 'Cook', name: 'Tim Cook', paid: true, payment: TEST_PAYMENTS.CASH, phone: '555-0000' }
];

// Pre-built test data arrays for common test scenarios
export const TEST_UPLOADED_PLAYERS = {
  BASIC: [
    { firstName: 'Alice', lastName: 'Johnson', name: 'Alice Johnson', payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.ALICE, paid: true },
    { firstName: 'Bob', lastName: 'Smith', name: 'Bob Smith', payment: TEST_PAYMENTS.CASH, phone: TEST_PHONE_NUMBERS.BOB, paid: true },
    { firstName: 'Alicia', lastName: 'Brown', name: 'Alicia Brown', payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.CHARLIE, paid: true }
  ],
  WITH_MISSING_PHONE: [
    { firstName: 'Alice', lastName: 'Johnson', name: 'Alice Johnson', payment: TEST_PAYMENTS.ONLINE, phone: '', paid: true }
  ],
  WITH_MISSING_PAYMENT: [
    { firstName: 'Alice', lastName: 'Johnson', name: 'Alice Johnson', payment: '', phone: TEST_PHONE_NUMBERS.ALICE, paid: false }
  ]
};

export const TEST_EXISTING_NAMES = ['Alice Test', 'Bob Smith'];
