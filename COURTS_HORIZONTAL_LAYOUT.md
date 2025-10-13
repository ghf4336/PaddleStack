# Courts Horizontal Layout - 8 Courts on One Screen

## Overview
The courts panel has been redesigned to display courts horizontally (one per row) instead of in a 2x2 grid. This allows you to see **8 courts on one screen without scrolling** on laptop and desktop displays.

## Design Changes

### Layout Structure
**Before**: 2x2 Grid Layout
- Courts displayed in a grid (2 columns)
- Each court was a vertical card with players in 2x2 grid
- Could show ~4 courts comfortably on screen

**After**: Horizontal Row Layout
- Courts displayed as horizontal rows (1 per line)
- Players displayed in a single horizontal row (1x4 instead of 2x2)
- Can show **8 courts on one screen** without scrolling

### Visual Changes

#### Court Row Structure
```
[Drag] Court 1 [Status] | Player 1 | Player 2 | Player 3 | Player 4 | [Complete] [×]
```

Each court row contains:
1. **Drag handle** (⋮⋮) - Reorder courts
2. **Court title** - "Court 1", "Court 2", etc.
3. **Status badge** - "Active", "Starting", or "Waiting"
4. **Player slots** - 4 players displayed horizontally
5. **Complete button** - Compact size
6. **Remove button** (×) - Remove court

### Spacing & Sizing

#### Maintained (Same as Before)
- ✅ **Font sizes** - Text remains same size for readability
- ✅ **Player names** - Same font size
- ✅ **Court titles** - Same font size

#### Reduced (For Compactness)
- 📏 **Padding** - Reduced from `20px` to `8-12px`
- 📏 **Card height** - From `180px` min-height to auto (compact)
- 📏 **Button width** - From full-width to `120px` fixed
- 📏 **Spacing between courts** - Reduced gap for tighter layout
- 📏 **Player cards** - Reduced padding for horizontal fit

### Benefits

✅ **8 Courts Visible** - See all 8 courts without scrolling
✅ **Better Scanning** - Easier to scan courts vertically
✅ **Space Efficient** - More courts in less vertical space
✅ **Maintained Readability** - Font sizes stay the same
✅ **Responsive** - Still works on mobile (switches back to vertical)
✅ **Drag & Drop** - Still works with horizontal layout
✅ **All Features Intact** - Complete, remove court, status badges

## How It Looks

### Desktop/Laptop (1024px+)
```
Courts (8)                                                    [+ Add Court]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⋮⋮ Court 1 [Active]    | Player A | Player B | Player C | Player D | [Complete] ×
⋮⋮ Court 2 [Starting]  | Player E | Player F | Player G | Player H | [Next players]  ×
⋮⋮ Court 3 [Active]    | Player I | Player J | Player K | Player L | [Complete] ×
⋮⋮ Court 4 [Waiting]   | Waiting for players...                      | [Complete] ×
⋮⋮ Court 5 [Active]    | Player M | Player N | Player O | Player P | [Complete] ×
⋮⋮ Court 6 [Active]    | Player Q | Player R | Player S | Player T | [Complete] ×
⋮⋮ Court 7 [Starting]  | Player U | Player V | Player W | Player X | [Next players]  ×
⋮⋮ Court 8 [Active]    | Player Y | Player Z | Player 1 | Player 2 | [Complete] ×
```

### Tablet (768px-1024px)
Courts remain horizontal but with slightly more compact spacing.

### Mobile (< 768px)
Courts switch back to vertical card layout automatically:
- Court header at top
- Players in 2x2 grid below
- Button full-width at bottom

## Responsive Behavior

### Large Screens (> 1200px)
- Courts displayed horizontally
- All 8 courts fit comfortably
- Full player names visible

### Medium Screens (768px-1200px)
- Courts still horizontal
- Slightly reduced button sizes
- Player names may truncate if very long

### Small Screens (< 768px)
- **Automatic switch to vertical layout**
- Courts stack as cards
- Players display in 2x2 grid (original layout)
- Full-width buttons

## CSS Classes

### New/Modified Classes
- `.courts-list` - Now uses `flex-direction: column` instead of grid
- `.court-card` - Now uses `flex-direction: row` with horizontal layout
- `.court-players-grid` - Changed from `grid` to `flex` for horizontal display
- `.court-player-slot` - Now uses `flex: 1` to distribute evenly
- `.complete-game-btn` - Reduced to fixed width (`120px`) instead of full-width

### Maintained Classes
All existing class names remain the same, ensuring compatibility with tests and existing code.

## Testing

✅ All 8 CourtsPanel tests pass
✅ Drag and drop still works
✅ Complete functionality intact
✅ Status badges work correctly
✅ Remove court confirmation works
✅ Mobile responsiveness maintained

## Tips for Use

### Optimal Viewing
- **Laptop (13-15")**: Perfect for 8 courts
- **Desktop (24"+)**: Plenty of space, consider zooming in browser if needed
- **Small laptop (11-13")**: May see 6-7 courts comfortably

### If You Need More Space
1. **Zoom out**: Browser zoom to 90% or 80% (Ctrl + Mouse Wheel)
2. **Fullscreen**: Press F11 for fullscreen mode
3. **Hide sidebar**: Collapse browser sidebars/bookmarks

### Customization
Want to adjust spacing further? Edit these CSS variables in `CourtsPanel.css`:
- `.court-card { padding: ... }` - Adjust court row padding
- `.courts-list { gap: ... }` - Adjust space between courts
- `.complete-game-btn { min-width: ... }` - Adjust button size

## Before & After Comparison

| Aspect | Before (Grid) | After (Horizontal) |
|--------|---------------|-------------------|
| Courts visible | ~4 courts | **8 courts** |
| Layout | 2×2 grid | 1×8 rows |
| Player arrangement | 2×2 grid | 1×4 row |
| Vertical space used | High | Low |
| Scrolling needed (8 courts) | Yes | **No** |
| Font sizes | Same | Same ✓ |
| Mobile support | Yes | Yes ✓ |

## Future Enhancements (Optional)

Potential future improvements:
- [ ] Toggle between horizontal/vertical layouts
- [ ] Collapse courts to show even more
- [ ] Grouped court views (active/waiting)
- [ ] Keyboard shortcuts for court navigation

---

**Enjoy your new space-efficient courts view!** 🎾
