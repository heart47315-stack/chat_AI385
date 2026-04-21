# Expo AI Chat App - Complete Setup Guide

## Project Structure
```
my-expo-app/              # React Native Expo frontend
backend/                  # Express.js backend with OpenAI
```

---

## FRONTEND SETUP (my-expo-app)

### 1. Install Dependencies
```bash
cd my-expo-app
npm install
```

### 2. Fix Network Access (Android)
The app communicates with backend at `192.168.1.100:3000`. To allow cleartext traffic on Android:
- Already configured in `app.json` with `usesCleartextTraffic: true`

### 3. Run the App

**Option A: Development Mode**
```bash
npx expo start
```
Then:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for Web

**Option B: Android Emulator**
```bash
npx expo start --android
```

**Option C: iOS Simulator**
```bash
npx expo start --ios
```

**Option D: Web Browser**
```bash
npx expo start --web
```

---

## BACKEND SETUP (backend)

### 1. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it (save securely!)

### 2. Create `.env` File
```bash
cd backend
```

Create `.env` file:
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
PORT=3000
```

**Or copy from example:**
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Backend Server
```bash
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   AI Chat Backend is running!          ║
║   Port: 3000                           ║
║   API: http://0.0.0.0:3000             ║
║   Health: http://localhost:3000/health ║
╚════════════════════════════════════════╝
```

### 5. Test Backend (Optional)
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello AI"}'
```

---

## CONNECT FRONTEND TO BACKEND

### 1. Find Your Machine IP
**Windows:**
```bash
ipconfig
```
Look for IPv4 Address (e.g., `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
```

### 2. Update App IP
Edit `my-expo-app/App.js` line 16:
```javascript
const API_URL = 'http://YOUR_IP:3000/chat';
```

Replace `YOUR_IP` with your actual IP (e.g., `192.168.1.100`)

### 3. Make Sure Backend & Frontend Are on Same Network
- Both should be on same WiFi/LAN network
- Firewall may block port 3000 - allow it if needed

---

## COMPLETE STARTUP SEQUENCE

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm start
```

Wait for server to start, then...

**Terminal 2 - Frontend:**
```bash
cd my-expo-app
npm install
npx expo start
```

Press `a` for Android or `i` for iOS

---

## FEATURES

✅ Dark theme UI  
✅ Real-time chat with AI  
✅ Message history  
✅ Loading indicator  
✅ Error handling  
✅ Auto-scroll to latest message  
✅ Responsive layout  

---

## TROUBLESHOOTING

### "net::ERR_CONNECTION_REFUSED"
- Backend is not running
- Wrong IP address in App.js
- Firewall blocking port 3000
- Solution: Check backend is running, correct IP, allow port 3000

### "API error: 401"
- Invalid OpenAI API key
- Solution: Check `.env` file has correct key from https://platform.openai.com/api-keys

### "API error: 429"
- Rate limit exceeded (too many requests)
- Solution: Wait a moment, try again

### App not loading
- Missing dependencies
- Solution: Run `npm install` again
- Clear cache: `npx expo start --clear`

### Can't install packages
- Node/npm not installed
- Solution: Install from https://nodejs.org

---

## Files Changed

- ✅ `my-expo-app/App.js` - Complete AI chat UI
- ✅ `my-expo-app/package.json` - Expo dependencies
- ✅ `my-expo-app/app.json` - Expo config
- ✅ `backend/server.js` - Express API with OpenAI
- ✅ `backend/package.json` - Backend dependencies
- ✅ `backend/.env.example` - Environment template

---

## Costs

OpenAI API usage is charged by token. Typical chat cost: $0.001-0.01 per message

Check usage: https://platform.openai.com/account/usage
