require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://127.0.0.1:3000', 
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://mallify.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean)
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from parent directory

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// API Route to handle early access signup
app.post('/api/join', async (req, res) => {
  try {
    const { name, mobile, email } = req.body;
    
    // Simple validation
    if (!name || !mobile || !email) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newUser = new User({ name, mobile, email });
    await newUser.save();

    res.status(201).json({ message: 'Successfully joined the revolution!' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
