
# PaddleStack Copilot Instructions

## Project Overview
This project is a web-based Pickleball queue system. It is built incrementally based on requirements in `Context files/PaddleStack requirements.txt` and a Figma wireframe. The goal is a single-page app for managing player sessions, queues, and courts.

## Architecture
- **Frontend**: Vite + React (in `/client`).
  - Main UI logic in `src/App.jsx`.
  - Styling in `src/App.css`.
  - State is managed locally for now; future features may require API calls to the backend.
- **Backend**: Node.js + Express (in `/server`).
  - Entry point: `server/index.js`.
  - Uses in-memory JS objects for all data (no persistent DB).
  - API routes will be added as frontend/backend integration grows.

## Key Workflows
- **Start frontend**: `npm run dev` in `/client` (or use VS Code task "Start Frontend (Vite)").
- **Start backend**: `npm start` in `/server` (or use VS Code task "Start Backend (Express)").
- **Development**: Implement features one at a time, following the order in `PaddleStack requirements.txt`.
- **Design reference**: See `Context files/Figma Wireframe.png` for UI layout.

## Patterns & Conventions
- **Component structure**: Major UI is in `App.jsx`. Use functional components and React hooks (e.g., `useState`).
- **Styling**: Use `App.css` for all custom styles. Match the Figma wireframe for layout and color.
- **Data flow**: For now, all state is local to the React app. When backend integration is needed, use RESTful API calls to `/server` endpoints.
- **Player/session logic**: Players are added via a modal confirming payment, and can be removed with an X button. See `App.jsx` for logic.
- **Incremental development**: Only implement features as described in the requirements file, in order.

## Integration Points
- **API**: Backend exposes Express endpoints (to be expanded). Frontend will use `fetch` or similar for communication.
- **No persistent storage**: All data is lost on server restart.

## Example: Adding a Player (Frontend)
```jsx
// In App.jsx
const [sessionPlayers, setSessionPlayers] = useState([]);
// ...
setSessionPlayers([...sessionPlayers, { name: playerName, paid: hasPaid }]);
```

## References
- Requirements: `Context files/PaddleStack requirements.txt`
- UI: `Context files/Figma Wireframe.png`
- Main logic: `client/src/App.jsx`, `server/index.js`

---
Update this file as new architectural patterns or workflows emerge.
