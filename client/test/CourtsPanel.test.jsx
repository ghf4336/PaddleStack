import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import CourtsPanel from '../src/CourtsPanel';

describe('CourtsPanel', () => {
  const defaultProps = {
    courts: [
      { number: 1, players: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }] },
      { number: 2, players: [] }
    ],
    courtToRemove: null,
    handleRemoveCourt: jest.fn(),
    handleConfirmRemoveCourt: jest.fn(),
    handleCancelRemoveCourt: jest.fn(),
    handleAddCourt: jest.fn(),
    handleCompleteGame: jest.fn(),
    activeId: null,
    overId: null,
    recentlyCompletedCourt: null,
    nextPlayersButtonState: {}
  };

  it('renders courts and complete game buttons', () => {
    const { getAllByText } = render(<CourtsPanel {...defaultProps} />);
    // One enabled, one disabled
    const buttons = getAllByText('Complete Game');
    expect(buttons.length).toBe(2);
    expect(buttons[0].disabled).toBe(false);
    expect(buttons[1].disabled).toBe(true);
  });

  it('disables button and shows Next players after complete', () => {
    jest.useFakeTimers();
    const handleCompleteGame = jest.fn();
    const nextPlayersButtonState = { 0: true };
    const { getByText, rerender, container } = render(
      <CourtsPanel {...defaultProps} handleCompleteGame={handleCompleteGame} nextPlayersButtonState={nextPlayersButtonState} />
    );
    const btn = getByText('Next players');
    expect(btn.disabled).toBe(true);
    // Simulate timer passing
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    rerender(
      <CourtsPanel {...defaultProps} handleCompleteGame={handleCompleteGame} nextPlayersButtonState={{}} />
    );
    // Re-query getAllByText after rerender
    const { getAllByText } = render(
      <CourtsPanel {...defaultProps} handleCompleteGame={handleCompleteGame} nextPlayersButtonState={{}} />,
      { container }
    );
    const completeBtns = getAllByText('Complete Game');
    expect(completeBtns[0].disabled).toBe(false);
    jest.useRealTimers();
  });

  it('calls handleCompleteGame when button clicked', () => {
    const handleCompleteGame = jest.fn();
    const { getAllByText } = render(
      <CourtsPanel {...defaultProps} handleCompleteGame={handleCompleteGame} />
    );
    const buttons = getAllByText('Complete Game');
    fireEvent.click(buttons[0]); // Only enabled button
    expect(handleCompleteGame).toHaveBeenCalledWith(0);
  });
});
