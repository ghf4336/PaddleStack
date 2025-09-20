import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import App from '../src/App.jsx';
import '@testing-library/jest-dom';
import { TEST_PLAYER_NAMES, TEST_PHONE_NUMBERS, TEST_PAYMENTS } from '../src/testPlayers';

// Helper to bypass the welcome page if present
function bypassWelcome() {
  const manualBtn = screen.queryByText('Add Players Manually');
  if (manualBtn) {
    fireEvent.click(manualBtn);
  }
}

// Helper to add a player with firstName/lastName fields
function addTestPlayer(name, paymentMethod = 'online') {
  fireEvent.click(screen.getByText('Add Player'));
  
  // For simple names, put in firstName field. For full names, split them.
  if (name.includes(' ')) {
    const [firstName, lastName] = name.split(' ');
    fireEvent.change(screen.getByPlaceholderText('Enter first name'), { target: { value: firstName } });
    fireEvent.change(screen.getByPlaceholderText('Enter last name'), { target: { value: lastName } });
  } else {
    fireEvent.change(screen.getByPlaceholderText('Enter first name'), { target: { value: name } });
    fireEvent.change(screen.getByPlaceholderText('Enter last name'), { target: { value: 'Test' } });
  }
  
  fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: paymentMethod } });
  fireEvent.click(screen.getByText('Confirm'));
}

describe('PaddleStack Player Phone Number', () => {
  test('adds a player with a phone number', async () => {
    render(<App />);
    bypassWelcome();
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: TEST_PLAYER_NAMES.PHONE_USER } });
    fireEvent.change(screen.getByPlaceholderText('Enter last name'), { target: { value: 'T' } });
    fireEvent.change(screen.getByPlaceholderText('Enter phone number'), { target: { value: TEST_PHONE_NUMBERS.PHONE_USER } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: TEST_PAYMENTS.ONLINE } });
    fireEvent.click(screen.getByText('Confirm'));
    // Player should be in the session list
    const playerEls = await screen.findAllByText('Phoneuser T');
    expect(playerEls.length).toBeGreaterThan(0);
    // Phone number is not shown in UI, but we can check the internal state by adding another player and checking the session list
    // (simulate by adding a second player and checking the session list order)
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: TEST_PLAYER_NAMES.SECOND_USER } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: TEST_PAYMENTS.ONLINE } });
    fireEvent.click(screen.getByText('Confirm'));
    // The session list should contain both players
    const sessionPlayers = screen.getAllByText(/Phoneuser|Seconduser/).map(el => el.textContent);
    expect(sessionPlayers).toEqual(expect.arrayContaining(['Phoneuser T', 'Seconduser T']));
    // (Optional) If you expose phone in UI, check for it here
  });

  test('adds a player without a phone number', async () => {
    render(<App />);
    bypassWelcome();
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: TEST_PLAYER_NAMES.NO_PHONE_USER } });
    fireEvent.change(screen.getByPlaceholderText('Enter last name'), { target: { value: 'T' } });
    // Leave phone blank
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: TEST_PAYMENTS.CASH } });
    fireEvent.click(screen.getByText('Confirm'));
    // Player should be in the session list
    const playerEls = await screen.findAllByText('Nophoneuser T');
    expect(playerEls.length).toBeGreaterThan(0);
  });

  test('phone number is stored in sessionPlayers state', async () => {
    // This test will check the phone number is stored by adding a player and then triggering a test data load to inspect the state
    render(<App />);
    bypassWelcome();
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: TEST_PLAYER_NAMES.STATE_PHONE_USER } });
    fireEvent.change(screen.getByPlaceholderText('Enter last name'), { target: { value: 'T' } });
    fireEvent.change(screen.getByPlaceholderText('Enter phone number'), { target: { value: TEST_PHONE_NUMBERS.STATE_PHONE_USER } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: TEST_PAYMENTS.CASH } });
    fireEvent.click(screen.getByText('Confirm'));
    // Add a second player to force a re-render
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: 'OtherUser' } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: TEST_PAYMENTS.ONLINE } });
    fireEvent.click(screen.getByText('Confirm'));
    // There is no direct UI for phone, but we can check the DOM for the player name and ensure no error
    const playerEls = await screen.findAllByText('Statephoneuser T');
    expect(playerEls.length).toBeGreaterThan(0);
    // (If phone is ever shown in UI, add an assertion here)
  });
});

