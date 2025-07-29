
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
    expect(screen.getByText('Test Player')).toBeInTheDocument();
  });

  test('removes player from session list when X is clicked', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/enter player name/i), { target: { value: 'Test Player' } });
    fireEvent.click(screen.getByText(/add/i));
    fireEvent.click(screen.getByText(/confirm/i));
    const removeBtn = screen.getByTitle(/remove player/i);
    fireEvent.click(removeBtn);
    expect(screen.queryByText('Test Player')).not.toBeInTheDocument();
  });
});
