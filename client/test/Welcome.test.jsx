import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Welcome from '../src/Welcome';

describe('Welcome Component', () => {
  let mockOnStartManually;

  beforeEach(() => {
    mockOnStartManually = jest.fn();
  });

  test('renders welcome page with correct title and subtitle', () => {
    render(<Welcome onStartManually={mockOnStartManually} />);

    expect(screen.getByText('Pickle Park')).toBeInTheDocument();
    expect(screen.getByText('Organize your players and courts effortlessly')).toBeInTheDocument();
  });

  test('renders both action buttons', () => {
    render(<Welcome onStartManually={mockOnStartManually} />);

    expect(screen.getByText('Upload Players')).toBeInTheDocument();
    expect(screen.getByText('Add Players Manually')).toBeInTheDocument();
  });

  test('buttons have correct CSS classes', () => {
    render(<Welcome onStartManually={mockOnStartManually} />);

    const primaryButton = screen.getByText('Upload Players');
    const secondaryButton = screen.getByText('Add Players Manually');

    expect(primaryButton).toHaveClass('welcome-btn', 'primary');
    expect(secondaryButton).toHaveClass('welcome-btn', 'secondary');
  });

  test('has correct container structure', () => {
    const { container } = render(<Welcome onStartManually={mockOnStartManually} />);

    expect(container.firstChild).toHaveClass('welcome-container');
    expect(container.querySelector('.welcome-content')).toBeInTheDocument();
    expect(container.querySelector('.welcome-buttons')).toBeInTheDocument();
  });

  test('Add Players button click does nothing', () => {
    render(<Welcome onStartManually={mockOnStartManually} />);

    const addPlayersButton = screen.getByText('Upload Players');
    fireEvent.click(addPlayersButton);

    // Verify that onStartManually was NOT called
    expect(mockOnStartManually).not.toHaveBeenCalled();
  });

  test('Upload Players Manually button calls onStartManually prop', () => {
    render(<Welcome onStartManually={mockOnStartManually} />);

    const addPlayersManuallyButton = screen.getByText('Add Players Manually');
    fireEvent.click(addPlayersManuallyButton);

    expect(mockOnStartManually).toHaveBeenCalledTimes(1);
  });

  test('renders with correct semantic structure', () => {
    render(<Welcome onStartManually={mockOnStartManually} />);

    // Check for h1 title
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Pickle Park');

    // Check for buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('Upload Players');
    expect(buttons[1]).toHaveTextContent('Add Players Manually');
  });

  test('buttons are clickable and have proper event handlers', () => {
    render(<Welcome onStartManually={mockOnStartManually} />);

    const primaryButton = screen.getByText('Upload Players');
    const secondaryButton = screen.getByText('Add Players Manually');

    // Both buttons should be enabled
    expect(primaryButton).not.toBeDisabled();
    expect(secondaryButton).not.toBeDisabled();

    // Test multiple clicks on secondary button
    fireEvent.click(secondaryButton);
    fireEvent.click(secondaryButton);
    expect(mockOnStartManually).toHaveBeenCalledTimes(2);
  });

  test('component renders without crashing when onStartManually is not provided', () => {
    // This test ensures the component doesn't crash if the prop is missing
    // (though in practice it should always be provided)
    expect(() => {
      render(<Welcome />);
    }).not.toThrow();
  });

  test('component applies correct CSS classes to all elements', () => {
    const { container } = render(<Welcome onStartManually={mockOnStartManually} />);

    // Check main container
    expect(container.firstChild).toHaveClass('welcome-container');

    // Check content wrapper
    const content = container.querySelector('.welcome-content');
    expect(content).toBeInTheDocument();

    // Check title
    const title = container.querySelector('.welcome-title');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Pickle Park');

    // Check subtitle
    const subtitle = container.querySelector('.welcome-subtitle');
    expect(subtitle).toBeInTheDocument();

    // Check buttons container
    const buttonsContainer = container.querySelector('.welcome-buttons');
    expect(buttonsContainer).toBeInTheDocument();
  });
});