const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 🔥 mock database
let characters = [
    {
        id: "1",
        name: "AI Girl",
        description: "แฟน AI ของคุณ 💖",
        avatar: ""
    }
];

let chats = [];

// ==================
// TEST
// ==================
app.post('/test', (req, res) => {
    res.json({ ok: true });
});

// ==================
// CHARACTER
// ==================
app.get('/character', (req, res) => {
    res.json(characters); // ✅ ต้องเป็น array
});

app.post('/character', (req, res) => {
    const { name, description, avatar } = req.body;

    const newChar = {
        id: Date.now().toString(),
        name,
        description,
        avatar
    };

    characters.push(newChar);
    res.json(newChar);
});

// ==================
// CHAT HISTORY
// ==================
app.get('/chat', (req, res) => {
    const { characterId } = req.query;

    const history = chats.filter(c => c.characterId === characterId);
    res.json(history);
});

// ==================
// CHAT
// ==================
app.post('/chat', (req, res) => {
    const { message, characterId } = req.body;

    const reply = `🤖 AI: ${message}`;

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
});

app.listen(PORT, () => {
    console.log("🚀 http://localhost:3000");
});