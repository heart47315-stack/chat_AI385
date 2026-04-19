#!/bin/bash

# 🔥 Character Chat - Complete Development Setup

echo "════════════════════════════════════════════"
echo "🔥 Character Chat - Full Stack Setup 🔥"
echo "════════════════════════════════════════════"
echo ""

# Backend
echo "📦 Setting up Backend..."
cd backend
npm install
echo "✅ Backend ready"
echo ""

# Frontend
echo "🎨 Setting up Frontend..."
cd ../frontend
npm install
echo "✅ Frontend ready"
echo ""

echo "════════════════════════════════════════════"
echo "✨ Setup Complete! ✨"
echo "════════════════════════════════════════════"
echo ""
echo "🚀 To start developing:"
echo ""
echo "1️⃣  Backend:"
echo "    cd backend && npm run dev"
echo ""
echo "2️⃣  Frontend:"
echo "    cd frontend && npm run dev -- --host"
echo ""
echo "3️⃣  Android App:"
echo "    - Open Android Studio"
echo "    - Open: android/"
echo "    - Run on device/emulator"
echo ""
echo "📱 For mobile dev:"
echo "    - Use Ngrok OR"
echo "    - Update IP in MainActivity.kt to your PC's IP"
echo ""
echo "More info: See ANDROID_SETUP.md"
echo ""
