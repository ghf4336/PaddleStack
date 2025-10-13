# Quick Test Guide - Horizontal Courts Layout

## Your app is running at: http://localhost:5174/PaddleStack/

## Quick Test Steps

### 1. Start a Session
1. Click "Start Session Manually"
2. Add several players (8-16 recommended)

### 2. Add 8 Courts
1. Click "+ Add Court" button repeatedly
2. Add up to 8 courts
3. Watch them populate with players automatically

### 3. Verify the New Layout

#### ✅ What You Should See

**On Laptop/Desktop Screen:**
- All 8 courts visible **without scrolling** ✨
- Courts displayed as horizontal rows (one per line)
- Each court shows:
  ```
  [Drag] Court # [Status] | Player1 | Player2 | Player3 | Player4 | [Button] [×]
  ```
- Players displayed in a single row (not 2×2 grid)
- Compact spacing between courts
- Same font size as before (readable)

#### Visual Structure
```
┌────────────────────────────────────────────────────────────┐
│ ⋮⋮ Court 1 [Active]   Player A  Player B  Player C  Player D  [Complete] × │
│ ⋮⋮ Court 2 [Starting] Player E  Player F  Player G  Player H  [Next players]  × │
│ ⋮⋮ Court 3 [Active]   Player I  Player J  Player K  Player L  [Complete] × │
│ ⋮⋮ Court 4 [Waiting]  Waiting for players...                  [Complete] × │
│ ⋮⋮ Court 5 [Active]   Player M  Player N  Player O  Player P  [Complete] × │
│ ⋮⋮ Court 6 [Active]   Player Q  Player R  Player S  Player T  [Complete] × │
│ ⋮⋮ Court 7 [Active]   Player U  Player V  Player W  Player X  [Complete] × │
│ ⋮⋮ Court 8 [Active]   Player Y  Player Z  Player 1  Player 2  [Complete] × │
└────────────────────────────────────────────────────────────┘
```

### 4. Test Functionality

#### All Features Should Still Work:
- ✅ **Drag & Drop**: Try dragging players between courts/queue
- ✅ **Complete**: Click to complete a game
- ✅ **Remove Court**: Click × to remove a court
- ✅ **Add Court**: Add/remove courts dynamically
- ✅ **Status Badges**: See "Active", "Starting", "Waiting" states
- ✅ **Reorder Courts**: Drag the ⋮⋮ handle to reorder

### 5. Test Responsiveness

#### Desktop/Laptop View (What you want!)
- [ ] All 8 courts fit on screen without scrolling
- [ ] Players displayed horizontally
- [ ] Text is readable (same size as before)
- [ ] Buttons are compact but clickable

#### Resize to Mobile (Optional Test)
- [ ] Courts automatically switch to vertical card layout
- [ ] Players switch back to 2×2 grid
- [ ] Buttons become full-width

## Key Differences from Before

| Feature | Before | Now |
|---------|--------|-----|
| **Courts per screen** | ~4 | **8** ✨ |
| **Court layout** | Vertical cards (grid) | Horizontal rows |
| **Player arrangement** | 2×2 grid | 1×4 row |
| **Scrolling needed** | Yes | **No** |
| **Vertical space** | More | Less (efficient) |
| **Font sizes** | ✓ | ✓ Same |

## Optimization Tips

### If You Want Even More Compact:
1. **Browser zoom**: Ctrl + Mouse Wheel Down (zoom out to 90%)
2. **Hide browser UI**: Press F11 for fullscreen mode
3. **Collapse sidebars**: Hide any open browser panels

### If Text Feels Too Small:
1. **Browser zoom in**: Ctrl + Mouse Wheel Up
2. Or edit CSS variables in `CourtsPanel.css` to increase font size

## Visual Comparison

### Before (Grid Layout)
```
┌──────────────┐ ┌──────────────┐
│ Court 1      │ │ Court 2      │
│ [Active]     │ │ [Starting]   │
│              │ │              │
│ P1     P2    │ │ P5     P6    │
│ P3     P4    │ │ P7     P8    │
│              │ │              │
│ [Complete]   │ │ [Complete]   │
└──────────────┘ └──────────────┘

┌──────────────┐ ┌──────────────┐
│ Court 3      │ │ Court 4      │
│ [Active]     │ │ [Waiting]    │
│              │ │              │
│ P9     P10   │ │   Waiting    │
│ P11    P12   │ │              │
│              │ │              │
│ [Complete]   │ │ [Complete]   │
└──────────────┘ └──────────────┘

**Scrolling needed for courts 5-8** ⬇️
```

### After (Horizontal Layout)
```
┌─────────────────────────────────────────────────────────────┐
│ ⋮⋮ Court 1 [Active]   │ P1 │ P2 │ P3 │ P4 │ [Complete] × │
│ ⋮⋮ Court 2 [Starting] │ P5 │ P6 │ P7 │ P8 │ [Next]     × │
│ ⋮⋮ Court 3 [Active]   │ P9 │ P10│ P11│ P12│ [Complete] × │
│ ⋮⋮ Court 4 [Waiting]  │ Waiting for players  │ [Complete] × │
│ ⋮⋮ Court 5 [Active]   │ P13│ P14│ P15│ P16│ [Complete] × │
│ ⋮⋮ Court 6 [Active]   │ P17│ P18│ P19│ P20│ [Complete] × │
│ ⋮⋮ Court 7 [Active]   │ P21│ P22│ P23│ P24│ [Complete] × │
│ ⋮⋮ Court 8 [Active]   │ P25│ P26│ P27│ P28│ [Complete] × │
└─────────────────────────────────────────────────────────────┘

**All 8 courts visible - no scrolling!** ✨
```

## Troubleshooting

### If courts still display as cards (old layout):
1. Hard refresh: `Ctrl + Shift + R` 
2. Clear browser cache
3. Check that `CourtsPanel.css` loaded (F12 → Network tab)

### If layout looks broken:
1. Check browser console for errors (F12)
2. Verify screen width is > 768px
3. Try zooming to 100% (Ctrl + 0)

---

**The new layout is live! Go to http://localhost:5174/PaddleStack/ to see it in action!** 🚀
