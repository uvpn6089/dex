// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB Atlas (Replace with your actual Atlas connection string in .env or directly here)
const MONGO_URI = process.env.MONGO_URI || "YOUR_MONGODB_ATLAS_CONNECTION_STRING";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define Counter Schema & Model
const counterSchema = new mongoose.Schema({
  count: { type: Number, default: 0 }
});
const Counter = mongoose.model('Counter', counterSchema);

// Helper function to ensure a counter document always exists
async function getOrCreateCounter() {
  let doc = await Counter.findOne();
  if (!doc) {
    doc = await Counter.create({ count: 0 });
  }
  return doc;
}

// API: Get current count
app.get('/api/counter', async (req, res) => {
  try {
    const counter = await getOrCreateCounter();
    res.json({ count: counter.count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

// API: Increment and save count
app.post('/api/counter/increment', async (req, res) => {
  try {
    const counter = await getOrCreateCounter();
    counter.count += 1;
    await counter.save();
    res.json({ count: counter.count });
  } catch (err) {
    res.status(500).json({ error: "Failed to update count" });
  }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
