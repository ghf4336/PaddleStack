# PaddleStack

A simple, web browser-based Pickleball queue system. 

## Features

### Court Management
- **Add/Remove Courts**: Manage up to 8 courts dynamically
- **Court Reordering**: Drag and drop courts to reorder them, with automatic renumbering
- **Player Assignment**: Drag players between courts and queues
- **Game Completion**: Track completed games and automatically move players to end of queue

### Player Queue System
- **Next Up Queue**: Priority players ready for the next available court
- **General Queue**: Main player queue with automatic assignment
- **Paid Status Tracking**: Visual indicators for paid/unpaid players
- **Pause/Resume**: Temporarily pause players from game rotation

## Structure
- `/client`: Frontend (Vite + React)
- `/server`: Backend (Node.js + Express, in-memory storage)

## Getting Started

### Frontend
```
cd client
npm install
npm run dev
```

### Backend
```
cd server
npm install
npm start
```

## Court Reordering Usage

1. **Visual Indicator**: Courts display a drag handle (⋮⋮) next to the court name
2. **Drag to Reorder**: Click and drag any court card to move it to a new position
3. **Drop Target**: Courts will highlight with a blue border when they're valid drop targets
4. **Automatic Renumbering**: Courts are automatically renumbered (1, 2, 3, etc.) based on their new positions
5. **Player Preservation**: All players on courts remain assigned to their respective courts during reordering

This feature is particularly useful when games finish at the same time and players move to different courts than intended.

## Development
- Requirements are implemented incrementally as described in the requirements file.
- No persistent database; all data is in-memory.
- Uses @dnd-kit for drag and drop functionality

---
See `Context files/PaddleStack requirements.txt` for feature details.

To remove load data button
{/* <button className="load-test-btn" style={{ margin: '8px 0', width: '100%' }} onClick={handleLoadTestData}>
  Load Test Data
</button> */} comment that out