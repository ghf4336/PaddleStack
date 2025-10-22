import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddPlayerModal from '../src/AddPlayerModal';

describe('AddPlayerModal Cancel Confirmation', () => {
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

  it('should cancel directly when no fields are filled', () => {
    render(<AddPlayerModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    // Should call onCancel directly without showing confirmation
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Cancel Adding Player?')).not.toBeInTheDocument();
  });

  it('should show confirmation modal when first name is filled', () => {
    render(<AddPlayerModal {...defaultProps} />);
    
    const firstNameInput = screen.getByPlaceholderText('Enter first name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    // Should show confirmation modal
    expect(screen.getByText('Cancel Adding Player?')).toBeInTheDocument();
    expect(screen.getByText('You have unsaved changes. Are you sure you want to cancel without saving this player?')).toBeInTheDocument();
    expect(defaultProps.onCancel).not.toHaveBeenCalled();
  });

  it('should show confirmation modal when last name is filled', () => {
    render(<AddPlayerModal {...defaultProps} />);
    
    const lastNameInput = screen.getByPlaceholderText('Enter last name');
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(screen.getByText('Cancel Adding Player?')).toBeInTheDocument();
    expect(defaultProps.onCancel).not.toHaveBeenCalled();
  });

  it('should show confirmation modal when phone is filled', () => {
    render(<AddPlayerModal {...defaultProps} />);
    
    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    fireEvent.change(phoneInput, { target: { value: '555-1234' } });
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(screen.getByText('Cancel Adding Player?')).toBeInTheDocument();
    expect(defaultProps.onCancel).not.toHaveBeenCalled();
  });

  it('should show confirmation modal when payment is selected', () => {
    render(<AddPlayerModal {...defaultProps} />);
    
    const paymentSelect = screen.getByDisplayValue('Select payment method');
    fireEvent.change(paymentSelect, { target: { value: 'online' } });
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(screen.getByText('Cancel Adding Player?')).toBeInTheDocument();
    expect(defaultProps.onCancel).not.toHaveBeenCalled();
  });

  it('should cancel when "Yes, Cancel" is clicked in confirmation modal', () => {
    render(<AddPlayerModal {...defaultProps} />);
    
    // Fill in a field
    const firstNameInput = screen.getByPlaceholderText('Enter first name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    
    // Click cancel to show confirmation
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    // Click "Yes, Cancel" in confirmation modal
    const confirmCancelButton = screen.getByText('Yes, Cancel');
    fireEvent.click(confirmCancelButton);
    
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Cancel Adding Player?')).not.toBeInTheDocument();
  });

  it('should close confirmation modal when "Keep Editing" is clicked', () => {
    render(<AddPlayerModal {...defaultProps} />);
    
    // Fill in a field
    const firstNameInput = screen.getByPlaceholderText('Enter first name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    
    // Click cancel to show confirmation
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    // Click "Keep Editing" in confirmation modal
    const keepEditingButton = screen.getByText('Keep Editing');
    fireEvent.click(keepEditingButton);
    
    expect(defaultProps.onCancel).not.toHaveBeenCalled();
    expect(screen.queryByText('Cancel Adding Player?')).not.toBeInTheDocument();
    // Should still see the form
    expect(screen.getByText('Add New Player')).toBeInTheDocument();
  });

  it('should show confirmation when X button is clicked with filled fields', () => {
    render(<AddPlayerModal {...defaultProps} />);
    
    // Fill in a field
    const firstNameInput = screen.getByPlaceholderText('Enter first name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    
    // Click X button
    const xButton = screen.getByLabelText('Close');
    fireEvent.click(xButton);
    
    expect(screen.getByText('Cancel Adding Player?')).toBeInTheDocument();
    expect(defaultProps.onCancel).not.toHaveBeenCalled();
  });

  it('should cancel directly when X button is clicked with no filled fields', () => {
    render(<AddPlayerModal {...defaultProps} />);
    
    // Click X button without filling any fields
    const xButton = screen.getByLabelText('Close');
    fireEvent.click(xButton);
    
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Cancel Adding Player?')).not.toBeInTheDocument();
  });

  it('should show confirmation with multiple fields filled', () => {
    render(<AddPlayerModal {...defaultProps} />);
    
    // Fill multiple fields
    const firstNameInput = screen.getByPlaceholderText('Enter first name');
    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const paymentSelect = screen.getByDisplayValue('Select payment method');
    
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(phoneInput, { target: { value: '555-1234' } });
    fireEvent.change(paymentSelect, { target: { value: 'cash' } });
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(screen.getByText('Cancel Adding Player?')).toBeInTheDocument();
    expect(defaultProps.onCancel).not.toHaveBeenCalled();
  });

  it('should reset confirmation state when modal is reopened', () => {
    const { rerender } = render(<AddPlayerModal {...defaultProps} />);
    
    // Fill in a field and trigger confirmation
    const firstNameInput = screen.getByPlaceholderText('Enter first name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(screen.getByText('Cancel Adding Player?')).toBeInTheDocument();
    
    // Close modal
    rerender(<AddPlayerModal {...defaultProps} show={false} />);
    
    // Reopen modal
    rerender(<AddPlayerModal {...defaultProps} show={true} />);
    
    // Confirmation should not be visible anymore
    expect(screen.queryByText('Cancel Adding Player?')).not.toBeInTheDocument();
  });

  it('should consider whitespace-only fields as empty', () => {
    render(<AddPlayerModal {...defaultProps} />);
    
    // Fill field with only spaces
    const firstNameInput = screen.getByPlaceholderText('Enter first name');
    fireEvent.change(firstNameInput, { target: { value: '   ' } });
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    // Should cancel directly since trimmed value is empty
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Cancel Adding Player?')).not.toBeInTheDocument();
  });
});