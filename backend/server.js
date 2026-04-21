const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ✅ in-memory database
let characters = [];
let chats = [];

// =========================
// HEALTH
// =========================
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// =========================
// CHARACTER
// =========================

// 🔥 GET all characters
app.get('/character', (req, res) => {
    res.json(characters);
});

// 🔥 CREATE character
app.post('/character', (req, res) => {
    const { name, description, avatar } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const newChar = {
        id: Date.now().toString(),
        name,
        description: description || '',
        avatar: avatar || '',
    };

    characters.push(newChar);
    res.json(newChar);
});

// =========================
// CHAT HISTORY
// =========================

// 🔥 GET chat history
app.get('/chat', (req, res) => {
    const { characterId } = req.query;

    const history = chats.filter(c => c.characterId === characterId);
    res.json(history);
});

// =========================
// CHAT AI
// =========================
app.post('/chat', async (req, res) => {
    try {
        const { message, characterId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message required' });
        }

        // 🔥 หา character
        const character = characters.find(c => c.id === characterId);

        // 🔥 สร้าง system prompt
        const systemPrompt = character
            ? `You are ${character.name}. ${character.description}`
            : 'You are a helpful AI assistant';

        // 🔥 เรียก OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // 🔥 แนะนำตัวนี้แทน 3.5
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message },
            ],
            temperature: 0.7,
        });

        const reply = completion.choices[0].message.content;

        // 🔥 save history
        chats.push({
            characterId,
            sender: 'user',
            content: message,
        });

        chats.push({
            characterId,
            sender: 'ai',
            content: reply,
        });

        res.json({ reply });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message || 'AI error',
        });
    }
});

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});