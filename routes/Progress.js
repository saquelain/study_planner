// routes/progress.js
import express from 'express';
import Progress, { Variable } from '../models/Progress.js';

const router = express.Router();

// Get user progress
router.get('/', async (req, res) => {
    try {
        // Get user progress (using default user for now)
        const userProgress = await Progress.findOne({ userId: 'default-user' });
        
        // If no progress found, create initial progress
        let completedDays = [];
        if (userProgress) {
            completedDays = userProgress.completedDays;
        } else {
            const newProgress = new Progress({ userId: 'default-user' });
            await newProgress.save();
        }

        res.json({
            success: true,
            completedDays
        });
    } catch (err) {
        console.error('Error fetching progress:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// Update progress
router.post('/', async (req, res) => {
    try {
        const { completedDays } = req.body;
        
        // Check if completedDays is an array
        if (!Array.isArray(completedDays)) {
            return res.status(400).json({
                success: false,
                error: 'completedDays must be an array'
            });
        }
        
        // Update or create user progress
        const result = await Progress.findOneAndUpdate(
            { userId: 'default-user' },
            { 
                completedDays: completedDays,
                lastUpdated: Date.now()
            },
            { new: true, upsert: true }
        );
        
        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        console.error('Error updating progress:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

// Route to get all variables
router.get('/study-planner-variables', async (req, res) => {
    try {
        const variables = await Variable.find();
        res.json({ success: true, variables });
    } catch (err) {
        console.error('Error fetching variables:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Route to create or update a variable
router.post('/study-planner-variables', async (req, res) => {
    try {
        const { key, value } = req.body;

        if (!key) {
            return res.status(400).json({ success: false, error: 'Key is required' });
        }

        const variable = await Variable.findOneAndUpdate(
            { key },
            { value },
            { new: true, upsert: true }
        );

        res.json({ success: true, variable });
    } catch (err) {
        console.error('Error saving variable:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

export default router;