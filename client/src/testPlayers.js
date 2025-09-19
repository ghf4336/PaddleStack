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
  { name: TEST_PLAYER_NAMES.ALICE, paid: true, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.ALICE },
  { name: TEST_PLAYER_NAMES.BOB, paid: false, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.BOB },
  { name: TEST_PLAYER_NAMES.CHARLIE, paid: true, payment: TEST_PAYMENTS.CASH, phone: TEST_PHONE_NUMBERS.CHARLIE },
  { name: TEST_PLAYER_NAMES.DIANA, paid: true, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.DIANA },
  { name: TEST_PLAYER_NAMES.EVE, paid: false, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.EVE },
  { name: 'adrian', paid: true, payment: TEST_PAYMENTS.CASH, phone: '555-6666' },
  { name: 'shelby', paid: true, payment: TEST_PAYMENTS.ONLINE, phone: '555-7777' },
  { name: 'Peter', paid: true, payment: TEST_PAYMENTS.CASH, phone: '555-8888' },
  { name: 'Jarred', paid: true, payment: TEST_PAYMENTS.ONLINE, phone: '555-9999' },
  { name: TEST_PLAYER_NAMES.FRANK, paid: true, payment: TEST_PAYMENTS.CASH, phone: '555-0000' },
  { name: 'Anita', paid: true, payment: TEST_PAYMENTS.ONLINE, phone: '555-1111' },
  { name: 'john', paid: false, payment: TEST_PAYMENTS.ONLINE, phone: '555-2222' },
  { name: 'Anna', paid: true, payment: TEST_PAYMENTS.CASH, phone: '555-3333' },
  { name: 'Blake', paid: true, payment: TEST_PAYMENTS.ONLINE, phone: '555-4444' },
  { name: 'harry', paid: false, payment: TEST_PAYMENTS.ONLINE, phone: '555-5555' },
  { name: 'Kobe', paid: true, payment: TEST_PAYMENTS.CASH, phone: '555-6666' },
  { name: 'Bruno', paid: true, payment: TEST_PAYMENTS.ONLINE, phone: '555-7777' },
  { name: 'Sam', paid: true, payment: TEST_PAYMENTS.CASH, phone: '555-8888' },
  { name: 'Eric', paid: true, payment: TEST_PAYMENTS.ONLINE, phone: '555-9999' },
  { name: 'Tim', paid: true, payment: TEST_PAYMENTS.CASH, phone: '555-0000' }
];

// Pre-built test data arrays for common test scenarios
export const TEST_UPLOADED_PLAYERS = {
  BASIC: [
    { name: TEST_PLAYER_NAMES.ALICE_JOHNSON, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.ALICE, paid: true },
    { name: TEST_PLAYER_NAMES.BOB_SMITH, payment: TEST_PAYMENTS.CASH, phone: '', paid: true },
    { name: TEST_PLAYER_NAMES.ALICIA_BROWN, payment: TEST_PAYMENTS.ONLINE, phone: TEST_PHONE_NUMBERS.CHARLIE, paid: true }
  ],
  WITH_MISSING_PHONE: [
    { name: TEST_PLAYER_NAMES.ALICE_JOHNSON, payment: TEST_PAYMENTS.ONLINE, phone: '', paid: true }
  ],
  WITH_MISSING_PAYMENT: [
    { name: TEST_PLAYER_NAMES.ALICE_JOHNSON, payment: '', phone: TEST_PHONE_NUMBERS.ALICE, paid: false }
  ]
};

export const TEST_EXISTING_NAMES = ['Alice', 'Bob'];
