const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios'); // For calling ML service

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Cyber Shield 3D API is running');
});

// Scan URL Endpoint
app.post('/api/scan', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // 1. Call ML Service (Python)
        // Note: Ensure the python service is running on port 5000 (wait, default flask/uvicorn might conflict, let's check ports)
        // I will assume Python runs on 5001 for now to avoid conflict with Express on 5000
        const mlResponse = await axios.post('http://localhost:5001/predict', { url });

        const result = {
            url,
            ...mlResponse.data,
            timestamp: new Date()
        };

        // 2. Save to MongoDB (TODO: Create Schema later, just logging for now)
        console.log('Scan Result:', result);

        return res.json(result);

    } catch (error) {
        console.error('Scan Error:', error.message);
        // Fallback mock response if ML service is down
        return res.json({
            url,
            prediction: 'unknown',
            confidence: 0,
            error: 'ML Service unavailable'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
