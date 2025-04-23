import express from 'express';
import { Variable } from '../models/Progress.js';

const router = express.Router();

// Route to render the variables panel
router.get('/', async (req, res) => {
    try {
        const variables = await Variable.find();
        res.render('variables', { variables });
    } catch (err) {
        console.error('Error fetching variables:', err);
        res.status(500).send('Server Error');
    }
});

// Route to create or update a variable
router.post('/', async (req, res) => {
    try {
        const { key, value } = req.body;

        if (!key) {
            return res.status(400).send('Key is required');
        }

        await Variable.findOneAndUpdate(
            { key },
            { value },
            { new: true, upsert: true }
        );

        res.redirect('/variables');
    } catch (err) {
        console.error('Error saving variable:', err);
        res.status(500).send('Server Error');
    }
});

// Route to delete a variable
router.post('/delete', async (req, res) => {
    try {
        const { key } = req.body;

        if (!key) {
            return res.status(400).send('Key is required');
        }

        await Variable.findOneAndDelete({ key });

        res.redirect('/variables');
    } catch (err) {
        console.error('Error deleting variable:', err);
        res.status(500).send('Server Error');
    }
});

export default router;