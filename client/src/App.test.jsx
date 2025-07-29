
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('PaddleStack App - User Registration', () => {
  test('renders input and add button', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/enter player name/i)).toBeInTheDocument();
    expect(screen.getByText(/add/i)).toBeInTheDocument();
  });

  test('shows paid modal when adding player', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/enter player name/i), { target: { value: 'Test Player' } });
    fireEvent.click(screen.getByText(/add/i));
    expect(screen.getByText(/has the player paid/i)).toBeInTheDocument();
  });

  test('adds player to session list after confirming paid modal', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/enter player name/i), { target: { value: 'Test Player' } });
    fireEvent.click(screen.getByText(/add/i));
    fireEvent.click(screen.getByText(/confirm/i));
    // Check that Test Player appears in the session list (left panel)
    const sessionList = screen.getByText('Session Players', { exact: false }).parentElement;
    expect(sessionList.querySelector('.session-list')).toHaveTextContent('Test Player');
  });

  test('removes player from session list when X is clicked', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/enter player name/i), { target: { value: 'Test Player' } });
    fireEvent.click(screen.getByText(/add/i));
    fireEvent.click(screen.getByText(/confirm/i));
    const removeBtn = screen.getByTitle(/remove player/i);
    fireEvent.click(removeBtn);
    // Check that Test Player is no longer in the session list
    const sessionList = screen.getByText('Session Players', { exact: false }).parentElement;
    expect(sessionList.querySelector('.session-list')).not.toHaveTextContent('Test Player');
  });
});
