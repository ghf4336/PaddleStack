# PaddleStack

A simple, web browser-based Pickleball queue system. 

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

## Development
- Requirements are implemented incrementally as described in the requirements file.
- No persistent database; all data is in-memory.

---
See `Context files/PaddleStack requirements.txt` for feature details.

To remove load data button
{/* <button className="load-test-btn" style={{ margin: '8px 0', width: '100%' }} onClick={handleLoadTestData}>
  Load Test Data
</button> */} comment that out