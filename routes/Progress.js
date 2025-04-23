// routes/progress.js
import express from 'express';
import Progress from '../models/Progress.js';

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

export default router;