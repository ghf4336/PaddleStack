import { reorderCourts, generateCourtDragId, parseDragId } from '../src/utils/dragDrop';

describe('Court Reordering', () => {
  test('reorderCourts should move court from source to target position and renumber', () => {
    const courts = [
      { number: 1, players: [] },
      { number: 2, players: [] },
      { number: 3, players: [] },
      { number: 4, players: [] }
    ];

    // Move court at index 0 to index 2
    const result = reorderCourts(courts, 0, 2);
    
    expect(result).toHaveLength(4);
    expect(result[0].number).toBe(1); // Originally court 2
    expect(result[1].number).toBe(2); // Originally court 3
    expect(result[2].number).toBe(3); // Originally court 1 (moved here)
    expect(result[3].number).toBe(4); // Originally court 4
  });

  test('reorderCourts should handle moving court to end', () => {
    const courts = [
      { number: 1, players: [{ name: 'Alice' }] },
      { number: 2, players: [{ name: 'Bob' }] },
      { number: 3, players: [{ name: 'Charlie' }] }
    ];

    // Move first court to end
    const result = reorderCourts(courts, 0, 2);
    
    expect(result[0].number).toBe(1);
    expect(result[1].number).toBe(2);
    expect(result[2].number).toBe(3);
    
    // Check players moved with their courts
    expect(result[2].players[0].name).toBe('Alice');
  });

  test('reorderCourts should handle same position', () => {
    const courts = [
      { number: 1, players: [] },
      { number: 2, players: [] }
    ];

    const result = reorderCourts(courts, 0, 0);
    
    expect(result).toEqual(courts);
  });

  test('generateCourtDragId should create correct ID', () => {
    expect(generateCourtDragId(0)).toBe('court-reorder-0');
    expect(generateCourtDragId(3)).toBe('court-reorder-3');
  });

  test('parseDragId should correctly parse court reorder IDs', () => {
    const result = parseDragId('court-reorder-2');
    
    expect(result.type).toBe('court-reorder');
    expect(result.courtIndex).toBe(2);
    expect(result.index).toBe(null);
  });

  test('parseDragId should handle regular court drag IDs', () => {
    const result = parseDragId('court-1-2');
    
    expect(result.type).toBe('court');
    expect(result.courtIndex).toBe(1);
    expect(result.index).toBe(2);
  });
});
