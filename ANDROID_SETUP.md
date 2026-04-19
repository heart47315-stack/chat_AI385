# 🔥 Character Chat Android App Setup

ทำให้เว็บ React ของคุณเป็นแอป Android ทั้งตัว! ✨

## 📦 Requirements
- Android Studio (latest)
- JDK 11+
- Android SDK 24+

## 🚀 Quick Start

### 1️⃣ Download Android Studio
```bash
# Visit: https://developer.android.com/studio
```

### 2️⃣ Setup Android Project
```bash
# Open Android Studio → Open Project → Select: android/
```

### 3️⃣ Configure Network for Development

#### Option A: Use Ngrok (Recommended for easy testing)
```bash
# Install ngrok: https://ngrok.com/

# Expose your React dev server
ngrok http 5173

# You'll get a URL like: https://xxxxx.ngrok.io
# Update MainActivity.kt:
# webView.loadUrl("https://xxxxx.ngrok.io")
```

#### Option B: Direct Local Network (Advanced)
1. Find your PC's IP address:
   ```bash
   ipconfig /all
   # Look for IPv4 Address: 192.168.x.x
   ```

2. Update `MainActivity.kt`:
   ```kotlin
   webView.loadUrl("http://192.168.x.x:5173")
   ```

3. Allow cleartext traffic on Android 9+:
   - Already configured in `AndroidManifest.xml`

4. Start React dev server:
   ```bash
   cd frontend
   npm run dev -- --host 0.0.0.0
   ```

### 4️⃣ Run on Device/Emulator
```bash
# In Android Studio:
# 1. Connect your device or open emulator
# 2. Click: Run → Run 'app'
# OR press: Shift + F10
```

## 📱 Build APK for Distribution

### Debug APK (Testing)
```bash
# In Android Studio Terminal:
cd android
./gradlew assembleDebug

# APK location: app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (Production)
```bash
# First, create a keystore:
keytool -genkey -v -keystore ~/release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias char-chat

# Build release:
cd android
./gradlew assembleRelease

# APK location: app/build/outputs/apk/release/app-release.apk
```

## 🔧 Configuration

### Network Configuration
**File:** `android/app/src/main/AndroidManifest.xml`
- Internet permission: ✅
- Cleartext traffic: ✅ (Already allowed)

### Theme Configuration
**File:** `android/app/src/main/res/values/themes.xml`
- Dark theme: ✅
- Status bar dark: ✅

### WebView Settings
**File:** `android/app/src/main/java/com/characterchat/app/MainActivity.kt`
- JavaScript: ✅
- DOM Storage: ✅
- Cache: ✅
- Back button: ✅

## 🎨 Features

✅ Full React app integration
✅ WebView with caching
✅ Back button support
✅ Dark theme (matching your design!)
✅ Mobile optimized layout
✅ Network detection
✅ Camera & Microphone support (if needed)

## 🐛 Troubleshooting

### "Cannot connect to server"
- Check React dev server is running: `npm run dev`
- Verify IP address matches your PC
- Try Ngrok method for easier setup

### "Blank white screen"
- Check browser console: `adb logcat`
- Ensure React app loads on browser
- Check URL in `MainActivity.kt`

### "App crashes on startup"
- Install all SDKs: Tools → SDK Manager
- Clean & rebuild: `./gradlew clean assembleDebug`

## 📝 Next Steps

1. ✅ Setup Android Studio + download SDKs
2. ✅ Update IP/URL in `MainActivity.kt`
3. ✅ Run React: `npm run dev`
4. ✅ Build & run Android: `./gradlew installDebug`
5. ✅ Test on device/emulator

## 🎯 Customization

### Change App Name
**File:** `android/app/src/main/res/values/strings.xml`
```xml
<string name="app_name">Your App Name</string>
```

### Change App Icon
1. Replace files in: `android/app/src/main/res/mipmap-*`
2. Image size: 192x192px minimum

### Change Theme Colors
**File:** `android/app/src/main/res/values/themes.xml`
```xml
<item name="colorPrimary">#1a1a1a</item>
```

## 📚 Resources
- [Android WebView Docs](https://developer.android.com/reference/android/webkit/WebView)
- [Android Studio Guide](https://developer.android.com/studio/intro)
- [Kotlin Language Docs](https://kotlinlang.org/docs)
- [Ngrok Documentation](https://ngrok.com/docs)

---

Happy coding! 🚀 If you have issues, check the Android logcat output.
