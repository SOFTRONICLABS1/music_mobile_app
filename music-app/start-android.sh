#!/bin/bash

# Start Android emulator and run app

echo "🤖 Starting Android development..."

# Add Android SDK tools to PATH
export PATH="$PATH:$HOME/Library/Android/sdk/platform-tools:$HOME/Library/Android/sdk/emulator"

# Check if emulator is already running
if adb devices | grep -q "emulator"; then
    echo "✅ Emulator already running"
else
    echo "🚀 Starting emulator..."
    # Get first available emulator
    EMULATOR_NAME=$(emulator -list-avds | head -1)
    if [ -n "$EMULATOR_NAME" ]; then
        echo "📱 Starting emulator: $EMULATOR_NAME"
        emulator -avd "$EMULATOR_NAME" &
        echo "⏳ Waiting for emulator to boot..."
        sleep 15
    else
        echo "❌ No emulators found. Please create one in Android Studio."
        exit 1
    fi
fi

# Start Metro and run app
echo "📦 Building and installing app..."
npx react-native run-android

# Launch the app manually if adb failed
echo "🚀 Launching app..."
adb shell am start -n com.googlesign/com.googlesign.MainActivity -a android.intent.action.MAIN -c android.intent.category.LAUNCHER

echo "🎉 Android app started successfully!"