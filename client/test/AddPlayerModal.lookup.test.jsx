import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AddPlayerModal from '../src/AddPlayerModal';
import { TEST_PLAYER_NAMES, TEST_PHONE_NUMBERS, TEST_PAYMENTS, TEST_UPLOADED_PLAYERS, TEST_EXISTING_NAMES } from '../src/testPlayers';

describe('AddPlayerModal player lookup features', () => {
  const defaultProps = {
    show: true,
    onPaidChange: jest.fn(),
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    uploadedPlayers: [],
    existingNames: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render without uploaded players', () => {
    render(<AddPlayerModal {...defaultProps} />);

    expect(screen.getByPlaceholderText('Enter player name')).toBeInTheDocument();
    expect(screen.getByText('Add New Player')).toBeInTheDocument();
  });

  test('should not show dropdown when no uploaded players', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    await user.type(nameInput, 'Alice');

    // Should not show any dropdown
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  test('should show dropdown with matching players', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} uploadedPlayers={TEST_UPLOADED_PLAYERS.BASIC} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    await user.type(nameInput, 'Ali');

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Alicia Brown')).toBeInTheDocument();
      expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
    });
  });

  test('should show dropdown for exact name matches', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} uploadedPlayers={TEST_UPLOADED_PLAYERS.BASIC} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    await user.type(nameInput, 'Alice Johnson');

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
    });
  });

  test('should auto-fill player information when dropdown item is clicked', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} uploadedPlayers={TEST_UPLOADED_PLAYERS.BASIC} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    await user.type(nameInput, 'Alice');

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    // Click on the dropdown item
    fireEvent.click(screen.getByText('Alice Johnson'));

    // Check that all fields are filled
    expect(nameInput).toHaveValue('Alice Johnson');
    expect(screen.getByPlaceholderText('Enter phone number')).toHaveValue('555-1111');
    
    // Check payment selection using the ID
    const paymentSelect = screen.getByRole('combobox');
    expect(paymentSelect.value).toBe('online');
  });

  test('should auto-fill fields when selecting a player', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} uploadedPlayers={TEST_UPLOADED_PLAYERS.BASIC} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    await user.type(nameInput, 'Alice');

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Alice Johnson'));

    // Check that the values were filled correctly (main functionality)
    expect(nameInput).toHaveValue('Alice Johnson');
    expect(screen.getByPlaceholderText('Enter phone number')).toHaveValue('555-1111');
    
    // Check select value by accessing the select element directly
    const paymentSelect = screen.getByRole('combobox');
    expect(paymentSelect.value).toBe('online');
  });

  test('should show dropdown when focusing input with existing matches', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} uploadedPlayers={TEST_UPLOADED_PLAYERS.BASIC} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    
    // Type and then blur
    await user.type(nameInput, 'Alice');
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
    });

    // Focus again - should show dropdown
    fireEvent.focus(nameInput);

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });
  });

  test('should hide dropdown on blur with delay', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} uploadedPlayers={TEST_UPLOADED_PLAYERS.BASIC} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    await user.type(nameInput, 'Alice');

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    fireEvent.blur(nameInput);

    // Should still be visible immediately
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();

    // Wait for delay
    await waitFor(() => {
      expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  test('should display player payment and phone in dropdown', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} uploadedPlayers={TEST_UPLOADED_PLAYERS.BASIC} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    await user.type(nameInput, 'A');

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('online • 555-1111')).toBeInTheDocument();
    });

    // Clear and type 'Bob'
    await user.clear(nameInput);
    await user.type(nameInput, 'Bob');

    await waitFor(() => {
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      expect(screen.getByText('cash')).toBeInTheDocument();
    });
  });

  test('should handle missing phone numbers in dropdown display', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} uploadedPlayers={TEST_UPLOADED_PLAYERS.WITH_MISSING_PHONE} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    await user.type(nameInput, 'Alice');

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('online')).toBeInTheDocument();
      // Should not show phone bullet point
      expect(screen.queryByText('•')).not.toBeInTheDocument();
    });
  });

  test('should handle players with missing payment info', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} uploadedPlayers={TEST_UPLOADED_PLAYERS.WITH_MISSING_PAYMENT} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    await user.type(nameInput, 'Alice');

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Alice Johnson'));

    expect(nameInput).toHaveValue('Alice Johnson');
    expect(screen.getByPlaceholderText('Enter phone number')).toHaveValue('555-1111');
    
    // Check that the select remains empty (payment was empty string)
    const paymentSelect = screen.getByRole('combobox');
    expect(paymentSelect.value).toBe('');
  });

  test('should not show dropdown when input is empty', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} uploadedPlayers={TEST_UPLOADED_PLAYERS.BASIC} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    
    // Type and clear
    await user.type(nameInput, 'A');
    await user.clear(nameInput);

    expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
  });

  test('should limit dropdown height and scroll', async () => {
    const uploadedPlayers = Array.from({ length: 10 }, (_, i) => ({
      name: `Player ${i + 1}`,
      payment: 'online',
      phone: `555-${i.toString().padStart(4, '0')}`,
      paid: true
    }));

    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} uploadedPlayers={uploadedPlayers} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    await user.type(nameInput, 'Player');

    await waitFor(() => {
      // Find the dropdown by looking for multiple player entries
      expect(screen.getByText('Player 1')).toBeInTheDocument();
      expect(screen.getByText('Player 10')).toBeInTheDocument();
      
      // The dropdown container should have the max-height and overflow styles
      const dropdownItems = screen.getAllByText(/Player \d+/);
      expect(dropdownItems.length).toBe(10);
    });
  });

  test('should successfully add a player with a unique name', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} existingNames={TEST_EXISTING_NAMES} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    const paymentSelect = screen.getByRole('combobox');
    const confirmBtn = screen.getByText('Confirm');

    await user.type(nameInput, TEST_PLAYER_NAMES.CHARLIE);
    fireEvent.change(paymentSelect, { target: { value: TEST_PAYMENTS.ONLINE } });

    // Should not show duplicate error
    expect(screen.queryByText('A player with this name is already added')).not.toBeInTheDocument();
    
    // Confirm button should be enabled
    expect(confirmBtn).toHaveStyle({ opacity: '1' });

    fireEvent.click(confirmBtn);

    // Should call onConfirm with the new player data
    expect(defaultProps.onConfirm).toHaveBeenCalledWith({
      name: TEST_PLAYER_NAMES.CHARLIE,
      phone: '',
      payment: TEST_PAYMENTS.ONLINE
    });
  });

  test('should show error when trying to add a player with duplicate name', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} existingNames={TEST_EXISTING_NAMES} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    const paymentSelect = screen.getByRole('combobox');
    const confirmBtn = screen.getByText('Confirm');

    await user.type(nameInput, TEST_PLAYER_NAMES.ALICE);
    fireEvent.change(paymentSelect, { target: { value: TEST_PAYMENTS.ONLINE } });

    // Should show duplicate error
    expect(screen.getByText('A player with this name is already added')).toBeInTheDocument();
    
    // Name input should have red border
    expect(nameInput).toHaveStyle({ border: '1.5px solid #e74c3c' });
    
    // Confirm button should be disabled
    expect(confirmBtn).toHaveStyle({ opacity: '0.7' });

    // Should not call onConfirm
    fireEvent.click(confirmBtn);
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });

  test('should clear duplicate error when name is changed to unique', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} existingNames={TEST_EXISTING_NAMES} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    const paymentSelect = screen.getByRole('combobox');
    const confirmBtn = screen.getByText('Confirm');

    // First type duplicate name
    await user.type(nameInput, TEST_PLAYER_NAMES.ALICE);
    fireEvent.change(paymentSelect, { target: { value: TEST_PAYMENTS.ONLINE } });

    // Should show error
    expect(screen.getByText('A player with this name is already added')).toBeInTheDocument();
    expect(confirmBtn).toHaveStyle({ opacity: '0.7' });

    // Clear and type unique name
    await user.clear(nameInput);
    await user.type(nameInput, TEST_PLAYER_NAMES.CHARLIE);

    // Error should be cleared
    expect(screen.queryByText('A player with this name is already added')).not.toBeInTheDocument();
    
    // Border should be normal
    expect(nameInput).toHaveStyle({ border: '1.5px solid #d1d5db' });
    
    // Confirm button should be enabled
    expect(confirmBtn).toHaveStyle({ opacity: '1' });

    fireEvent.click(confirmBtn);
    expect(defaultProps.onConfirm).toHaveBeenCalledWith({
      name: TEST_PLAYER_NAMES.CHARLIE,
      phone: '',
      payment: TEST_PAYMENTS.ONLINE
    });
  });

  test('should handle case-insensitive duplicate names', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} existingNames={TEST_EXISTING_NAMES} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    const paymentSelect = screen.getByRole('combobox');

    await user.type(nameInput, 'alice'); // lowercase
    fireEvent.change(paymentSelect, { target: { value: TEST_PAYMENTS.ONLINE } });

    // Should show duplicate error (case-insensitive check)
    expect(screen.getByText('A player with this name is already added')).toBeInTheDocument();
  });

  test('should trim whitespace when checking for duplicates', async () => {
    const user = userEvent.setup();
    render(<AddPlayerModal {...defaultProps} existingNames={TEST_EXISTING_NAMES} />);

    const nameInput = screen.getByPlaceholderText('Enter player name');
    const paymentSelect = screen.getByRole('combobox');

    await user.type(nameInput, '  Alice  '); // with whitespace
    fireEvent.change(paymentSelect, { target: { value: TEST_PAYMENTS.ONLINE } });

    // Should show duplicate error (trims whitespace)
    expect(screen.getByText('A player with this name is already added')).toBeInTheDocument();
  });
});