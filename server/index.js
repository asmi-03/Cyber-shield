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


        // 3. Send Webhook (Fire and Forget)
        if (process.env.WEBHOOK_URL) {
            axios.post(process.env.WEBHOOK_URL, result)
                .then(() => console.log('Webhook sent successfully'))
                .catch(err => console.error('Webhook failed:', err.message));
        }

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

// AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        console.log('Sending message to AI Agent at:', process.env.AI_AGENT_WEBHOOK);
        if (!process.env.AI_AGENT_WEBHOOK) {
            console.error('AI_AGENT_WEBHOOK is not defined in .env');
            return res.json({ reply: "AI Agent is not configured. Please contact support." });
        }

        const response = await axios.post(process.env.AI_AGENT_WEBHOOK, { message });

        // Log the full response from n8n for debugging
        console.log('n8n Full Response:', JSON.stringify(response.data, null, 2));

        // Check for specific error fields cleanly
        if (response.data.error) {
            console.error('n8n returned an error:', response.data.error);
            return res.json({ reply: `Error from AI Agent: ${response.data.error.message || response.data.error}` });
        }

        // Assume n8n returns { reply: "..." } or { output: "..." } or { text: "..." }
        // If n8n returns a JSON object with the answer in a property
        const reply = response.data.reply || response.data.output || response.data.text || (typeof response.data === 'string' ? response.data : null);

        if (!reply) {
            console.warn('n8n returned no recognizable reply field. Raw data:', response.data);
            // Verify if your n8n Respond to Webhook node is set to "JSON" and has a "reply" field
            return res.json({ reply: "I received an empty response from the AI agent. Please check the n8n workflow 'Respond to Webhook' node." });
        }

        res.json({ reply });

    } catch (error) {
        console.error('AI Chat Error:', error.message);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('n8n Response Data:', error.response.data);
            console.error('n8n Response Status:', error.response.status);
            return res.status(error.response.status).json({
                reply: `AI Service Error (${error.response.status}): ${JSON.stringify(error.response.data)}`
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('n8n No Response:', error.request);
            return res.status(503).json({ reply: "AI Service is unreachable. Is n8n running?" });
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up n8n request:', error.message);
            res.status(500).json({ reply: "Internal Server Error during AI request." });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
