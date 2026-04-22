const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// =====================
// MOCK DB
// =====================
let characters = [
    {
        id: "1",
        name: "Luna 💖",
        description: "แฟน AI อ่อนโยน อบอุ่น",
        personality: "sweet, caring",
        scenario: "girlfriend",
        avatar: "https://placehold.co/300x200?text=Luna",
        tags: "romantic"
    },
    {
        id: "2",
        name: "Akira 😈",
        description: "หนุ่มกวน ปากร้าย แต่ห่วง",
        personality: "tsundere, teasing",
        scenario: "friend",
        avatar: "https://placehold.co/300x200?text=Akira",
        tags: "tsundere"
    },
    {
        id: "3",
        name: "Nova 🤖",
        description: "AI อัจฉริยะ ตอบทุกคำถาม",
        personality: "logical, smart",
        scenario: "assistant",
        avatar: "https://placehold.co/300x200?text=Nova",
        tags: "smart"
    }
];

let chats = [];

// =====================
// HEALTH
// =====================
app.get('/health', (req, res) => {
    res.json({ status: "OK" });
});

// =====================
// CHARACTER
// =====================
app.get('/character', (req, res) => {
    res.json(characters);
});

app.post('/character', (req, res) => {
    const { name, description, personality, scenario, avatar, tags } = req.body;

    if (!name) return res.status(400).json({ error: "name required" });

    const newChar = {
        id: Date.now().toString(),
        name,
        description,
        personality,
        scenario,
        avatar,
        tags
    };

    characters.push(newChar);
    res.json(newChar);
});

// =====================
// CHAT (AI)
// =====================
app.post('/chat', async (req, res) => {
    try {
        const { message, characterId } = req.body;

        const character = characters.find(c => c.id === characterId);
        if (!character) {
            return res.status(404).json({ error: "Character not found" });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are roleplaying:

Name: ${character.name}
Personality: ${character.personality}
Scenario: ${character.scenario}
Stay in character.
`
                },
                { role: "user", content: message }
            ]
        });

        const reply = completion.choices[0].message.content;

        chats.push({ characterId, sender: "user", content: message });
        chats.push({ characterId, sender: "ai", content: reply });

        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// =====================
// CHAT HISTORY (NEW)
// =====================
app.get('/chat', (req, res) => {
    try {
        const { characterId } = req.query;

        if (!characterId) {
            return res.status(400).json({ error: "characterId is required" });
        }

        const result = chats.filter(
            (c) => String(c.characterId) === String(characterId)
        );

        res.json(result);

    } catch (err) {
        console.error("GET /chat error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// =====================
// START SERVER (ต้องอยู่ล่างสุด)
// =====================
app.listen(PORT, () => {
    console.log(`🔥 Backend running http://localhost:${PORT}`);
});