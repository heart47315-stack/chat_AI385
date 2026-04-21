const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// ✅ mock database (เก็บใน memory)
let characters = [];
let chats = [];

// =========================
// ✅ HEALTH
// =========================
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

// =========================
// ✅ CREATE CHARACTER
// =========================
app.post('/character', (req, res) => {
    const { name, description, personality, scenario, avatar, tags } = req.body;

    if (!name) {
        return res.status(400).json({ error: "name required" });
    }

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

// =========================
// ✅ GET ALL CHARACTER
// =========================
app.get('/character', (req, res) => {
    res.json(characters);
});

// =========================
// ✅ CHAT HISTORY
// =========================
app.get('/chat', (req, res) => {
    const { characterId } = req.query;

    const history = chats.filter(c => c.characterId === characterId);

    res.json(history);
});

// =========================
// ✅ SEND MESSAGE
// =========================
app.post('/chat', async (req, res) => {
    try {
        const { message, characterId } = req.body;

        const character = characters.find(c => c.id === characterId);

        if (!character) {
            return res.status(404).json({ error: "Character not found" });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `
You are roleplaying as this character:

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

        // ✅ save chat
        chats.push({
            characterId,
            sender: "user",
            content: message
        });

        chats.push({
            characterId,
            sender: "ai",
            content: reply
        });

        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
    console.log("🔥 Backend running on http://localhost:" + PORT);
});