#!/bin/bash

# 🔥 Character Chat - Build & Deploy Script

echo "=== Character Chat Android Build Script ==="
echo ""

# Check if Android SDK is installed
if [ ! -d "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME not set. Please install Android Studio first."
    exit 1
fi

echo "✅ Android SDK found at: $ANDROID_HOME"
echo ""

# Build options
read -p "Build type (debug/release)? [debug]: " BUILD_TYPE
BUILD_TYPE=${BUILD_TYPE:-debug}

echo "🔨 Building $BUILD_TYPE APK..."
echo ""

cd android
./gradlew clean assemble${BUILD_TYPE^}

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    
    if [ "$BUILD_TYPE" = "debug" ]; then
        APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
        echo "📱 APK location: $APK_PATH"
        echo ""
        read -p "Install on device? (y/n): " INSTALL
        if [ "$INSTALL" = "y" ]; then
            adb install -r "$APK_PATH"
            echo "✅ Installation complete!"
        fi
    else
        APK_PATH="app/build/outputs/apk/release/app-release.apk"
        echo "📦 Release APK location: $APK_PATH"
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
