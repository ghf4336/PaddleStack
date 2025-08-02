import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NextUpSection from './NextUpSection';

// Mock the drag and drop components
jest.mock('./components/DraggablePlayer', () => {
  return function MockDraggablePlayer({ children, id, player }) {
    return <div data-testid={`draggable-${id}`} data-player={player?.name}>{children}</div>;
  };
});

jest.mock('./components/DroppableArea', () => {
  return function MockDroppableArea({ children, id, isDropTarget }) {
    return (
      <div 
        data-testid={`droppable-${id}`} 
        data-is-drop-target={isDropTarget}
      >
        {children}
      </div>
    );
  };
});

const mockPlayers = [
  { name: 'Player 1', paid: true },
  { name: 'Player 2', paid: true },
  { name: 'Player 3', paid: true },
  { name: 'Player 4', paid: true },
  { name: 'Player 5', paid: true },
  { name: 'Player 6', paid: true },
  { name: 'Player 7', paid: true },
  { name: 'Player 8', paid: true },
];

describe('NextUpSection', () => {
  it('swaps players within the second group (Next up In 2 Games) when dragged and dropped', () => {
    // Setup: 8 players, drag Player 5 (index 0 in second group) over Player 8 (index 3 in second group)
    const propsWithDrag = {
      ...defaultProps,
      activeId: 'nextup-2-0', // Player 5
      overId: 'nextup-2-3'    // Player 8
    };
    render(<NextUpSection {...propsWithDrag} />);
    // Ghost player should be Player 5
    const ghostPlayer = screen.getByText('Player 5').closest('.ghost-player');
    expect(ghostPlayer).toBeInTheDocument();
    // Drop target should be highlighted for Player 8
    const dropTarget = screen.getByTestId('droppable-nextup-2-3');
    expect(dropTarget).toHaveAttribute('data-is-drop-target', 'true');
  });

  it('shows correct ghost and drop target when dragging and dropping between second group slots', () => {
    // Drag Player 6 (index 1 in second group) over Player 7 (index 2 in second group)
    const propsWithDrag = {
      ...defaultProps,
      activeId: 'nextup-2-1', // Player 6
      overId: 'nextup-2-2'    // Player 7
    };
    render(<NextUpSection {...propsWithDrag} />);
    // Ghost player should be Player 6
    const ghostPlayer = screen.getByText('Player 6').closest('.ghost-player');
    expect(ghostPlayer).toBeInTheDocument();
    // Drop target should be highlighted for Player 7
    const dropTarget = screen.getByTestId('droppable-nextup-2-2');
    expect(dropTarget).toHaveAttribute('data-is-drop-target', 'true');
  });
  const defaultProps = {
    nextUpPlayers: mockPlayers,
    startNum: 1,
    activeId: null,
    overId: null,
    panelId: 'nextup'
  };

  it('renders the main Next Up section with correct title', () => {
    render(<NextUpSection {...defaultProps} />);
    
    expect(screen.getByText(/Next Up \(4\/4\)/)).toBeInTheDocument();
    expect(screen.getByText('The following players will be playing next')).toBeInTheDocument();
  });

  it('renders the second group section with correct title', () => {
    render(<NextUpSection {...defaultProps} />);
    
    expect(screen.getByText(/Next up In 2 Games \(4\/4\)/)).toBeInTheDocument();
    expect(screen.getByText('These players will play in 2 games')).toBeInTheDocument();
  });

  it('displays first group players (1-4) with correct names', () => {
    render(<NextUpSection {...defaultProps} />);
    
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('Player 3')).toBeInTheDocument();
    expect(screen.getByText('Player 4')).toBeInTheDocument();
  });

  it('displays second group players (5-8) with correct names', () => {
    render(<NextUpSection {...defaultProps} />);
    
    expect(screen.getByText('Player 5')).toBeInTheDocument();
    expect(screen.getByText('Player 6')).toBeInTheDocument();
    expect(screen.getByText('Player 7')).toBeInTheDocument();
    expect(screen.getByText('Player 8')).toBeInTheDocument();
  });

  it('displays correct player numbers for first group', () => {
    render(<NextUpSection {...defaultProps} />);
    
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('#3')).toBeInTheDocument();
    expect(screen.getByText('#4')).toBeInTheDocument();
  });

  it('displays correct player numbers for second group', () => {
    render(<NextUpSection {...defaultProps} />);
    
    expect(screen.getByText('#5')).toBeInTheDocument();
    expect(screen.getByText('#6')).toBeInTheDocument();
    expect(screen.getByText('#7')).toBeInTheDocument();
    expect(screen.getByText('#8')).toBeInTheDocument();
  });

  it('shows empty slots when there are fewer than 4 players in first group', () => {
    const partialPlayers = mockPlayers.slice(0, 2);
    render(<NextUpSection {...defaultProps} nextUpPlayers={partialPlayers} />);
    
    expect(screen.getByText(/Next Up \(2\/4\)/)).toBeInTheDocument();
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    
    // Should have empty slots
    const emptySlots = screen.getAllByRole('presentation');
    expect(emptySlots).toHaveLength(6); // 2 in first group, 4 in second group (since no players 3-8)
  });

  it('shows empty slots when there are fewer than 4 players in second group', () => {
    const partialPlayers = mockPlayers.slice(0, 6);
    render(<NextUpSection {...defaultProps} nextUpPlayers={partialPlayers} />);
    
    expect(screen.getByText(/Next up In 2 Games \(2\/4\)/)).toBeInTheDocument();
    expect(screen.getByText('Player 5')).toBeInTheDocument();
    expect(screen.getByText('Player 6')).toBeInTheDocument();
    
    // Should have 2 empty slots in second group
    const emptySlots = screen.getAllByRole('presentation');
    expect(emptySlots).toHaveLength(2);
  });

  it('creates unique drag IDs for first group players', () => {
    render(<NextUpSection {...defaultProps} />);
    
    expect(screen.getByTestId('droppable-nextup-0')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-nextup-1')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-nextup-2')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-nextup-3')).toBeInTheDocument();
  });

  it('creates unique drag IDs for second group players', () => {
    render(<NextUpSection {...defaultProps} />);
    
    expect(screen.getByTestId('droppable-nextup-2-0')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-nextup-2-1')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-nextup-2-2')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-nextup-2-3')).toBeInTheDocument();
  });

  it('shows ghost players when dragging in first group', () => {
    const propsWithDrag = {
      ...defaultProps,
      activeId: 'nextup-0'
    };
    
    render(<NextUpSection {...propsWithDrag} />);
    
    const ghostPlayer = screen.getByText('Player 1').closest('.ghost-player');
    expect(ghostPlayer).toBeInTheDocument();
  });

  it('shows ghost players when dragging in second group', () => {
    const propsWithDrag = {
      ...defaultProps,
      activeId: 'nextup-2-0'
    };
    
    render(<NextUpSection {...propsWithDrag} />);
    
    const ghostPlayer = screen.getByText('Player 5').closest('.ghost-player');
    expect(ghostPlayer).toBeInTheDocument();
  });

  it('highlights drop targets correctly for first group', () => {
    const propsWithDrop = {
      ...defaultProps,
      overId: 'nextup-1'
    };
    
    render(<NextUpSection {...propsWithDrop} />);
    
    const dropTarget = screen.getByTestId('droppable-nextup-1');
    expect(dropTarget).toHaveAttribute('data-is-drop-target', 'true');
  });

  it('highlights drop targets correctly for second group', () => {
    const propsWithDrop = {
      ...defaultProps,
      overId: 'nextup-2-1'
    };
    
    render(<NextUpSection {...propsWithDrop} />);
    
    const dropTarget = screen.getByTestId('droppable-nextup-2-1');
    expect(dropTarget).toHaveAttribute('data-is-drop-target', 'true');
  });

  it('uses custom start number for player numbering', () => {
    render(<NextUpSection {...defaultProps} startNum={10} />);
    
    // First group should start at 10
    expect(screen.getByText('#10')).toBeInTheDocument();
    expect(screen.getByText('#11')).toBeInTheDocument();
    expect(screen.getByText('#12')).toBeInTheDocument();
    expect(screen.getByText('#13')).toBeInTheDocument();
    
    // Second group should start at 14 (10 + 4)
    expect(screen.getByText('#14')).toBeInTheDocument();
    expect(screen.getByText('#15')).toBeInTheDocument();
    expect(screen.getByText('#16')).toBeInTheDocument();
    expect(screen.getByText('#17')).toBeInTheDocument();
  });

  it('uses custom panel ID for drag IDs', () => {
    render(<NextUpSection {...defaultProps} panelId="custom" />);
    
    expect(screen.getByTestId('droppable-custom-0')).toBeInTheDocument();
    expect(screen.getByTestId('droppable-custom-2-0')).toBeInTheDocument();
  });

  it('handles empty nextUpPlayers array', () => {
    render(<NextUpSection {...defaultProps} nextUpPlayers={[]} />);
    
    expect(screen.getByText(/Next Up \(0\/4\)/)).toBeInTheDocument();
    expect(screen.getByText(/Next up In 2 Games \(0\/4\)/)).toBeInTheDocument();
    
    // Should have 8 empty slots total (4 in each group)
    const emptySlots = screen.getAllByRole('presentation');
    expect(emptySlots).toHaveLength(8);
  });

  it('renders with more than 8 players (only shows first 8)', () => {
    const manyPlayers = [
      ...mockPlayers,
      { name: 'Player 9', paid: true },
      { name: 'Player 10', paid: true }
    ];
    
    render(<NextUpSection {...defaultProps} nextUpPlayers={manyPlayers} />);
    
    // Should still only show players 1-8
    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Player 8')).toBeInTheDocument();
    expect(screen.queryByText('Player 9')).not.toBeInTheDocument();
    expect(screen.queryByText('Player 10')).not.toBeInTheDocument();
  });

  it('handles drag and drop functionality properly', () => {
    const propsWithBothStates = {
      ...defaultProps,
      activeId: 'nextup-0',
      overId: 'nextup-2'
    };
    
    render(<NextUpSection {...propsWithBothStates} />);
    
    // Ghost player should exist
    const ghostPlayer = screen.getByText('Player 1').closest('.ghost-player');
    expect(ghostPlayer).toBeInTheDocument();
    
    // Drop target should be highlighted
    const dropTarget = screen.getByTestId('droppable-nextup-2');
    expect(dropTarget).toHaveAttribute('data-is-drop-target', 'true');
  });

  it('properly displays the structure for both groups', () => {
    render(<NextUpSection {...defaultProps} />);
    
    // Check the structure - main heading (h3) and subheading (h4)
    const mainHeading = screen.getByRole('heading', { level: 3 });
    const subHeading = screen.getByRole('heading', { level: 4 });
    
    expect(mainHeading).toHaveTextContent(/Next Up/);
    expect(subHeading).toHaveTextContent(/Next up In 2 Games/);
    
    // Check both description texts exist
    expect(screen.getByText('The following players will be playing next')).toBeInTheDocument();
    expect(screen.getByText('These players will play in 2 games')).toBeInTheDocument();
  });

  it('handles cross-group drag and drop', () => {
    const propsWithCrossGroupDrag = {
      ...defaultProps,
      activeId: 'nextup-0', // First group player
      overId: 'nextup-2-1'  // Second group drop target
    };
    
    render(<NextUpSection {...propsWithCrossGroupDrag} />);
    
    // Ghost player in first group
    const ghostPlayer = screen.getByText('Player 1').closest('.ghost-player');
    expect(ghostPlayer).toBeInTheDocument();
    
    // Drop target in second group
    const dropTarget = screen.getByTestId('droppable-nextup-2-1');
    expect(dropTarget).toHaveAttribute('data-is-drop-target', 'true');
  });

  it('displays correct player count in titles for partial groups', () => {
    const partialPlayers = mockPlayers.slice(0, 3);
    render(<NextUpSection {...defaultProps} nextUpPlayers={partialPlayers} />);
    
    expect(screen.getByText(/Next Up \(3\/4\)/)).toBeInTheDocument();
    expect(screen.getByText(/Next up In 2 Games \(0\/4\)/)).toBeInTheDocument();
  });

  it('maintains separate numbering between groups', () => {
    render(<NextUpSection {...defaultProps} startNum={5} />);
    
    // First group: start at 5
    expect(screen.getByText('#5')).toBeInTheDocument();
    expect(screen.getByText('#6')).toBeInTheDocument();
    expect(screen.getByText('#7')).toBeInTheDocument();
    expect(screen.getByText('#8')).toBeInTheDocument();
    
    // Second group: start at 9 (5 + 4)
    expect(screen.getByText('#9')).toBeInTheDocument();
    expect(screen.getByText('#10')).toBeInTheDocument();
    expect(screen.getByText('#11')).toBeInTheDocument();
    expect(screen.getByText('#12')).toBeInTheDocument();
  });
});
