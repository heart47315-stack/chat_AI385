# 🚀 Quick Start (2 Minutes)

## Step 1: Update API Key
Edit `backend/.env`:
```
OPENAI_API_KEY="sk-your-actual-key-here"
```

Get your key from: https://platform.openai.com/api-keys

## Step 2: Start the App
```bash
double-click start.bat
```

Or manually:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

## Step 3: Open Browser
Go to: **http://localhost:3000**

## Step 4: Start Chatting! 🎉

### Try These:
1. Click on any character card to chat
2. Type a message and press Enter
3. Click "✨ Create Character" to add your own character
4. Enjoy! 

---

## 🆘 Troubleshooting

**Backend won't start?**
- Make sure port 5000 is free: `netstat -ano | find ":5000"`
- Check .env file has valid OPENAI_API_KEY

**Frontend shows error?**
- Make sure backend is running on http://localhost:5000
- Check browser console (F12) for errors

**No characters showing?**
- Run `cd backend && npm run seed` to populate database

---

## 📝 Files You Might Want to Edit

- `backend/.env` - API key and database location
- `backend/prisma/seed.ts` - Add more sample characters
- `frontend/src/pages/Home.tsx` - Customize home page
- `frontend/tailwind.config.js` - Change colors/theme

---

**Status**: ✅ Ready to Go!
**Version**: 1.0
**Last Updated**: 2026-04-17