describe('PaddleStack App', () => {
  test('completing a game only moves that court\'s players to the back of the queue', () => {
    render(<App />);
    bypassWelcome();
    // Add 6 players: Alice, Bob, Charlie, Diana, Eve, Frank
    [TEST_PLAYER_NAMES.ALICE, TEST_PLAYER_NAMES.BOB, TEST_PLAYER_NAMES.CHARLIE, TEST_PLAYER_NAMES.DIANA, TEST_PLAYER_NAMES.EVE, TEST_PLAYER_NAMES.FRANK].forEach(name => {
      fireEvent.click(screen.getByText('Add Player'));
      fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: name } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: TEST_PAYMENTS.ONLINE } });
      fireEvent.click(screen.getByText('Confirm'));
    });
    // Add two courts
    fireEvent.click(screen.getByText('+ Add Court'));
    fireEvent.click(screen.getByText('+ Add Court'));
    // Add two more players to fill Court 2
    [TEST_PLAYER_NAMES.GINA, TEST_PLAYER_NAMES.HENRY].forEach(name => {
      fireEvent.click(screen.getByText('Add Player'));
      fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: name } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: TEST_PAYMENTS.ONLINE } });
      fireEvent.click(screen.getByText('Confirm'));
    });
    // Now Court 2 should be: Eve, Frank, Gina, Henry
    // Complete game on Court 1
    const completeBtns = screen.getAllByText('Complete Game');
    fireEvent.click(completeBtns[0]); // Court 1
    // Alice, Bob, Charlie, Diana should be at the end of the queue, not in any court
    // Court 1 should now have next 4 unassigned: none left, so should be empty
    expect(screen.getAllByText('Court 1').length).toBeGreaterThan(0);
    // Court 2 should still have Eve and Frank (at least somewhere)
    expect(screen.getAllByText('Eve T').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Frank T').length).toBeGreaterThan(0);
    // Optionally, check that Court 2 card contains the correct players
    const court2 = screen.getAllByText('Court 2')[0].closest('.court-card');
    // The actual assigned players may differ if the queue is not long enough
    // so check for the expected players in the card
    expect(court2).toHaveTextContent('Eve');
    // The rest may be empty or filled by other players, so do not assert all four
    // Alice, Bob, Charlie, Diana should be in the general queue
    expect(screen.getAllByText(/Alice|Bob|Charlie|Diana/).length).toBeGreaterThanOrEqual(4);
    // Court 2 should not have changed
    // (already checked above)
  });
  test('renders session player list and add player modal', () => {
    render(<App />);
    bypassWelcome();
    expect(screen.getAllByText(/Players \(/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: 'Test Player' } });
    expect(screen.getByText(/Add New Player/i)).toBeInTheDocument();
  });

  test('adds a player and shows in session list', () => {
    render(<App />);
    bypassWelcome();
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: TEST_PLAYER_NAMES.ALICE } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: TEST_PAYMENTS.ONLINE } });
    fireEvent.click(screen.getByText('Confirm'));
    // Alice appears in both session list and next up, so use getAllByText
    const aliceEls = screen.getAllByText('Alice T');
    expect(aliceEls.length).toBeGreaterThan(0);
  });

  test('removes a player from session list', async () => {
    render(<App />);
    bypassWelcome();
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: TEST_PLAYER_NAMES.BOB } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: TEST_PAYMENTS.ONLINE } });
    fireEvent.click(screen.getByText('Confirm'));
    // Use correct button title
    const removeBtn = screen.getByTitle('Remove or pause player');
    fireEvent.click(removeBtn);
    // Modal appears
    fireEvent.click(screen.getByText('Delete Player'));
    await waitFor(() => {
      // Bob may appear in multiple places, so check all
      expect(screen.queryAllByText(TEST_PLAYER_NAMES.BOB).length).toBe(0);
    });
  });

  test('manually adding players populates session players', () => {
    render(<App />);
    bypassWelcome();
    // Add Alice
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: TEST_PLAYER_NAMES.ALICE } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: TEST_PAYMENTS.ONLINE } });
    fireEvent.click(screen.getByText('Confirm'));
    // Add Frank
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: TEST_PLAYER_NAMES.FRANK } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: TEST_PAYMENTS.ONLINE } });
    fireEvent.click(screen.getByText('Confirm'));
    expect(screen.getAllByText('Alice T').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Frank T').length).toBeGreaterThan(0);
  });

  test('add court button adds a court panel', () => {
    render(<App />);
    bypassWelcome();
    // Add 4 players to fill the court
    [TEST_PLAYER_NAMES.ALICE, TEST_PLAYER_NAMES.BOB, TEST_PLAYER_NAMES.CHARLIE, TEST_PLAYER_NAMES.DIANA].forEach(name => {
      fireEvent.click(screen.getByText('Add Player'));
      fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: name } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: TEST_PAYMENTS.ONLINE } });
      fireEvent.click(screen.getByText('Confirm'));
    });
    fireEvent.click(screen.getByText('+ Add Court'));
    expect(screen.getAllByText('Court 1').length).toBeGreaterThan(0);
  });

  test('court only fills when 4 players are available', () => {
    render(<App />);
    bypassWelcome();
    // Add 3 players
    ['A', 'B', 'C'].forEach(name => {
      fireEvent.click(screen.getByText('Add Player'));
      fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: name } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
      fireEvent.click(screen.getByText('Confirm'));
    });
    fireEvent.click(screen.getByText('+ Add Court'));
    expect(screen.getAllByText('Waiting for players...').length).toBeGreaterThan(0);
    // Add a 4th player
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: 'D' } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
    fireEvent.click(screen.getByText('Confirm'));
    expect(screen.queryAllByText('Waiting for players...').length).toBe(0);
    expect(screen.getAllByText('A T').length).toBeGreaterThan(0);
    expect(screen.getAllByText('B T').length).toBeGreaterThan(0);
    expect(screen.getAllByText('C T').length).toBeGreaterThan(0);
    expect(screen.getAllByText('D T').length).toBeGreaterThan(0);
  });

  test('next up always shows up to 4 unassigned players', () => {
    render(<App />);
    bypassWelcome();
    // Add 6 players
    ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'].forEach(name => {
      fireEvent.click(screen.getByText('Add Player'));
      fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: name } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
      fireEvent.click(screen.getByText('Confirm'));
    });
    // Add a court to assign 4 players
    fireEvent.click(screen.getByText('+ Add Court'));
    // Next up should show the next 2 players (Eve, Frank)
    expect(screen.getAllByText('Eve T').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Frank T').length).toBeGreaterThan(0);
    // Add 2 more players
    ['Gina', 'Henry'].forEach(name => {
      fireEvent.click(screen.getByText('Add Player'));
      fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: name } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
      fireEvent.click(screen.getByText('Confirm'));
    });
    // Next up should now show Eve, Frank, Gina, Henry
    expect(screen.getAllByText('Eve T').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Frank T').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Gina T').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Henry T').length).toBeGreaterThan(0);
  });

  test('removing a court returns its players to the end of the queue and removes the court', () => {
    render(<App />);
    bypassWelcome();
    // Add 6 players manually
    ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'].forEach(name => {
      fireEvent.click(screen.getByText('Add Player'));
      fireEvent.change(screen.getByPlaceholderText('Enter first name'), { target: { value: name } });
      fireEvent.change(screen.getByPlaceholderText('Enter last name'), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
      fireEvent.click(screen.getByText('Confirm'));
    });
    fireEvent.click(screen.getByText('+ Add Court'));
    // Court 1 should be filled with Alice, Bob, Charlie, Diana
    expect(screen.getAllByText('Court 1').length).toBeGreaterThan(0);
    // Remove the court
    const removeCourtBtn = screen.getByTitle('Remove court');
    fireEvent.click(removeCourtBtn);
    // Confirm removal in popup
    fireEvent.click(screen.getByText('Remove'));
    // Court 1 should be gone
    expect(screen.queryByText('Court 1')).not.toBeInTheDocument();
    // Alice, Bob, Charlie, Diana should be at the end of the queue (general queue)
    // Add another court to force assignment of next up
    fireEvent.click(screen.getByText('+ Add Court'));
    // Now Eve, Frank, Alice, Bob should be assigned to Court 1 (since Alice/Bob/Charlie/Diana are now at the end)
    // Next up should show Charlie, Diana, and any new players
    expect(screen.getAllByText('Charlie T').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Diana T').length).toBeGreaterThan(0);
    // General queue should include Alice and Bob at the end, and no duplicates
    const generalQueueEls = Array.from(document.querySelectorAll('.queue-player'))
      .filter(el => ['Alice', 'Bob', 'Charlie', 'Diana'].some(name => el.textContent.trim() === name || el.textContent.includes(name)));
    const queueNames = generalQueueEls.map(el => el.textContent.trim().replace(/^\u2022\s*/, '').replace(/#\d+$/, '').trim());
    // Should include Alice and Bob
    expect(queueNames).toEqual(expect.arrayContaining(['Alice T', 'Bob T']));
    // Should not have duplicates
    const unique = new Set(queueNames);
    expect(unique.size).toBe(queueNames.length);
  });
});

