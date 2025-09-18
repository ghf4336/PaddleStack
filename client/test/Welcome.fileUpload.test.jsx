import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Welcome from '../src/Welcome';
import * as fileUpload from '../src/utils/fileUpload';

// Mock the file upload utility
jest.mock('../src/utils/fileUpload');

describe('Welcome component file upload', () => {
  const mockOnStartManually = jest.fn();
  const mockOnPlayersUploaded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mocked functions
    fileUpload.uploadAndParsePlayerFile = jest.fn();
  });

  test('should render Add Players button', () => {
    render(
      <Welcome 
        onStartManually={mockOnStartManually} 
        onPlayersUploaded={mockOnPlayersUploaded} 
      />
    );

    expect(screen.getByText('Add Players')).toBeInTheDocument();
  });

  test('should trigger file input when Add Players button is clicked', () => {
    render(
      <Welcome 
        onStartManually={mockOnStartManually} 
        onPlayersUploaded={mockOnPlayersUploaded} 
      />
    );

    const fileInput = document.querySelector('input[type="file"]');
    const addPlayersButton = screen.getByText('Add Players');

    // Mock the click method
    jest.spyOn(fileInput, 'click').mockImplementation(() => {});

    fireEvent.click(addPlayersButton);

    expect(fileInput.click).toHaveBeenCalled();
  });

  test('should have correct file input attributes', () => {
    render(
      <Welcome 
        onStartManually={mockOnStartManually} 
        onPlayersUploaded={mockOnPlayersUploaded} 
      />
    );

    const fileInput = document.querySelector('input[type="file"]');

    expect(fileInput).toHaveAttribute('accept', '.txt');
    expect(fileInput).toHaveStyle('display: none');
  });

  test('should handle successful file upload', async () => {
    const mockPlayers = [
      { name: 'Alice', payment: 'online', phone: '555-1111', paid: true },
      { name: 'Bob', payment: 'cash', phone: '555-2222', paid: true }
    ];

    fileUpload.uploadAndParsePlayerFile.mockResolvedValue(mockPlayers);

    render(
      <Welcome 
        onStartManually={mockOnStartManually} 
        onPlayersUploaded={mockOnPlayersUploaded} 
      />
    );

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['mock content'], 'players.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(fileUpload.uploadAndParsePlayerFile).toHaveBeenCalledWith(file);
      expect(mockOnPlayersUploaded).toHaveBeenCalledWith(mockPlayers);
      expect(mockOnStartManually).toHaveBeenCalled();
    });
  });

  test('should show alert when no valid players found', async () => {
    fileUpload.uploadAndParsePlayerFile.mockResolvedValue([]);

    // Mock window.alert
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <Welcome 
        onStartManually={mockOnStartManually} 
        onPlayersUploaded={mockOnPlayersUploaded} 
      />
    );

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['mock content'], 'players.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('No valid players found in the file. Please check the file format.');
      expect(mockOnPlayersUploaded).not.toHaveBeenCalled();
      expect(mockOnStartManually).not.toHaveBeenCalled();
    });

    window.alert.mockRestore();
  });

  test('should show alert on file upload error', async () => {
    const errorMessage = 'Invalid file format';
    fileUpload.uploadAndParsePlayerFile.mockRejectedValue(new Error(errorMessage));

    // Mock window.alert
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <Welcome 
        onStartManually={mockOnStartManually} 
        onPlayersUploaded={mockOnPlayersUploaded} 
      />
    );

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['mock content'], 'players.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
      expect(mockOnPlayersUploaded).not.toHaveBeenCalled();
      expect(mockOnStartManually).not.toHaveBeenCalled();
    });

    window.alert.mockRestore();
  });

  test('should reset file input value after upload', async () => {
    const mockPlayers = [
      { name: 'Alice', payment: 'online', phone: '555-1111', paid: true }
    ];

    fileUpload.uploadAndParsePlayerFile.mockResolvedValue(mockPlayers);

    render(
      <Welcome 
        onStartManually={mockOnStartManually} 
        onPlayersUploaded={mockOnPlayersUploaded} 
      />
    );

    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['mock content'], 'players.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(fileInput.value).toBe('');
    });
  });

  test('should handle no file selected', async () => {
    render(
      <Welcome 
        onStartManually={mockOnStartManually} 
        onPlayersUploaded={mockOnPlayersUploaded} 
      />
    );

    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [] } });

    // Should not call any upload functions
    expect(fileUpload.uploadAndParsePlayerFile).not.toHaveBeenCalled();
    expect(mockOnPlayersUploaded).not.toHaveBeenCalled();
    expect(mockOnStartManually).not.toHaveBeenCalled();
  });

  test('should call onStartManually when Add Players Manually is clicked', () => {
    render(
      <Welcome 
        onStartManually={mockOnStartManually} 
        onPlayersUploaded={mockOnPlayersUploaded} 
      />
    );

    const manualButton = screen.getByText('Add Players Manually');
    fireEvent.click(manualButton);

    expect(mockOnStartManually).toHaveBeenCalled();
  });
});