# 🚀 Getting Started - Step by Step

## ✅ Setup Checklist

### Step 1: Frontend Setup (5 minutes)

- [ ] Navigate to frontend folder
- [ ] Run `npm install`
- [ ] Run `npm run dev -- --host`
- [ ] Open browser: `http://localhost:5173`
- [ ] Verify page loads
- [ ] Test search bar
- [ ] Test card hover

### Step 2: Backend Setup (5 minutes)

- [ ] Navigate to backend folder
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Verify server runs on `http://localhost:5000`
- [ ] Test endpoint: `http://localhost:5000/character`
- [ ] Should return character list

### Step 3: Test Web Version (10 minutes)

- [ ] Backend running ✅
- [ ] Frontend running ✅
- [ ] Open `http://localhost:5173` in browser
- [ ] See character cards loading
- [ ] Try searching (should filter)
- [ ] Hover over cards (should glow + zoom)
- [ ] Click card (should navigate to chat)
- [ ] Bottom navigation visible
- [ ] Icons work

### Step 4: Android App Setup (Optional)

- [ ] Download [Android Studio](https://developer.android.com/studio)
- [ ] Install & open Android Studio
- [ ] File → Open → Select `android/` folder from project
- [ ] Wait for Gradle sync (1-2 minutes)
- [ ] Click Run or press Shift + F10
- [ ] Choose emulator or device
- [ ] App should load and show React page

### Step 5: Android Network Configuration

Choose ONE method:

#### Method A: Ngrok (Easiest)
- [ ] Download [Ngrok](https://ngrok.com/download)
- [ ] Extract and run: `ngrok http 5173`
- [ ] Copy the HTTPS URL (looks like: `https://xxxx.ngrok.io`)
- [ ] Open `android/app/src/main/java/com/characterchat/app/MainActivity.kt`
- [ ] Change line: `webView.loadUrl("http://localhost:5173")`
- [ ] To: `webView.loadUrl("https://xxxx.ngrok.io")`
- [ ] Run Android app (Shift + F10)
- [ ] App should load the React page

#### Method B: Local Network
- [ ] Open Command Prompt
- [ ] Run: `ipconfig /all`
- [ ] Find "IPv4 Address: 192.168.x.x"
- [ ] Open `android/app/src/main/java/com/characterchat/app/MainActivity.kt`
- [ ] Change line: `webView.loadUrl("http://localhost:5173")`
- [ ] To: `webView.loadUrl("http://192.168.x.x:5173")` (use your IP)
- [ ] Stop frontend dev server
- [ ] Start it again with: `npm run dev -- --host 0.0.0.0`
- [ ] Run Android app (Shift + F10)
- [ ] App should load the React page

#### Method C: Production URL
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Get production URL
- [ ] Update `MainActivity.kt` with production URL
- [ ] No other changes needed

---

## 🎯 Testing Workflow

### Daily Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev -- --host

# Terminal 3: Optional - Monitor logs
adb logcat | grep -i error
```

### Android Testing

```bash
# Build and run
cd android
./gradlew installDebug

# Or use Android Studio:
# - Click Run
# - Select device
# - Press OK
```

---

## 🐛 Quick Troubleshooting

### "Cannot load app in Android"
```bash
# 1. Check if React app loads on browser first
# 2. Check URL in MainActivity.kt
# 3. Use Ngrok method instead of localhost
# 4. Check Android logcat: adb logcat
```

### "Frontend shows blank page"
```bash
# 1. Check backend is running
# 2. Check http://localhost:5000/character works
# 3. Check browser console: F12
# 4. Restart frontend: Ctrl+C then npm run dev -- --host
```

### "Search doesn't work"
```bash
# 1. Check character data is loading (F12 Network tab)
# 2. Check console for errors: F12
# 3. Verify API response has data
```

### "APK won't install"
```bash
# Try:
adb uninstall com.characterchat.app
adb install -r app-debug.apk

# Or in Android Studio:
# - Clean: Build → Clean Project
# - Rebuild: Build → Rebuild Project
# - Run: Shift + F10
```

---

## 📱 Mobile Browser Testing (No App)

If you don't want to use Android app:

1. **Open DevTools:** F12 in Chrome/Firefox
2. **Toggle mobile view:** Ctrl + Shift + M (Windows) or Cmd + Shift + M (Mac)
3. **Test on mobile browser:**
   - **iOS Safari:** `http://192.168.x.x:5173`
   - **Android Chrome:** `http://192.168.x.x:5173`

---

## ✨ First Run Checklist

After everything is set up, verify:

- [ ] Backend running on `http://localhost:5000` ✅
- [ ] Frontend running on `http://localhost:5173` ✅
- [ ] API endpoint returns characters
- [ ] Web page shows character cards
- [ ] Cards have images
- [ ] Search filters characters
- [ ] Hover effects work
- [ ] Navigation bar visible
- [ ] Bottom nav buttons work
- [ ] Click card navigates to chat
- [ ] Android app loads React page (if using Android)
- [ ] Search works in Android app
- [ ] Back button works in Android app

---

## 📊 File Reference

### Key Files to Know

**Frontend:**
- `frontend/src/pages/Home.tsx` - Main page (NEW UI!)
- `frontend/src/App.css` - Animations (NEW!)
- `frontend/package.json` - Dependencies

**Backend:**
- `backend/src/index.ts` - API server
- `backend/src/routes/character.ts` - Character endpoints
- `backend/src/routes/chat.ts` - Chat endpoints

**Android:**
- `android/app/src/main/java/com/characterchat/app/MainActivity.kt` - WebView setup
- `android/app/src/main/AndroidManifest.xml` - App config
- `android/app/build.gradle.kts` - Dependencies

**Docs:**
- `README_MOBILE.md` - Complete guide
- `ANDROID_SETUP.md` - Android setup details
- `QUICK_REFERENCE.md` - Quick tips
- `COMPLETED.md` - What was done
- `GETTING_STARTED.md` - This file!

---

## 🎓 Common Tasks

### Change App Name
1. Open: `android/app/src/main/res/values/strings.xml`
2. Edit: `<string name="app_name">New Name</string>`
3. Rebuild APK

### Change Colors
1. Open: `frontend/src/App.css`
2. Find color variables (purple, cyan, pink)
3. Change hex values
4. Restart frontend server

### Change Icon
1. Place new icon at: `android/app/src/main/res/mipmap-*`
2. Rebuild APK

### Deploy Frontend
```bash
cd frontend
npm run build
# Upload dist/ folder to Vercel/Netlify
```

### Build Release APK
```bash
# First time: Create keystore
keytool -genkey -v -keystore ~/release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias character-chat

# Then build
cd android
./gradlew assembleRelease
```

---

## 📚 Learning Resources

### Recommended Order to Read
1. This file (GETTING_STARTED.md) ← You are here
2. QUICK_REFERENCE.md - Quick tips and commands
3. README_MOBILE.md - Full documentation
4. ANDROID_SETUP.md - Android-specific setup
5. COMPLETED.md - What was implemented

### Code Files to Explore
```
Good to understand:
- frontend/src/pages/Home.tsx (React + Tailwind)
- frontend/src/App.css (CSS animations)
- android/.../MainActivity.kt (WebView setup)
```

---

## 🎯 Next Steps After Setup

### Week 1: Testing
- [ ] Test all features work
- [ ] Test on multiple devices
- [ ] Test on different networks
- [ ] Gather feedback

### Week 2: Customization
- [ ] Change app colors/theme
- [ ] Add more characters
- [ ] Customize app icon/name
- [ ] Add custom features

### Week 3: Deployment
- [ ] Deploy frontend
- [ ] Set up production backend
- [ ] Build release APK
- [ ] Publish to Google Play

---

## 💡 Pro Tips

1. **Use Ngrok for easy testing** - Works on any network
2. **Always check logcat** - `adb logcat | grep error` for Android issues
3. **Clear cache if UI doesn't update** - `./gradlew clean`
4. **Test in browser first** - Before testing on Android app
5. **Keep backend running** - Otherwise frontend can't fetch characters
6. **Use Chrome DevTools** - F12 to debug web pages

---

## 🆘 Still Stuck?

1. Check error message carefully
2. Look in the appropriate docs file
3. Check Android logcat or browser console
4. Try clearing cache and rebuilding
5. Restart servers
6. Restart Android Studio
7. Restart computer (if all else fails!)

---

## 🎉 Success!

Once everything is running:
- Frontend shows character cards ✅
- Android app shows React page ✅
- Search works ✅
- Navigation works ✅

**You're ready to go!**

---

## 📞 Quick Command Reference

```bash
# Navigate to folder
cd backend                    # Go to backend
cd ../frontend               # Go to frontend
cd ../android                # Go to android

# Install dependencies
npm install                  # Install npm packages
./gradlew build             # Gradle build (Android)

# Run development
npm run dev                 # Backend dev server
npm run dev -- --host       # Frontend (accessible from network)

# Build
npm run build               # Frontend production build
./gradlew assembleDebug     # Android debug APK
./gradlew assembleRelease   # Android release APK

# Debug
adb logcat                  # View Android logs
F12                         # Browser developer tools
```

---

**Happy coding! 🚀**

Start with the web version, then try the Android app when ready.

For detailed info, see the other documentation files!
