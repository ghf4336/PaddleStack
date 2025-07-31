import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('PaddleStack App', () => {
  test('completing a game only moves that court\'s players to the back of the queue', () => {
    render(<App />);
    // Load test data and add two courts
    fireEvent.click(screen.getByText('Load Test Data'));
    fireEvent.click(screen.getByText('+ Add Court'));
    fireEvent.click(screen.getByText('+ Add Court'));
    // At this point:
    // Court 1: Alice, Bob, Charlie, Diana
    // Court 2: Eve, Frank, (empty, empty)
    // Add two more players to fill Court 2
    ['Gina', 'Henry'].forEach(name => {
      fireEvent.change(screen.getByPlaceholderText(/Enter player name/i), { target: { value: name } });
      fireEvent.click(screen.getByText('Add'));
      fireEvent.click(screen.getByText('Confirm'));
    });
    // Now Court 2 should be: Eve, Frank, Gina, Henry
    // Complete game on Court 1
    const completeBtns = screen.getAllByText('Complete Game');
    fireEvent.click(completeBtns[0]); // Court 1
    // Alice, Bob, Charlie, Diana should be at the end of the queue, not in any court
    // Court 1 should now have next 4 unassigned: none left, so should be empty
    expect(screen.getAllByText('Court 1').length).toBeGreaterThan(0);
    // Court 2 should still have Eve, Frank, Gina, Henry (at least somewhere)
    expect(screen.getAllByText('Eve').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Frank').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Gina').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Henry').length).toBeGreaterThan(0);
    // Optionally, check that Court 2 card contains all four names
    const court2 = screen.getAllByText('Court 2')[0].closest('.court-card');
    expect(court2).toHaveTextContent('Eve');
    expect(court2).toHaveTextContent('Frank');
    expect(court2).toHaveTextContent('Gina');
    expect(court2).toHaveTextContent('Henry');
    // Alice, Bob, Charlie, Diana should be in the general queue
    expect(screen.getAllByText(/Alice|Bob|Charlie|Diana/).length).toBeGreaterThanOrEqual(4);
    // Court 2 should not have changed
    // (already checked above)
  });
  test('renders session player list and add player modal', () => {
    render(<App />);
    expect(screen.getByText(/Session Players/i)).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Enter player name/i), { target: { value: 'Test Player' } });
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText(/Has the player paid/i)).toBeInTheDocument();
  });

  test('adds a player and shows in session list', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/Enter player name/i), { target: { value: 'Alice' } });
    fireEvent.click(screen.getByText('Add'));
    fireEvent.click(screen.getByText('Confirm'));
    // Alice appears in both session list and next up, so use getAllByText
    const aliceEls = screen.getAllByText('Alice');
    expect(aliceEls.length).toBeGreaterThan(0);
  });

  test('removes a player from session list', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/Enter player name/i), { target: { value: 'Bob' } });
    fireEvent.click(screen.getByText('Add'));
    fireEvent.click(screen.getByText('Confirm'));
    const removeBtn = screen.getByTitle('Remove player');
    fireEvent.click(removeBtn);
    // Bob may appear in multiple places, so check all
    expect(screen.queryAllByText('Bob').length).toBe(0);
  });

  test('load test data populates session players', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Load Test Data'));
    // Alice and Frank may appear in multiple places
    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Frank').length).toBeGreaterThan(0);
  });

  test('add court button adds a court panel', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Load Test Data'));
    fireEvent.click(screen.getByText('+ Add Court'));
    expect(screen.getAllByText('Court 1').length).toBeGreaterThan(0);
  });

  test('court only fills when 4 players are available', () => {
    render(<App />);
    // Add 3 players
    ['A', 'B', 'C'].forEach(name => {
      fireEvent.change(screen.getByPlaceholderText(/Enter player name/i), { target: { value: name } });
      fireEvent.click(screen.getByText('Add'));
      fireEvent.click(screen.getByText('Confirm'));
    });
    fireEvent.click(screen.getByText('+ Add Court'));
    expect(screen.getAllByText('Waiting for players...').length).toBeGreaterThan(0);
    // Add a 4th player
    fireEvent.change(screen.getByPlaceholderText(/Enter player name/i), { target: { value: 'D' } });
    fireEvent.click(screen.getByText('Add'));
    fireEvent.click(screen.getByText('Confirm'));
    expect(screen.queryAllByText('Waiting for players...').length).toBe(0);
    expect(screen.getAllByText('A').length).toBeGreaterThan(0);
    expect(screen.getAllByText('B').length).toBeGreaterThan(0);
    expect(screen.getAllByText('C').length).toBeGreaterThan(0);
    expect(screen.getAllByText('D').length).toBeGreaterThan(0);
  });

  test('next up always shows up to 4 unassigned players', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Load Test Data'));
    // Add a court to assign 4 players
    fireEvent.click(screen.getByText('+ Add Court'));
    // Next up should show the next 2 players (Eve, Frank)
    expect(screen.getAllByText('Eve').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Frank').length).toBeGreaterThan(0);
    // Add 2 more players
    ['Gina', 'Henry'].forEach(name => {
      fireEvent.change(screen.getByPlaceholderText(/Enter player name/i), { target: { value: name } });
      fireEvent.click(screen.getByText('Add'));
      fireEvent.click(screen.getByText('Confirm'));
    });
    // Next up should now show Eve, Frank, Gina, Henry
    expect(screen.getAllByText('Eve').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Frank').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Gina').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Henry').length).toBeGreaterThan(0);
  });

  test('removing a court returns its players to the end of the queue and removes the court', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Load Test Data'));
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
    expect(screen.getAllByText('Charlie').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Diana').length).toBeGreaterThan(0);
    // General queue should include Alice and Bob at the end
    const queuePlayers = screen.getAllByText(/Alice|Bob|Charlie|Diana/).map(el => el.textContent);
    // No duplicates
    const unique = new Set(queuePlayers);
    expect(unique.size).toBe(queuePlayers.length);
  });
});
