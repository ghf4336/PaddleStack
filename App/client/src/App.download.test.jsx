import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';

// Helper to add a player with phone/payment
function addPlayer({ name, phone = '', payment = 'online' }) {
  fireEvent.click(screen.getByText('Add Player'));
  fireEvent.change(screen.getByPlaceholderText('Enter player name'), { target: { value: name } });
  if (phone) fireEvent.change(screen.getByPlaceholderText('(555) 123-4567'), { target: { value: phone } });
  fireEvent.change(screen.getByLabelText(/Payment Method/i), { target: { value: payment } });
  fireEvent.click(screen.getByText('Confirm'));
}

describe('Download Player List', () => {
  test('shows Download Player List button after correct PIN', async () => {
    render(<App />);
    addPlayer({ name: 'TestUser', phone: '123-456-7890', payment: 'cash' });
    fireEvent.click(screen.getByText('End Session'));
    fireEvent.change(screen.getByPlaceholderText(/Enter PIN/i), { target: { value: '1111' } });
    fireEvent.click(screen.getByText('Yes, End Session'));
    // Download button should appear (wait for async state)
    const downloadBtn = await screen.findByText('Download Player List');
    expect(downloadBtn).toBeInTheDocument();
    // Also check for the prompt text
    expect(screen.getByText('Download the player list before ending the session?')).toBeInTheDocument();
    // End Session Now and Cancel buttons should also be present
    expect(screen.getByText('End Session Now')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

});
