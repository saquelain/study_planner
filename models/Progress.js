// models/Progress.js
import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        default: 'default-user' // We'll use a single user for now
    },
    completedDays: {
        type: [String], // Array of strings in format 'YYYY-M-D'
        default: []
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const Progress = mongoose.model('Progress', ProgressSchema);

export default Progress;

const VariableSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed, // Allows any data type
        required: true
    }
});

const Variable = mongoose.model('Variable', VariableSchema);

export { Variable };