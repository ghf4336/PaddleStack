
# PaddleStack Copilot Instructions

## Project Overview
This project is a web-based Pickleball queue system. It is built incrementally based on requirements in `Context files/PaddleStack requirements.txt` and a Figma wireframe. The goal is a single-page app for managing player sessions, queues, and courts.

## Architecture
  - Main UI logic in `src/App.jsx`.
  - Styling in `src/App.css`.
  - State is managed locally for now; future features may require API calls to the backend.
  - Entry point: `server/index.js`.
  - Uses in-memory JS objects for all data (no persistent DB).
  - API routes will be added as frontend/backend integration grows.



## Integration Points

## Example: Adding a Player (Frontend)
```jsx
// In App.jsx
const [sessionPlayers, setSessionPlayers] = useState([]);
// ...
setSessionPlayers([...sessionPlayers, { name: playerName, paid: hasPaid }]);
```

## References

# PaddleStack — Copilot / AI agent instructions

Quick objective: make safe, small, high-value edits to the Pickleball queue app (client/server) by following the repository conventions and the behavior implemented in `client/src/App.jsx` and `client/src/utils/dragDrop.js`.

Checklist (requirements extracted)
- Summarize architecture and why it is split (client Vite React, server Express in-memory).
- Document developer workflows (dev, test, deploy, VS Code tasks).
- Describe project-specific patterns (session ordering, court rules, drag-id formats).
- Point to the precise files and helper functions to inspect before editing.

Why this matters
- The app relies on local in-memory state in the client for all queue/court logic. Small changes often require touching both `App.jsx` (assignment side effects) and `utils/dragDrop.js` (swap/reorder helpers).

Architecture (big picture)
- Frontend: `client/` — Vite + React. Single-page app; main logic in `client/src/App.jsx`. UI split into Sidebar (player list + queue) and Main (NextUp + Courts).
- Backend: `server/` — Express placeholder (`server/index.js`). Currently no persistence; endpoints are stubs. Add routes here if you move state server-side.

Dev workflows (commands & tasks)
- Start frontend: cd `client` && `npm install` && `npm run dev` (VS Code task: "Start Frontend (Vite)").
- Start backend: cd `server` && `npm install` && `npm start` (VS Code task: "Start Backend (Express)").
- Tests (client): from `client` run `npm test` (Jest, jsdom). Tests live in `test/` at repo root.
- Build & deploy (client): from `client` run `npm run build`; site can be deployed with `npm run deploy` (gh-pages) — `homepage` is set in `client/package.json`.

Project-specific conventions & constraints
- Max courts: 8. Each court holds up to 4 players. These constraints are enforced in UI handlers in `App.jsx` (see `handleAddCourt` and assignment effect).
- sessionPlayers is the canonical ordered list of players; this order is preserved except when swaps occur. Do not reorder sessionPlayers arbitrarily — update both courts and sessionPlayers together.
- pausedPlayers are excluded from automatic court assignment. Removing a paused player re-appends them to sessionPlayers end (`handleEnablePausedPlayer`).
- Removing a court: players on that court are moved to the end of `sessionPlayers` preserving order, then courts are renumbered.

Drag & drop (precise formats and helpers)
- Helper file: `client/src/utils/dragDrop.js` — read before editing.
- Key exported helpers: `swapPlayers`, `parseDragId`, `generateDragId`, `generateCourtDragId`, `reorderCourts`.
- Drag ID formats (exact strings used in code):
  - `general-<index>` — general queue items (index relative to general queue slice)
  - `nextup-<index>` — next-up first group (0..3)
  - `nextup-2-<index>` — next-up second group (4..7 represented as 0..3)
  - `court-<courtIndex>-<index>` — player on a court (courtIndex is 0-based array index)
  - `court-reorder-<courtIndex>` — used to reorder courts
- DnD consumers: `client/src/App.jsx` uses DndContext handlers (`handleDragStart`, `handleDragEnd`, `handleDragOver`) and calls `parseDragId` to convert IDs back into positions. If you change ID formats update both generator and parser.

Where to look first (files to open)
- `client/src/App.jsx` — primary state machine and effects (assignment, complete-game, add/remove court/player).
- `client/src/utils/dragDrop.js` — canonical swap/reorder logic; tests and UI depend on these behaviors.
- `client/src/components/*` — smaller UI parts (CourtsPanel, NextUpSection, GeneralQueueSection, AddPlayerModal).
- `server/index.js` — backend placeholder; add REST endpoints here if moving state server-side.

Editing recommendations
- Small UI/logic change pattern: update `dragDrop.js` for swap/reorder semantics, then run `npm test` and run the app to smoke test. If state shape changes, update `App.jsx` assignment useEffect accordingly.
- Tests: prefer editing/adding tests under `test/` for behavior changes. Jest config in `client/jest.config.cjs`.

Common gotchas
- sessionPlayers ordering is the single source-of-truth for queue order — courts reference players by name and rely on this sequence.
- When swapping players between court and queue, both `courts` and `sessionPlayers` must be updated. `swapPlayers` already handles common cases — mirror its interface when adding features.
- Court numbering is 1-based for display (`court.number`), but arrays are 0-based (use `courtIndex` from drag IDs).

If you add server APIs
- Add routes to `server/index.js`. Keep API surface minimal (e.g., GET /state, POST /player, POST /court/reorder) and update `client/src/App.jsx` fetch calls where needed. Currently client expects synchronous local state so incremental migration is safer.

Verification steps before PR
1. Run client tests: `cd client && npm test` (fix failures).
2. Start frontend locally: `cd client && npm run dev` and exercise drag/drop flows (Next Up, General queue, courts).
3. Lint/build: `cd client && npm run build`.

Questions for reviewer
- Are there any undocumented drag-id patterns you added in local branches? If yes, list them so I can update `parseDragId`.

Keep this file short; update when major structural changes are introduced.
Update this file as new architectural patterns or workflows emerge.
