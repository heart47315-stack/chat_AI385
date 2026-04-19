@echo off
REM 🔥 Character Chat - Build & Deploy Script (Windows)

echo === Character Chat Android Build Script ===
echo.

REM Check if Android SDK is installed
if "%ANDROID_HOME%"=="" (
    echo ❌ ANDROID_HOME not set. Please install Android Studio first.
    exit /b 1
)

echo ✅ Android SDK found at: %ANDROID_HOME%
echo.

REM Build type
set BUILD_TYPE=debug
if not "%1"=="" set BUILD_TYPE=%1

echo 🔨 Building %BUILD_TYPE% APK...
echo.

cd android
call gradlew.bat clean assemble%BUILD_TYPE%

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ Build successful!
    echo.
    
    if "%BUILD_TYPE%"=="debug" (
        set APK_PATH=app\build\outputs\apk\debug\app-debug.apk
        echo 📱 APK location: %APK_PATH%
        echo.
        echo Ready to install on device!
    ) else (
        set APK_PATH=app\build\outputs\apk\release\app-release.apk
        echo 📦 Release APK location: %APK_PATH%
    )
) else (
    echo ❌ Build failed!
    exit /b 1
)
