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

describe('CourtsPanel waiting status logic', () => {
  const baseProps = {
    courtToRemove: null,
    handleRemoveCourt: jest.fn(),
    handleConfirmRemoveCourt: jest.fn(),
    handleCancelRemoveCourt: jest.fn(),
    handleAddCourt: jest.fn(),
    handleCompleteGame: jest.fn(),
    activeId: null,
    overId: null,
    recentlyCompletedCourt: null,
    nextPlayersButtonState: [false],
  };

  it('shows "Waiting" with blue background when court has less than 4 players', () => {
    const courts = [
      { number: 1, players: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] },
    ];
    const { getByText } = render(<CourtsPanel {...baseProps} courts={courts} />);
    const status = getByText('Waiting');
    expect(status).toBeTruthy();
    // Inline style should have converted to rgb in JSDOM
    expect(status.style.backgroundColor).toBe('rgb(59, 130, 246)');
    expect(status.style.color).toBe('rgb(255, 255, 255)');
  });

  it('shows "Waiting" with blue background when court has no players', () => {
    const courts = [
      { number: 2, players: [] },
    ];
    const { getByText } = render(<CourtsPanel {...baseProps} courts={courts} />);
    const status = getByText('Waiting');
    expect(status).toBeTruthy();
    expect(status.style.backgroundColor).toBe('rgb(59, 130, 246)');
    expect(status.style.color).toBe('rgb(255, 255, 255)');
  });

  it('shows "Active" with green background when court has 4 players', () => {
    const courts = [
      { number: 3, players: [{}, {}, {}, {}] },
    ];
    const { getByText } = render(<CourtsPanel {...baseProps} courts={courts} />);
    const status = getByText('Active');
    expect(status).toBeTruthy();
    expect(status.style.backgroundColor).toBe('rgb(25, 195, 125)');
    expect(status.style.color).toBe('rgb(255, 255, 255)');
  });

  it('shows "Just Started" after completing a full court for 60 seconds', () => {
    jest.useFakeTimers();
    const courts = [ { number: 1, players: [{}, {}, {}, {}] } ];
    const { getByText } = render(<CourtsPanel {...baseProps} courts={courts} />);
    const btn = getByText('Complete Game');
    fireEvent.click(btn);
    // Should show Just Started immediately
    const justStarted = getByText('Just Started');
    expect(justStarted).toBeTruthy();
    expect(justStarted.style.backgroundColor).toBe('rgb(253, 230, 138)');
    expect(justStarted.style.color).toBe('rgb(245, 158, 66)');

    // After 60s should revert to Active
    act(() => {
      jest.advanceTimersByTime(60000);
    });
    const active = getByText('Active');
    expect(active).toBeTruthy();
    jest.useRealTimers();
  });
});

describe('recently completed sync', () => {
  it('makes card and button green for 5s for multiple courts and clears together', () => {
    jest.useFakeTimers();
    const props = {
      courtToRemove: null,
      handleRemoveCourt: jest.fn(),
      handleConfirmRemoveCourt: jest.fn(),
      handleCancelRemoveCourt: jest.fn(),
      handleAddCourt: jest.fn(),
      handleCompleteGame: jest.fn(),
      activeId: null,
      overId: null,
      recentlyCompletedCourt: null,
      nextPlayersButtonState: {},
      courts: [
        { number: 1, players: [{}, {}, {}, {}] },
        { number: 2, players: [{}, {}, {}, {}] }
      ]
    };

    const { getAllByText, getByText } = render(<CourtsPanel {...props} />);
    const completeBtns = getAllByText('Complete Game');
    // click both Complete buttons rapidly
    fireEvent.click(completeBtns[0]);
    fireEvent.click(completeBtns[1]);

    // card backgrounds should be green immediately
    const card1 = getByText('Court 1').closest('.court-card');
    const card2 = getByText('Court 2').closest('.court-card');
    expect(card1).toBeTruthy();
    expect(card2).toBeTruthy();
    expect(card1.style.backgroundColor).toBe('rgb(25, 195, 125)');
    expect(card2.style.backgroundColor).toBe('rgb(25, 195, 125)');

    // buttons should also be green
    expect(completeBtns[0].style.backgroundColor).toBe('rgb(25, 195, 125)');
    expect(completeBtns[1].style.backgroundColor).toBe('rgb(25, 195, 125)');

    // advance timers by 5s: both should clear together
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // after timeout, cards revert to white and buttons revert to dark
    expect(card1.style.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(card2.style.backgroundColor).toBe('rgb(255, 255, 255)');
    expect(completeBtns[0].style.backgroundColor).toBe('rgb(34, 34, 34)');
    expect(completeBtns[1].style.backgroundColor).toBe('rgb(34, 34, 34)');

    // 'Just Started' label lasts 60s, so after 5s it should still be present
    const justStartedLabels = getAllByText('Just Started');
    expect(justStartedLabels.length).toBeGreaterThan(0);

    jest.useRealTimers();
  });
});