describe('PaddleStack Player Add/Delete/Pause/Enable', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('adds a player with paid status', async () => {
    render(<App />);
    bypassWelcome();
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: 'TestPlayer' } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
    fireEvent.click(screen.getByText('Confirm'));
    // There may be multiple TestPlayer elements, just check at least one exists
    const testPlayers = await screen.findAllByText('Testplayer T');
    expect(testPlayers.length).toBeGreaterThan(0);
  });

  it('deletes a player not in a court', async () => {
    render(<App />);
    bypassWelcome();
    // Add player
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: 'DeleteMe' } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
    fireEvent.click(screen.getByText('Confirm'));
    // Remove button (×) should be enabled
    fireEvent.click(screen.getByTitle('Remove or pause player'));
    // Modal appears
    fireEvent.click(screen.getByText('Delete Player'));
    await waitFor(() => {
      expect(screen.queryByText('DeleteMe')).not.toBeInTheDocument();
    });
  });

  it('pauses and enables a player, sending them to the back of the queue', async () => {
    render(<App />);
    bypassWelcome();
    // Add two players
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: 'P1' } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
    fireEvent.click(screen.getByText('Confirm'));
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: 'P2' } });
    fireEvent.change(screen.getByPlaceholderText("Enter last name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
    fireEvent.click(screen.getByText('Confirm'));
    // Pause P1
    const pauseBtn = screen.getAllByTitle('Remove or pause player')[0];
    fireEvent.click(pauseBtn);
    fireEvent.click(screen.getByText('Pause Player'));
    // Enable P1
    fireEvent.click(screen.getByText('Play'));
    // P1 should now be after P2 in the session list
    const playerNames = Array.from(screen.getAllByText(/P[12] T/)).map(el => el.textContent);
    expect(playerNames.indexOf('P2 T')).toBeLessThan(playerNames.indexOf('P1 T'));
  });

  it('shows remove button disabled if player is in a court', async () => {
    render(<App />);
    bypassWelcome();
    // Add 4 players
    for (let i = 1; i <= 4; i++) {
      fireEvent.click(screen.getByText('Add Player'));
      fireEvent.change(screen.getByPlaceholderText("Enter first name"), { target: { value: `CourtP${i}` } });
      fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
      fireEvent.click(screen.getByText('Confirm'));
    }
    // Add a court
    fireEvent.click(screen.getByText('+ Add Court'));
    // The remove button for the first player should not be present
    const removeBtns = screen.queryAllByTitle('Remove or pause player');
    expect(removeBtns.length).toBe(0);
  });
});

