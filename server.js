// server.js (update)
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import progressRoutes from './routes/Progress.js';

// Import Progress model
import Progress from './models/Progress.js';

// Load environment variables
dotenv.config();

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.static(path.join(__dirname, 'public'))); // For serving static files

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// API Routes
app.use('/api/progress', progressRoutes);

// Main route - render the calendar
app.get('/', async (req, res) => {
  try {
    // Get user progress
    const userProgress = await Progress.findOne({ userId: 'default-user' });
    
    // If no progress found, create initial progress
    let completedDays = [];
    if (userProgress) {
      completedDays = userProgress.completedDays;
    }

    // Render the index page with user progress
    res.render('index', { 
      completedDays: JSON.stringify(completedDays)
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});