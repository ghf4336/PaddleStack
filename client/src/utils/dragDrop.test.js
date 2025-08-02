import { swapPlayers, generateDragId, parseDragId } from '../utils/dragDrop';

describe('Drag and Drop Utilities', () => {
  test('generateDragId creates correct IDs', () => {
    expect(generateDragId('nextup', 0)).toBe('nextup-0');
    expect(generateDragId('general', 2)).toBe('general-2');
    expect(generateDragId('court', 1, 0)).toBe('court-0-1');
  });

  test('parseDragId parses IDs correctly', () => {
    expect(parseDragId('nextup-0')).toEqual({
      type: 'nextup',
      index: 0,
      courtIndex: null
    });

    expect(parseDragId('court-0-1')).toEqual({
      type: 'court',
      courtIndex: 0,
      index: 1
    });
  });

  test('swapPlayers handles basic queue swaps', () => {
    const sessionPlayers = [
      { name: 'Alice', paid: true },
      { name: 'Bob', paid: true },
      { name: 'Charlie', paid: true },
      { name: 'Diana', paid: true }
    ];

    const courts = [];

    const sourceData = { type: 'nextup', index: 0 };
    const targetData = { type: 'nextup', index: 1 };

    const result = swapPlayers(sessionPlayers, sourceData, targetData, courts);

    expect(result.newSessionPlayers[0].name).toBe('Bob');
    expect(result.newSessionPlayers[1].name).toBe('Alice');
  });
});