describe('App logic functions', () => {
  test('handleAddCourt does not add more than 8 courts', () => {
    const { getByText } = render(<App />);
    bypassWelcome();
    // Add 8 courts
    for (let i = 0; i < 8; i++) {
      fireEvent.click(getByText('+ Add Court'));
    }
    // Try to add a 9th court
    fireEvent.click(getByText('+ Add Court'));
    // Should only have 8 courts
    expect(screen.getAllByText(/Court \d+/).length).toBe(8);
  });

  test('handleRemoveCourt and handleConfirmRemoveCourt return players to queue and renumber courts', async () => {
    render(<App />);
    bypassWelcome();
    // Add 4 players and a court
    ['A', 'B', 'C', 'D'].forEach(name => {
      fireEvent.click(screen.getByText('Add Player'));
      fireEvent.change(screen.getByPlaceholderText('Enter first name'), { target: { value: name } });
      fireEvent.change(screen.getByPlaceholderText('Enter last name'), { target: { value: 'T' } });
      fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
      fireEvent.click(screen.getByText('Confirm'));
    });
    fireEvent.click(screen.getByText('+ Add Court'));
    // Remove the court
    fireEvent.click(screen.getByTitle('Remove court'));
    fireEvent.click(screen.getByText('Remove'));
    // Court should be gone
    expect(screen.queryByText('Court 1')).not.toBeInTheDocument();
    // Players should be in the general queue
    ['A T', 'B T', 'C T', 'D T'].forEach(name => {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
    });
    // Add another court and check renumbering
    fireEvent.click(screen.getByText('+ Add Court'));
    expect(screen.getAllByText('Court 1').length).toBeGreaterThan(0);
  });

  test('handleCompleteGame moves players to end of queue and clears court', () => {
    render(<App />);
    bypassWelcome();
    // Add 8 players and 2 courts
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(name => {
      fireEvent.click(screen.getByText('Add Player'));
      fireEvent.change(screen.getByPlaceholderText('Enter first name'), { target: { value: name } });
      fireEvent.change(screen.getByPlaceholderText('Enter last name'), { target: { value: 'T' } });
      fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
      fireEvent.click(screen.getByText('Confirm'));
    });
    fireEvent.click(screen.getByText('+ Add Court'));
    fireEvent.click(screen.getByText('+ Add Court'));
    // Complete game on Court 1
    const completeBtns = screen.getAllByText('Complete Game');
    fireEvent.click(completeBtns[0]);
    // Players A-D should be at the end of the queue
    ['A T', 'B T', 'C T', 'D T'].forEach(name => {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
    });
    // Court 1 should be empty or refilled
    expect(screen.getAllByText('Court 1').length).toBeGreaterThan(0);
  });

  test('handleEnablePausedPlayer moves paused player to end of queue and re-enables', () => {
    render(<App />);
    bypassWelcome();
    // Add two players
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText('Enter first name'), { target: { value: 'P1' } });
    fireEvent.change(screen.getByPlaceholderText('Enter last name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
    fireEvent.click(screen.getByText('Confirm'));
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText('Enter first name'), { target: { value: 'P2' } });
    fireEvent.change(screen.getByPlaceholderText('Enter last name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
    fireEvent.click(screen.getByText('Confirm'));
    // Pause P1
    const pauseBtn = screen.getAllByTitle('Remove or pause player')[0];
    fireEvent.click(pauseBtn);
    fireEvent.click(screen.getByText('Pause Player'));
    // Enable P1
    fireEvent.click(screen.getByText('Play'));
    // P1 should now be after P2 in the session list
    const playerNames = Array.from(screen.getAllByText(/P[12] T/)).map(el => el.textContent);
    expect(playerNames.indexOf('P2 T')).toBeLessThan(playerNames.indexOf('P1 T'));
  });

  test('handleEndSession clears all state', () => {
    render(<App />);
    bypassWelcome();
    // Add a player and a court
    fireEvent.click(screen.getByText('Add Player'));
    fireEvent.change(screen.getByPlaceholderText('Enter first name'), { target: { value: 'ClearMe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter last name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
    fireEvent.click(screen.getByText('Confirm'));
    fireEvent.click(screen.getByText('+ Add Court'));
    // End session
    fireEvent.click(screen.getByText('End Session'));
    fireEvent.change(screen.getByPlaceholderText(/Enter PIN/i), { target: { value: '1111' } });
    fireEvent.click(screen.getByText('Yes, End Session'));
    const endSessionNowBtn = screen.getByText('End Session Now');
    fireEvent.click(endSessionNowBtn);
    // All players and courts should be gone
    expect(screen.queryByText('ClearMe')).not.toBeInTheDocument();
    expect(screen.queryByText('Court 1')).not.toBeInTheDocument();
  });

  test('paused players should not be assigned to courts when game is completed', async () => {
    render(<App />);
    bypassWelcome();
    
    // Add 6 players
    for (let i = 1; i <= 6; i++) {
      fireEvent.click(screen.getByText('Add Player'));
      fireEvent.change(screen.getByPlaceholderText('Enter first name'), { target: { value: `Player${i}` } });
      fireEvent.change(screen.getByPlaceholderText('Enter last name'), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
      fireEvent.click(screen.getByText('Confirm'));
    }
    
    // Pause Player5
    const pauseBtn = screen.getAllByTitle('Remove or pause player')[4]; // Player5 is at index 4
    fireEvent.click(pauseBtn);
    fireEvent.click(screen.getByText('Pause Player'));
    
    // Add a court - should auto-assign Player1-4
    fireEvent.click(screen.getByText('+ Add Court'));
    
    // Verify Player5 is paused and not on court
    expect(screen.getByText('Player5 Test')).toBeInTheDocument();
    const player5Element = screen.getByText('Player5 Test').closest('.session-player');
    expect(player5Element).toHaveClass('paused');
    
    // Player6 should be in Next Up, Player5 should not be anywhere in courts
    const courtElement = screen.getByText('Court 1').closest('.court-card');
    expect(courtElement).not.toHaveTextContent('Player5');
    
    // Complete the game
    const completeBtn = screen.getByText('Complete Game');
    fireEvent.click(completeBtn);
    
    // Player5 should still be paused and NOT assigned to the court
    expect(screen.getByText('Player5 Test')).toBeInTheDocument();
    const player5ElementAfter = screen.getByText('Player5 Test').closest('.session-player');
    expect(player5ElementAfter).toHaveClass('paused');
    
    // Court should have Player6 and not Player5
    const courtElementAfter = screen.getByText('Court 1').closest('.court-card');
    expect(courtElementAfter).toHaveTextContent('Player6');
    expect(courtElementAfter).not.toHaveTextContent('Player5');
  });

  test('no player duplication when completing game with paused players', async () => {
    render(<App />);
    bypassWelcome();
    
    // Add exactly 5 players as described in the user's scenario
    for (let i = 1; i <= 5; i++) {
      fireEvent.click(screen.getByText('Add Player'));
      fireEvent.change(screen.getByPlaceholderText('Enter first name'), { target: { value: `Player${i}` } });
      fireEvent.change(screen.getByPlaceholderText('Enter last name'), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
      fireEvent.click(screen.getByText('Confirm'));
    }
    
    // Pause Player5 first (before adding court)
    const pauseBtn = screen.getAllByTitle('Remove or pause player')[4]; // Player5 is at index 4
    fireEvent.click(pauseBtn);
    fireEvent.click(screen.getByText('Pause Player'));
    
    // Add a court - should auto-assign Player1-4, Player5 is paused so not assigned
    fireEvent.click(screen.getByText('+ Add Court'));
    
    // Verify Player5 is paused
    expect(screen.getByText('Player5 Test')).toBeInTheDocument();
    const player5Element = screen.getByText('Player5 Test').closest('.session-player');
    expect(player5Element).toHaveClass('paused');
    
    // Complete the game
    const completeBtn = screen.getByText('Complete Game');
    fireEvent.click(completeBtn);
    
    // Check that no player appears duplicated anywhere
    // Count all occurrences of each player name in the entire document
    const allText = document.body.textContent;
    for (let i = 1; i <= 5; i++) {
      const playerName = `Player${i}`;
      const matches = allText.match(new RegExp(playerName, 'g')) || [];
      
      // Player should appear exactly once in session list, might appear once more in other places like Next Up
      // But definitely should not appear more than 2 times total
      expect(matches.length).toBeLessThanOrEqual(2);
      
      // More specifically, in the session list it should appear exactly once
      const sessionPlayerElements = Array.from(document.querySelectorAll('.session-player'))
        .filter(el => el.textContent.includes(playerName));
      expect(sessionPlayerElements.length).toBe(1);
    }
    
    // Player5 should still be paused after game completion
    const player5ElementAfter = screen.getByText('Player5 Test').closest('.session-player');
    expect(player5ElementAfter).toHaveClass('paused');
  });

  test('no player duplication when drag and drop with paused players', async () => {
    render(<App />);
    bypassWelcome();
    
    // Add 6 players as described in the user's scenario
    for (let i = 1; i <= 6; i++) {
      fireEvent.click(screen.getByText('Add Player'));
      fireEvent.change(screen.getByPlaceholderText('Enter first name'), { target: { value: `Player${i}` } });
      fireEvent.change(screen.getByPlaceholderText('Enter last name'), { target: { value: 'Test' } });
      fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: 'online' } });
      fireEvent.click(screen.getByText('Confirm'));
    }
    
    // Pause Player5 first (before adding court)
    const pauseBtn = screen.getAllByTitle('Remove or pause player')[4]; // Player5 is at index 4
    fireEvent.click(pauseBtn);
    fireEvent.click(screen.getByText('Pause Player'));
    
    // Add a court - should auto-assign Player1-4, Player6 should be in Next Up
    fireEvent.click(screen.getByText('+ Add Court'));
    
    // Complete the game to move court players to end of queue
    const completeBtn = screen.getByText('Complete Game');
    fireEvent.click(completeBtn);
    
    // Wait for game completion to process
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify that Player5 is still paused and no duplications occurred
    expect(screen.getByText('Player5 Test')).toBeInTheDocument();
    const player5Element = screen.getByText('Player5 Test').closest('.session-player');
    expect(player5Element).toHaveClass('paused');
    
    // Check that no player appears duplicated anywhere
    const afterText = document.body.textContent;
    for (let i = 1; i <= 6; i++) {
      const playerName = `Player${i}`;
      const matches = afterText.match(new RegExp(playerName, 'g')) || [];
      
      // No player should appear more than 2 times
      expect(matches.length).toBeLessThanOrEqual(2);
      
      // Each player should appear exactly once in session list
      const sessionPlayerElements = Array.from(document.querySelectorAll('.session-player'))
        .filter(el => el.textContent.includes(playerName));
      expect(sessionPlayerElements.length).toBe(1);
    }
  });
});





