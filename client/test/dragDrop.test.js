import { swapPlayers, generateDragId, parseDragId, reorderCourts } from '../src/utils/dragDrop';

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

  test('swapPlayers returns original arrays if source or target player is missing', () => {
    const sessionPlayers = [
      { name: 'Alice', paid: true },
      { name: 'Bob', paid: true }
    ];
    const courts = [];
    // Invalid source index
    const sourceData = { type: 'nextup', index: 5 };
    const targetData = { type: 'nextup', index: 0 };
    const result = swapPlayers(sessionPlayers, sourceData, targetData, courts);
    expect(result.newSessionPlayers).toEqual(sessionPlayers);
    expect(result.newCourts).toEqual(courts);
  });

  test('parseDragId handles invalid IDs gracefully', () => {
    expect(parseDragId('invalid-id')).toEqual({ type: 'invalid', index: NaN, courtIndex: null });
    expect(parseDragId('general')).toEqual({ type: 'general', index: NaN, courtIndex: null });
  });

  test('reorderCourts does nothing if source and target are the same', () => {
    const courts = [
      { number: 1, players: [] },
      { number: 2, players: [] }
    ];
    const result = reorderCourts(courts, 0, 0);
    expect(result).toEqual(courts);
  });

  test('reorderCourts moves court and renumbers', () => {
    const courts = [
      { number: 1, players: ['A'] },
      { number: 2, players: ['B'] },
      { number: 3, players: ['C'] }
    ];
    const result = reorderCourts(courts, 0, 2);
    expect(result[0].number).toBe(1);
    expect(result[1].number).toBe(2);
    expect(result[2].number).toBe(3);
    expect(result[2].players).toEqual(['A']);
  });
});
