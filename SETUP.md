# 🚀 Chat AI Setup Guide

## ✅ Requirements
- Node.js v18+ 
- npm or yarn
- OpenAI API Key

## 📦 Installation

### 1. Backend Setup
```bash
cd backend
npm install
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend .env
Create/update `backend/.env`:
```
DATABASE_URL="file:./prisma/dev.db"
OPENAI_API_KEY="sk-your-api-key-here"
PORT=5000
```

### Initialize Database
```bash
cd backend
npm run seed
```

This will create the SQLite database and seed it with sample characters.

## 🏃 Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Server will run on http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:5173 or http://localhost:3000

## 🧪 Testing

1. Open http://localhost:3000 (or http://localhost:5173)
2. Click on any character to chat
3. Click "✨ Create Character" to add new characters
4. Type a message and press Enter or click Send

## 📁 Project Structure

```
chat_AI385/
├── backend/
│   ├── src/
│   │   ├── index.ts         - Main server file
│   │   └── routes/
│   │       ├── chat.ts       - Chat endpoint
│   │       └── character.ts  - Character CRUD
│   ├── prisma/
│   │   ├── schema.prisma    - Database schema
│   │   └── seed.ts          - Database seeding
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.tsx          - Main app routes
    │   ├── pages/
    │   │   ├── Home.tsx      - Character list
    │   │   ├── Chat.tsx      - Chat interface
    │   │   └── CreateCharacter.tsx
    │   └── index.css        - Animations
    └── package.json
```

## 🔑 API Endpoints

### Character Routes
- `GET /character` - Get all characters
- `POST /character` - Create new character

### Chat Routes
- `POST /chat` - Send message to character

## 🐛 Troubleshooting

### Backend won't start
- Make sure port 5000 is available
- Check that OPENAI_API_KEY is set in .env
- Run `npm install` to install dependencies

### Frontend can't connect to backend
- Make sure backend is running on http://localhost:5000
- Check browser console for CORS errors
- Verify firewall settings

### Database errors
- Delete `backend/prisma/dev.db` and run `npm run seed` again
- Make sure Prisma CLI is installed: `npm install -g @prisma/cli`

## 📝 Notes

- All characters and messages are stored in SQLite locally
- OpenAI API calls cost money - use a valid API key
- The chatbot personality is set per character
- Message history is preserved per character
