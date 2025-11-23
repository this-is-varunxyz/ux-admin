const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Enable CORS - Add this BEFORE your routes
app.use(cors({
  origin: [
    'https://uxclubadmin.vercel.app',  // Your production frontend
    'http://localhost:5173',  
    'https://verybigevent.vercel.app',
    'http://localhost:3000'             // Alternative local port
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://varunkushwah500:71cpm52b6v@cluster0.rgheo2x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Registration Schema
const registrationSchema = new mongoose.Schema({
  leadName: String,
  leadEmail: String,
  leadPhone: String,
  teamSize: Number,
  members: [{
    name: String,
    email: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model('Registration', registrationSchema);

// API Endpoints
app.post('/api/register', async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    res.json({ message: 'Registration successful!' });
  } catch (error) {
    res.status(400).json({ errors: [error.message] });
  }
});

app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json({ registrations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));