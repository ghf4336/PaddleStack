// Simple Express server for PaddleStack backend
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory data placeholder
const db = {
  players: [],
  courts: []
};

app.get('/', (req, res) => {
  res.send('PaddleStack backend running');
});

// Placeholder for API routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
