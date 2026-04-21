const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'AI Chat Backend is running' });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({
                error: 'OpenAI API key not configured. Set OPENAI_API_KEY in .env',
            });
        }

        // Create chat completion
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a helpful, friendly AI assistant. Keep responses concise and under 200 words.',
                },
                {
                    role: 'user',
                    content: message,
                },
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;

        res.json({ reply });
    } catch (error) {
        console.error('OpenAI API Error:', error);

        if (error.status === 401) {
            res.status(401).json({
                error: 'Invalid OpenAI API key',
            });
        } else if (error.status === 429) {
            res.status(429).json({
                error: 'Rate limit exceeded. Please try again later.',
            });
        } else {
            res.status(500).json({
                error: error.message || 'Internal server error',
            });
        }
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════╗
║   AI Chat Backend is running!          ║
║   Port: ${PORT}                            ║
║   API: http://0.0.0.0:${PORT}              ║
║   Health: http://localhost:${PORT}/health ║
╚════════════════════════════════════════╝
  `);
});
