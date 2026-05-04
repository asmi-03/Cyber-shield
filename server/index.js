const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cybershield')
    .then(() => console.log('MongoDB Connected for Logging'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Threat Log Schema
const ThreatLogSchema = new mongoose.Schema({
    id: String,
    type: String,
    target: String,
    status: String,
    time: String,
    severity: String,
});
const ThreatLog = mongoose.model('ThreatLog', ThreatLogSchema);

// In-memory threat level score
let currentThreatLevel = 'Low';

// Helper to evaluate threat level based on past 5 logs
const calculateThreatLevel = async () => {
    const logs = await ThreatLog.find().sort({_id: -1}).limit(5);
    const criticals = logs.filter(l => l.severity === 'Critical').length;
    const highs = logs.filter(l => l.severity === 'High').length;
    if (criticals > 0) return 'High';
    if (highs > 1) return 'High';
    if (highs === 1 || logs.some(l => l.severity === 'Medium')) return 'Medium';
    return 'Low';
}

// Routes
app.get('/', (req, res) => {
    res.send('Cyber Shield API is running');
});

// Original Scan URL Endpoint
app.post('/api/scan', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    try {
        const mlResponse = await axios.post('http://localhost:5001/predict', { url });
        const result = { url, ...mlResponse.data, timestamp: new Date() };
        console.log('Scan Result:', result);
        if (process.env.WEBHOOK_URL) {
            axios.post(process.env.WEBHOOK_URL, result).catch(e => {});
        }
        return res.json(result);
    } catch (error) {
        return res.json({ url, prediction: 'unknown', confidence: 0, error: 'ML Service unavailable' });
    }
});

// Original Chat Endpoint
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    try {
        if (!process.env.AI_AGENT_WEBHOOK) return res.json({ reply: "AI Agent not configured." });
        const response = await axios.post(process.env.AI_AGENT_WEBHOOK, { message });
        const reply = response.data.reply || response.data.output || response.data.text || null;
        res.json({ reply: reply || "I received an empty response." });
    } catch (error) {
        res.status(500).json({ reply: "Internal Server Error during AI request." });
    }
});

// Robust n8n Proxy Endpoint
app.post('/api/n8n', async (req, res) => {
    try {
        const webhookUrl = process.env.AI_AGENT_WEBHOOK || 'http://localhost:5678/webhook/xyz123';
        const response = await axios.post(webhookUrl, req.body);
        res.json(response.data);
    } catch (error) {
        console.error("n8n Proxy Error:", error.message);
        res.status(500).json({ 
            error: "Failed to connect to n8n", 
            details: error.message,
            hint: "Make sure n8n is running and the webhook URL is correct."
        });
    }
});
app.get('/api/dashboard', async (req, res) => {
    try {
        const logs = await ThreatLog.find().sort({_id: -1}).limit(20);
        currentThreatLevel = await calculateThreatLevel();
        res.json({ threatLevel: currentThreatLevel, logs });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// SIMULATION API
app.post('/api/simulate', async (req, res) => {
    const attacks = [
        { type: 'Phishing Email', target: 'Employee Inbox', severity: 'High' },
        { type: 'Malware Download', target: 'User Browser', severity: 'Critical' },
        { type: 'SQL Injection', target: 'Database', severity: 'Medium' },
        { type: 'Brute Force SSH', target: 'Server', severity: 'High' },
        { type: 'Anomalous Login', target: 'VPN', severity: 'Medium' },
    ];
    
    const attack = attacks[Math.floor(Math.random() * attacks.length)];
    const log = new ThreatLog({
        id: Date.now().toString(),
        type: attack.type,
        target: attack.target,
        status: 'Blocked',
        time: new Date().toLocaleTimeString(),
        severity: attack.severity
    });

    try {
        await log.save();
        currentThreatLevel = await calculateThreatLevel();
        const logs = await ThreatLog.find().sort({_id: -1}).limit(20);
        res.json({ threatLevel: currentThreatLevel, logs });
    } catch (err) {
        res.status(500).json({ error: 'Simulation failed' });
    }
});

// AI EXPLANATION API
app.post('/api/explain', async (req, res) => {
    const { log } = req.body;
    if (!log) return res.status(400).json({ error: 'Log data required' });
    
    // Simulate AI Agent reasoning
    setTimeout(() => {
        const reasonings = {
            'Phishing Email': `The Email Analyzer Agent detected spoofed headers and a malicious payload link matching VirusTotal's database. The Decision Agent recommended immediate quarantine.`,
            'Malware Download': `The URL Scanner Agent identified obfuscated code executing a known trojan signature. Connection was severed by the Auto-Response System.`,
            'SQL Injection': `The Behavior Analysis Agent detected anomalous syntax in login parameters (' OR 1=1 --). Blocked by WAF automatically.`,
            'Brute Force SSH': `Behavior Analysis Agent noted >50 failed login attempts from a single suspect IP in 10 seconds. The IP has been blacklisted by Auto-Response System.`,
            'Anomalous Login': `Behavior Analysis Agent flagged login from unverified geo-location. Multi-factor auth enforcement was triggered resulting in a timeout.`,
        };
        const defaultText = `Our distributed AI Agents collaborated to analyze this ${log.severity} threat. The behavior matched suspicious patterns and was neutralized proactively.`;
        res.json({ explanation: reasonings[log.type] || defaultText });
    }, 1500); // slight delay to simulate thinking
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
